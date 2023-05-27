import { Entity, getComponentValue, getEntitiesWithValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Direction } from "../layers/phaser/constants";
import * as Bridge from "../quest/bridge/bridge";
import * as Crawl from "../quest/bridge/Crawl";
import * as ethers from "ethers";
import Cookies from 'universal-cookie';
import { nanoid } from 'nanoid'

const _entityToBytes32 = (entity: string) => {
  return "0x" + entity.replace("0x", "").padStart(64, "0");
};

export type SystemCalls = ReturnType<typeof createSystemCalls>;

const cookies = new Cookies();

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, storeCache }: SetupNetworkResult,
  { Counter, Token }: ClientComponents,
) {

  let playerName = cookies.get('playerName')
  if (!playerName || playerName == '') {
    playerName = nanoid()
    cookies.set('playerName', playerName, { path: '/' });
  }

  //-----------------------------------
  // CounterSystem
  //
  const increment = async () => {
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };
  const decrement = async () => {
    const tx = await worldSend("decrement", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const bridge_tokenId = async (tokenId: bigint) => {
    // check if already bridged
    let stored_coord = storeCache.tables.Token.get({ tokenId });
    if (stored_coord != null) {
      console.log(`STORED_COORD:`, stored_coord)
      return
    }
    // fetch
    const coord = await Bridge.tokenIdToCoord(tokenId)
    console.warn(`BRIDGE_tokenIdToCoord:`, tokenId, coord)
    // store
    const tx = await worldSend("setTokenIdToCoord", [
      tokenId,
      coord,
    ]);
    // return stored value
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Token, singletonEntity);
  };

  //---------------------------
  // Crawler
  //
  const bridge_chamber = async (coord: bigint) => {
    // check if already bridged
    let stored_chamber = storeCache.tables.Chamber.get({ coord });
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
    const tx = await worldSend("setChamber", [
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
    ]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    const result = storeCache.tables.Chamber.get({ coord });
    // console.warn(`BRIDGED_CHAMBER = `, result)
    //
    // store Doors
    chamberData.doors.forEach(async (door, dir) => {
      await worldSend("setDoor", [
        coord,
        door,
        dir,
        chamberData.locks[dir],  // locked
      ]);
    })
    //
    // store Tiles
    let gemPos = { gridX: 0, gridY: 0 }
    const tilemap = ethers.utils.arrayify(chamberData.tilemap)
    let map = Array(20 * 20).fill({ tileType: 0 });
    Object.values(tilemap).forEach(async (tileType, index) => {
      const x = 2 + index % 16
      const y = 2 + Math.floor(index / 16)
      map[y * 20 + x] = { tileType, index }
      if (index == chamberData.doors[0] && !chamberData.locks[0]) {
        map[(y - 1) * 20 + x] = { tileType: 2 } // exit door
        map[(y - 2) * 20 + x] = { tileType: 2 } // exit door
      } else if (index == chamberData.doors[1] && !chamberData.locks[1]) {
        map[y * 20 + x + 1] = { tileType: 2 } // exit door
        map[y * 20 + x + 2] = { tileType: 2 } // exit door
      } else if (index == chamberData.doors[2] && !chamberData.locks[2]) {
        map[y * 20 + x - 1] = { tileType: 2 } // exit door
        map[y * 20 + x - 2] = { tileType: 2 } // exit door
      } else if (index == chamberData.doors[3] && !chamberData.locks[3]) {
        map[(y + 1) * 20 + x] = { tileType: 2 } // exit door
        map[(y + 2) * 20 + x] = { tileType: 2 } // exit door
      }
    })
    map.forEach(async (tile, index) => {
      const doorDir = chamberData.doors.findIndex((i) => i > 0 && i == tile.index)
      const isEntry = (doorDir == chamberData.entryDir)
      let gridX = (index % 20)
      let gridY = Math.floor(index / 20)
      if (compass.east > 0) gridX += ((compass.east - 1) * 20)
      if (compass.west > 0) gridX -= (compass.west * 20)
      if (compass.south > 0) gridY += ((compass.south - 1) * 20)
      if (compass.north > 0) gridY -= (compass.north * 20)
      if (tile.tileType == 4) gemPos = { gridX, gridY }
      await worldSend("setTile", [
        chamberData.terrain,
        tile.tileType,
        isEntry,
        gridX,
        gridY,
        doorDir,
        coord
      ]);
    })
    //
    // Create Agent
    await worldSend("setAgent", [
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
    ]);
    return result
  };

  //---------------------------
  // Metadata
  //
  const setChamberMetadata = (coord: bigint, metadata: string) => {
    if (coord && metadata) {
      console.warn(`STORE CHAMBER METADATA @`, coord, metadata)
      worldSend("setChamberMetadata", [coord, metadata]);
    }
  };
  const setAgentMetadata = (key: Entity, metadata: string) => {
    if (key && metadata) {
      const id = _entityToBytes32(key)
      console.warn(`STORE AGENT METADATA @`, id, metadata)
      worldSend("setAgentMetadata", [id, metadata]);
    }
  };

  const setChamberProfileImage = (coord: bigint, url: string) => {
    if (coord && url) {
      console.warn(`STORE CHAMBER IMAGE URL @`, coord, url)
      worldSend("setChamberProfileImage", [coord, url]);
    }
  };
  const setAgentProfileImage = (key: Entity, url: string) => {
    if (key && url) {
      const id = _entityToBytes32(key)
      console.warn(`STORE AGENT IMAGE URL @`, id, url)
      worldSend("setAgentProfileImage", [id, url]);
    }
  };

  //---------------------------
  // Player / Movement
  //
  const spawn = (x: number, y: number) => {
    console.warn(`SPAWN @`, x, y)
    worldSend("spawn", [playerName, x, y]);
  };
  const move = (direction: Direction) => {
    worldSend("move", [direction]);
  }

  return {
    // Exmaple
    increment,
    decrement,
    // Crawler
    bridge_tokenId,
    bridge_chamber,
    // Metadata
    setChamberMetadata,
    setAgentMetadata,
    setChamberProfileImage,
    setAgentProfileImage,
    // Player
    spawn,
    move,
  };
}
