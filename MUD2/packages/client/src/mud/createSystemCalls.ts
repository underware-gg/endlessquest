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
import { coordToCompass } from '@rsodre/crawler-data'
import * as Bridge from '../quest/bridge/bridge'
import * as ethers from 'ethers'
import Cookies from 'universal-cookie'
import { nanoid } from 'nanoid'

export type SystemCalls = ReturnType<typeof createSystemCalls>

const cookies = new Cookies()

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, storeCache }: SetupNetworkResult,
  { Tile, Agent, Position }: ClientComponents,
) {

  let playerName = cookies.get('playerName')
  if (!playerName || playerName == '') {
    playerName = nanoid()
    cookies.set('playerName', playerName, { path: '/' })
  }

  //---------------------------
  // Crawler
  //

  const bridge_tokenId = async (tokenId: bigint) => {
    // check if already bridged
    let stored_coord = await storeCache.tables.Token.get({ tokenId })
    if (stored_coord != null) {
      console.log(`STORED_COORD:`, stored_coord)
    } else {
      // fetch
      const coord = await Bridge.tokenIdToCoord(tokenId)
      console.warn(`BRIDGE_tokenIdToCoord:`, tokenId, coord)
      // store
      const tx = await worldSend('setTokenIdToCoord', [
        tokenId,
        coord,
      ])
      // return stored value
      // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      // return getComponentValue(Token, singletonEntity)
    }
  }

  const bridge_realm = async (coord: bigint) => {
    // check if already bridged
    let stored_realm = await storeCache.tables.Realm.get({ coord })
    if (stored_realm != null) {
      console.log(`STORED_REALM:`, stored_realm)
    } else {
      console.warn(`BRIDGE_REALM`, coord)
      const tx = await worldSend('setRealm', [
        coord,
      ])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      const result = await storeCache.tables.Realm.get({ coord })
      console.warn(`BRIDGED_REALM = `, result)
      // return result
    }
  }

  const bridge_chamber = async (coord: bigint) => {
    const compass = coordToCompass(coord)
    const chamberData = await Bridge.coordToChamberData(coord)
    // Parse Tiles
    let gemPos = { gridX: 0, gridY: 0 }
    const tilemap = ethers.utils.arrayify(chamberData.tilemap)
    let map = Array(20 * 20).fill({ tileType: 0 })
    Object.values(tilemap).forEach((tileType, index) => {
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
    //
    // check if already bridged
    let stored_chamber = await storeCache.tables.Chamber.get({ coord })
    if (stored_chamber != null) {
      console.log(`STORED_CHAMBER:`, stored_chamber)
    } else {
      //
      // Create Chamber
      console.warn(`BRIDGE_CHAMBER`, compass, chamberData)
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
      const result = await storeCache.tables.Chamber.get({ coord })
      console.warn(`BRIDGED_CHAMBER = `, result)
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
      agentQuery.forEach(async (entity) => {
        console.log(`AGENT TO CHAMBER...`, coord, entity)
        await worldSend('setChamberAgent', [
          coord,
          entity,
        ])
      })
    }
    //
    // Bridge Tiles
    map.forEach(async (tile, index) => {
      const isEntry = (tile.doorDir == chamberData.entryDir)
      let gridX = (index % 20)
      let gridY = Math.floor(index / 20)
      if (compass?.east && compass.east > 0) gridX += ((compass.east - 1) * 20)
      if (compass?.west && compass.west > 0) gridX -= (compass.west * 20)
      if (compass?.south && compass.south > 0) gridY += ((compass.south - 1) * 20)
      if (compass?.north && compass.north > 0) gridY -= (compass.north * 20)
      if (tile.tileType == 4) gemPos = { gridX, gridY }
      // Tile exist?
      const tileQuery = runQuery([Has(Tile), HasValue(Position, { x: gridX, y: gridY })])
      if (tileQuery.size == 0) {
        await worldSend('setTile', [
          chamberData.terrain,
          tile.tileType,
          isEntry,
          gridX,
          gridY,
          tile.doorDir ?? -1,
          coord
        ])
      }
    })
  }

  //---------------------------
  // Metadata
  //
  const setRealmMetadata = async (coord: bigint, metadata: string) => {
    if (coord && metadata) {
      // let stored_metadata = await storeCache.tables.ChamberMetadata.get({ coord })
      // if (stored_metadata == null) {
      console.warn(`STORE REALM METADATA @`, coord, metadata)
      await worldSend('setRealmMetadata', [coord, metadata])
      // }
    }
  }
  const setChamberMetadata = async (coord: bigint, metadata: string) => {
    if (coord && metadata) {
      // let stored_metadata = await storeCache.tables.ChamberMetadata.get({ coord })
      // if (stored_metadata == null) {
      console.warn(`STORE CHAMBER METADATA @`, coord, metadata)
      await worldSend('setChamberMetadata', [coord, metadata])
      // }
    }
  }
  const setAgentMetadata = async (entity: Entity, metadata: string) => {
    if (entity && metadata) {
      // let stored_metadata = await storeCache.tables.Metadata.get({ key: entity })
      // if (stored_metadata == null) {
      console.warn(`STORE AGENT METADATA @`, entity, metadata)
      await worldSend('setAgentMetadata', [entity, metadata])
      // }
    }
  }

  //---------------------------
  // Art Url
  //
  const setRealmArtUrl = async (coord: bigint, url: string) => {
    if (coord && url) {
      console.warn(`STORE REALM IMAGE URL @`, coord, url)
      await worldSend('setRealmArtUrl', [coord, url])
    }
  }
  const setChamberArtUrl = async (coord: bigint, url: string) => {
    if (coord && url) {
      console.warn(`STORE CHAMBER IMAGE URL @`, coord, url)
      await worldSend('setChamberArtUrl', [coord, url])
    }
  }
  const setAgentArtUrl = async (entity: Entity, url: string) => {
    if (entity && url) {
      console.warn(`STORE AGENT IMAGE URL @`, entity, url)
      await worldSend('setAgentArtUrl', [entity, url])
    }
  }

  //---------------------------
  // Player / Movement
  //
  const spawnAtPosition = async (x: number, y: number) => {
    console.warn(`SPAWN @`, x, y)
    await worldSend('spawnAtPosition', [playerName, x, y])
  }
  const moveToDirection = async (direction: Direction) => {
    await worldSend('moveToDirection', [direction])
  }
  const moveToPosition = async (x: number, y: number) => {
    await worldSend('moveToPosition', [x, y])
  }

  return {
    // Crawler
    bridge_realm,
    bridge_tokenId,
    bridge_chamber,
    // Metadata
    setRealmMetadata,
    setChamberMetadata,
    setAgentMetadata,
    // Art url
    setRealmArtUrl,
    setChamberArtUrl,
    setAgentArtUrl,
    // Player
    spawnAtPosition,
    moveToDirection,
    moveToPosition,
  }
}
