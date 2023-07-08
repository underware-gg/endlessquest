import { getComponentValue, runQuery, Has, HasValue, Entity } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Direction } from '../layers/phaser/constants'

// Quest
// import { nanoid } from 'nanoid'
// import Cookies from 'universal-cookie'
import * as ethers from 'ethers'
import {
  getTokenIdToCoords,
  getChamberData,
  coordToCompass,
  Tile as CrawlerTile,
  Dir as CrawlerDir,
} from '@rsodre/crawler-data'

// const cookies = new Cookies()

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, storeCache }: SetupNetworkResult,
  {
    Counter,
    Token,
    Realm,
    Chamber,
    Agent,
    Position,
    Tile,
  }: ClientComponents
) {

  // let playerName = cookies.get('playerName')
  // if (!playerName || playerName == '') {
  //   playerName = nanoid()
  //   cookies.set('playerName', playerName, { path: '/' })
  // }
  const playerName = 'Player'

  //---------------------------------
  // Counter example
  //
  const increment = async () => {
    const counter = await storeCache.tables.Counter.get({ key: singletonEntity })
    console.log(`INCREMENT from...`, counter?.value ?? '?')
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    const result = getComponentValue(Counter, singletonEntity);
    console.log(`INCREMENT to...`, result?.value ?? '?')
    return result
  };
  const decament = async () => {
    const counter = await storeCache.tables.Counter.get({ key: singletonEntity })
    console.log(`DECAMENT from...`, counter?.value ?? '?')
    for (let i = 0; i < 10; ++i) {
      const tx = await worldSend("increment", []);
      // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    }
    const result = getComponentValue(Counter, singletonEntity);
    console.log(`DECAMENT to...`, result?.value ?? '?')
    return result
  };



  //---------------------------
  // Quest
  //

  const bridge_realm = async (coord: bigint) => {
    // check if already bridged
    let stored_realm = await storeCache.tables.Realm.get({ coord })
    if (stored_realm != null) {
      console.warn(`STORED_REALM:`, coord, stored_realm)
    } else {
      console.warn(`BRIDGING_REALM...`, coord)
      const tx = await worldSend('setRealm', [
        coord,
      ])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      const result = await storeCache.tables.Realm.get({ coord })
      console.warn(`BRIDGED_REALM = `, result)
      // return result
    }
  }

  const bridge_tokenId = async (tokenId: number) => {
    // check if already bridged
    let stored_coord = await storeCache.tables.Token.get({ tokenId })
    if (stored_coord != null) {
      console.warn(`STORED_TOKEN:`, tokenId, stored_coord)
    } else {
      // fetch
      const { coord } = getTokenIdToCoords(tokenId)
      console.warn(`BRIDGING_TOKEN...`, tokenId, coord)
      // store
      const tx = await worldSend('setTokenIdToCoord', [
        tokenId,
        coord,
      ])
      // return stored value
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      const result = await storeCache.tables.Token.get({ tokenId })
      console.warn(`BRIDGED_TOKEN = `, result)
      return result
    }
  }

  const bridge_chamber = async (coord: bigint) => {
    const compass = coordToCompass(coord)
    const chamberData = getChamberData(coord.toString())
    // initialize tiles
    let map = new Array(20 * 20)
    for (let i = 0; i < map.length; ++i) {
      map[i] = { tileType: 0, index: -1 }
    }
    // fill Chamber tilemap
    const tilemap = ethers.utils.arrayify(chamberData.tilemap)
    let gemPos = { gridX: 0, gridY: 0 }
    Object.values(tilemap).forEach((tileType, index) => {
      const doorDir = chamberData.doors.findIndex((i) => i > 0 && i == index)
      const isEntry = (doorDir == chamberData.entryDir)
      const x = 2 + index % 16
      const y = 2 + Math.floor(index / 16)
      map[y * 20 + x] = {
        x, y,
        index,
        tileType,
        doorDir,
        isEntry,
      }
    })
    // calculate grid positions
    map.forEach(async (tile, index) => {
      let gridX = (index % 20)
      let gridY = Math.floor(index / 20)
      if (compass?.east && compass.east > 0) gridX += ((compass.east - 1) * 20)
      if (compass?.west && compass.west > 0) gridX -= (compass.west * 20)
      if (compass?.south && compass.south > 0) gridY += ((compass.south - 1) * 20)
      if (compass?.north && compass.north > 0) gridY -= (compass.north * 20)
      if (tile.tileType == CrawlerTile.Gem) {
        gemPos = { gridX, gridY }
      }
      map[index] = {
        ...map[index],
        gridX,
        gridY,
      }
      // open corridors
      if (tile.doorDir === CrawlerDir.North && !chamberData.locks[CrawlerDir.North]) {
        map[(tile.y - 1) * 20 + tile.x].tileType = CrawlerTile.Exit
        map[(tile.y - 2) * 20 + tile.x].tileType = CrawlerTile.Exit
      } else if (tile.doorDir === CrawlerDir.East && !chamberData.locks[CrawlerDir.East]) {
        map[tile.y * 20 + tile.x + 1].tileType = CrawlerTile.Exit
        map[tile.y * 20 + tile.x + 2].tileType = CrawlerTile.Exit
      } else if (tile.doorDir === CrawlerDir.West && !chamberData.locks[CrawlerDir.West]) {
        map[tile.y * 20 + tile.x - 1].tileType = CrawlerTile.Exit
        map[tile.y * 20 + tile.x - 2].tileType = CrawlerTile.Exit
      } else if (tile.doorDir === CrawlerDir.South && !chamberData.locks[CrawlerDir.South]) {
        map[(tile.y + 1) * 20 + tile.x].tileType = CrawlerTile.Exit
        map[(tile.y + 2) * 20 + tile.x].tileType = CrawlerTile.Exit
      }
    })
    //
    // check if already bridged
    let stored_chamber = await storeCache.tables.Chamber.get({ coord })
    if (stored_chamber != null) {
      console.warn(`STORED_CHAMBER:`, coord, stored_chamber)
    } else {
      //
      // Create Chamber
      console.warn(`BRIDGING_CHAMBER...`, compass, chamberData)
      let tx = await worldSend('setChamber', [
        coord,
        chamberData.seed,
        chamberData.tokenId,
        chamberData.yonder,
        chamberData.chapter,
        chamberData.terrain,
        chamberData.entryDir,
        chamberData.gemPos,
        chamberData.gemType,
        chamberData.coins,
        chamberData.worth,
      ])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      const result = await storeCache.tables.Chamber.get({ coord })
      console.warn(`BRIDGED_CHAMBER = `, result)
    }

    // Query returns sets...
    // https://bobbyhadz.com/blog/javascript-get-first-element-of-set

    // let agentQuery = runQuery([Has(Agent), HasValue(Position, { x: gemPos.gridX, y: gemPos.gridY })])
    const agentQuery = runQuery([HasValue(Agent, { coord })])
    if (agentQuery.size > 0) {
      const [agentEntity] = agentQuery;
      console.warn(`STORED_AGENT:`, coord, agentEntity)
    } else {
      //
      // Create Agent
      console.warn(`CREATING_AGENT...`, coord)
      let tx = await worldSend('setAgent', [
        coord,
        chamberData.seed,
        chamberData.tokenId,
        chamberData.yonder,
        chamberData.terrain,
        chamberData.gemType,
        chamberData.coins,
        chamberData.worth,
        gemPos.gridX,
        gemPos.gridY,
      ])
      // wait to commit transaction
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      //
      // Set Chamber agent
      // this query must return only 1 value
      const agentQuery = runQuery([Has(Agent), HasValue(Position, { x: gemPos.gridX, y: gemPos.gridY })])
      const [agentEntity] = agentQuery;
      console.log(`LINKING_AGENT...`, coord, agentEntity)
      tx = await worldSend('setChamberAgent', [
        coord,
        agentEntity,
      ])
      // wait to commit transaction
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    }

    //
    // Bridge Tiles
    let tileCount = 0
    map.forEach(async (tile, index) => {
      // Tile exist?
      const tileQuery = runQuery([Has(Tile), HasValue(Position, { x: tile.gridX, y: tile.gridY })])
      if (tileQuery.size == 0) {
        setTimeout(async () => {
          const tx = await worldSend('setTile', [
            coord,
            chamberData.tokenId,
            chamberData.terrain,
            tile.tileType,
            tile.gridX,
            tile.gridY,
            tile.isEntry ?? false,
            tile.doorDir ?? -1
          ])
          await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
          // console.log(`SETTILE()`, coord, tile.gridX, tile.gridY, tx)
        }, ++tileCount * 20);
      }
    })
  }

  
  //---------------------------
  // Player / Movement
  //
  const spawnAtPosition = async (x: number, y: number) => {
    console.warn(`SPAWN @`, x, y)
    const tx = await worldSend('spawnAtPosition', [playerName, x, y])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
  }
  const moveToDirection = async (direction: Direction) => {
    const tx = await worldSend('moveToDirection', [direction])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
  }
  const moveToPosition = async (x: number, y: number) => {
    const tx = await worldSend('moveToPosition', [x, y])
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
  }


  //---------------------------
  // Metadata
  //
  const setRealmMetadata = async (coord: bigint, metadata: string) => {
    if (coord && metadata) {
      // let stored_metadata = await storeCache.tables.ChamberMetadata.get({ coord })
      // if (stored_metadata == null) {
      console.warn(`STORE REALM METADATA @`, coord, metadata)
      const tx = await worldSend('setRealmMetadata', [coord, metadata])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      // }
    }
  }
  const setChamberMetadata = async (coord: bigint, metadata: string) => {
    if (coord && metadata) {
      // let stored_metadata = await storeCache.tables.ChamberMetadata.get({ coord })
      // if (stored_metadata == null) {
      console.warn(`STORE CHAMBER METADATA @`, coord, metadata)
      const tx = await worldSend('setChamberMetadata', [coord, metadata])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      // }
    }
  }
  const setAgentMetadata = async (entity: Entity, metadata: string) => {
    if (entity && metadata) {
      // let stored_metadata = await storeCache.tables.Metadata.get({ key: entity })
      // if (stored_metadata == null) {
      console.warn(`STORE AGENT METADATA @`, entity, metadata)
      const tx = await worldSend('setAgentMetadata', [entity, metadata])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
      // }
    }
  }

  //---------------------------
  // Art Url
  //
  const setRealmArtUrl = async (coord: bigint, url: string) => {
    if (coord && url) {
      console.warn(`STORE REALM IMAGE URL @`, coord, url)
      const tx = await worldSend('setRealmArtUrl', [coord, url])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    }
  }
  const setChamberArtUrl = async (coord: bigint, url: string) => {
    if (coord && url) {
      console.warn(`STORE CHAMBER IMAGE URL @`, coord, url)
      const tx = await worldSend('setChamberArtUrl', [coord, url])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    }
  }
  const setAgentArtUrl = async (entity: Entity, url: string) => {
    if (entity && url) {
      console.warn(`STORE AGENT IMAGE URL @`, entity, url)
      const tx = await worldSend('setAgentArtUrl', [entity, url])
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash)
    }
  }

  return {
    // Counter
    increment,
    decament,
    // Crawler
    bridge_realm,
    bridge_tokenId,
    bridge_chamber,
    // Player
    spawnAtPosition,
    moveToDirection,
    moveToPosition,
    // Metadata
    setRealmMetadata,
    setChamberMetadata,
    setAgentMetadata,
    // Art url
    setRealmArtUrl,
    setChamberArtUrl,
    setAgentArtUrl,
  };
}
