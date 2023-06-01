import {
  Entity,
  getComponentValue,
  Has, HasValue,
  runQuery,
} from "@latticexyz/recs"
import { ContractTransaction } from 'ethers'
import { awaitStreamValue } from '@latticexyz/utils'
import { ClientComponents } from './createClientComponents'
import { SetupNetworkResult } from './setupNetwork'
import { Direction } from '../layers/phaser/constants'
import * as Bridge from '../quest/bridge/bridge'
import * as Crawl from '../quest/bridge/Crawl'
import * as ethers from 'ethers'
import Cookies from 'universal-cookie'
import { nanoid } from 'nanoid'

const _entityToBytes32 = (entity: string) => {
  return '0x' + entity.replace('0x', '').padStart(64, '0') as `0x${string}`
}

export type SystemCalls = ReturnType<typeof createSystemCalls>

const cookies = new Cookies()

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, storeCache }: SetupNetworkResult,
  { Counter, Token, Agent, Position }: ClientComponents,
) {

  let playerName = cookies.get('playerName')
  if (!playerName || playerName == '') {
    playerName = nanoid()
    cookies.set('playerName', playerName, { path: '/' })
  }

  //-----------------------------------
  // CounterSystem
  //
  const increment = async () => {
    const tx = await worldSend('increment', [])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    return getComponentValue(Counter, singletonEntity)
  }
  const decrement = async () => {
    const tx = await worldSend('decrement', [])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    return getComponentValue(Counter, singletonEntity)
  }

  //---------------------------
  // Crawler
  //

  const bridge_tokenId = async (tokenId: bigint) => {
    // check if already bridged
    let stored_coord = storeCache.tables.Token.get({ tokenId })
    if (stored_coord != null) {
      console.log(`STORED_COORD:`, stored_coord)
      return
    }
    // fetch
    const coord = await Bridge.tokenIdToCoord(tokenId)
    console.warn(`BRIDGE_tokenIdToCoord:`, tokenId, coord)
    // store
    const tx = await worldSend('setTokenIdToCoord', [
      tokenId,
      coord,
    ])
    // return stored value
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    return getComponentValue(Token, singletonEntity)
  }

  const bridge_realm = async (coord: bigint) => {
    // check if already bridged
    let stored_realm = storeCache.tables.Realm.get({ coord })
    if (stored_realm != null) {
      console.log(`STORED_REALM:`, stored_realm)
      return
    }
    console.warn(`BRIDGE_REALM`, coord)
    //
    // store Chamber
    const tx = await worldSend('setRealm', [
      coord,
    ])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    const result = storeCache.tables.Realm.get({ coord })
    // console.warn(`BRIDGED_REALM = `, result)
    return result
  }

  const bridge_chamber = async (coord: bigint) => {
    // check if already bridged
    let stored_chamber = storeCache.tables.Chamber.get({ coord })
    if (stored_chamber != null) {
      console.log(`STORED_CHAMBER:`, stored_chamber)
      return
    }
    // fetch
    const chamberData = await Bridge.coordToChamberData(coord)
    const compass = Crawl.coordToCompass(coord)
    console.warn(`BRIDGE_CHAMBER`, compass, chamberData)
    //
    // store Chamber
    const tx = await worldSend('setChamber', [
      coord,
      chamberData.tokenId,
      chamberData.seed,
      chamberData.yonder,
      chamberData.chapter,
      chamberData.terrain,
      chamberData.entryDir,
      chamberData.gemPos,
      chamberData.hoard.gemType,
      chamberData.hoard.coins,
      chamberData.hoard.worth,
    ])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    const result = storeCache.tables.Chamber.get({ coord })
    // console.warn(`BRIDGED_CHAMBER = `, result)
    //
    // store Doors
    chamberData.doors.forEach(async (door, dir) => {
      await worldSend('setDoor', [
        coord,
        door,
        dir,
        chamberData.locks[dir],  // locked
      ])
    })
    //
    // store Tiles
    let gemPos = { gridX: 0, gridY: 0 }
    const tilemap = ethers.utils.arrayify(chamberData.tilemap)
    let map = Array(20 * 20).fill({ tileType: 0 })
    Object.values(tilemap).forEach(async (tileType, index) => {
      const doorDir = chamberData.doors.findIndex((i) => i > 0 && i == index)
      const x = 2 + index % 16
      const y = 2 + Math.floor(index / 16)
      map[y * 20 + x] = { tileType, doorDir, index }
      if (index == chamberData.doors[0] && !chamberData.locks[0]) {
        map[(y - 1) * 20 + x] = { tileType: 2, doorDir }
        map[(y - 2) * 20 + x] = { tileType: 2, doorDir }
      } else if (index == chamberData.doors[1] && !chamberData.locks[1]) {
        map[y * 20 + x + 1] = { tileType: 2, doorDir }
        map[y * 20 + x + 2] = { tileType: 2, doorDir }
      } else if (index == chamberData.doors[2] && !chamberData.locks[2]) {
        map[y * 20 + x - 1] = { tileType: 2, doorDir }
        map[y * 20 + x - 2] = { tileType: 2, doorDir }
      } else if (index == chamberData.doors[3] && !chamberData.locks[3]) {
        map[(y + 1) * 20 + x] = { tileType: 2, doorDir }
        map[(y + 2) * 20 + x] = { tileType: 2, doorDir }
      }
    })
    map.forEach(async (tile, index) => {
      const isEntry = (tile.doorDir == chamberData.entryDir)
      let gridX = (index % 20)
      let gridY = Math.floor(index / 20)
      if (compass.east > 0) gridX += ((compass.east - 1) * 20)
      if (compass.west > 0) gridX -= (compass.west * 20)
      if (compass.south > 0) gridY += ((compass.south - 1) * 20)
      if (compass.north > 0) gridY -= (compass.north * 20)
      if (tile.tileType == 4) gemPos = { gridX, gridY }
      await worldSend('setTile', [
        chamberData.terrain,
        tile.tileType,
        isEntry,
        gridX,
        gridY,
        tile.doorDir,
        coord
      ])
    })
    //
    // Create Agent
    const agentTx = await worldSend('setAgent', [
      coord,
      chamberData.tokenId,
      chamberData.seed,
      chamberData.yonder,
      chamberData.terrain,
      chamberData.hoard.gemType,
      chamberData.hoard.coins,
      chamberData.hoard.worth,
      gemPos.gridX,
      gemPos.gridY,
    ])
    // wait to commit transaction
    await awaitStreamValue(txReduced$, (txHash) => txHash === agentTx.hash)
    //
    // Set Chamber agent
    // this query must return only 1 value
    const agentQuery = runQuery([Has(Agent), HasValue(Position, { x: gemPos.gridX, y: gemPos.gridY })])
    console.log(`AGENT QUERY`, agentQuery)
    agentQuery.forEach(async (entity) => {
      const key = _entityToBytes32(entity)
      console.log(`AGENT TO CHAMBER...`, coord, entity, key)
      await worldSend('setChamberAgent', [
        coord,
        key,
      ])
    })
    //
    // return ChamberData
    return result
  }

  //---------------------------
  // Metadata
  //
  const setRealmMetadata = (coord: bigint, metadata: string) => {
    if (coord && metadata) {
      // let stored_metadata = storeCache.tables.ChamberMetadata.get({ coord })
      // if (stored_metadata == null) {
      console.warn(`STORE REALM METADATA @`, coord, metadata)
      worldSend('setRealmMetadata', [coord, metadata])
      // }
    }
  }
  const setChamberMetadata = (coord: bigint, metadata: string) => {
    if (coord && metadata) {
      // let stored_metadata = storeCache.tables.ChamberMetadata.get({ coord })
      // if (stored_metadata == null) {
        console.warn(`STORE CHAMBER METADATA @`, coord, metadata)
        worldSend('setChamberMetadata', [coord, metadata])
      // }
    }
  }
  const setAgentMetadata = (entity: Entity, metadata: string) => {
    if (entity && metadata) {
      const key = _entityToBytes32(entity)
      // let stored_metadata = storeCache.tables.Metadata.get({ key })
      // if (stored_metadata == null) {
        console.warn(`STORE AGENT METADATA @`, key, metadata)
        worldSend('setAgentMetadata', [key, metadata])
      // }
    }
  }

  const setChamberProfileImage = (coord: bigint, url: string) => {
    if (coord && url) {
      console.warn(`STORE CHAMBER IMAGE URL @`, coord, url)
      worldSend('setChamberProfileImage', [coord, url])
    }
  }
  const setAgentProfileImage = (entity: Entity, url: string) => {
    if (entity && url) {
      const id = _entityToBytes32(entity)
      console.warn(`STORE AGENT IMAGE URL @`, id, url)
      worldSend('setAgentProfileImage', [id, url])
    }
  }

  //---------------------------
  // Player / Movement
  //
  const spawn = (x: number, y: number) => {
    console.warn(`SPAWN @`, x, y)
    worldSend('spawn', [playerName, x, y])
  }
  const move = (direction: Direction) => {
    worldSend('move', [direction])
  }

  return {
    // Example
    increment,
    decrement,
    // Crawler
    bridge_realm,
    bridge_tokenId,
    bridge_chamber,
    // Metadata
    setRealmMetadata,
    setChamberMetadata,
    setAgentMetadata,
    setChamberProfileImage,
    setAgentProfileImage,
    // Player
    spawn,
    move,
  }
}
