import { getComponentValue, getEntitiesWithValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { Direction } from "../layers/phaser/constants";
import * as Bridge from "../bridge/bridge";
import * as Compass from "../bridge/compass";
import * as ethers from "ethers";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, storeCache }: SetupNetworkResult,
  { Counter, Token }: ClientComponents,
) {

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
    console.warn(`BRIDGE_COORD:`, coord)
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
    const compass = Compass.coordToCompass(coord)
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
    let map = Array(20 * 20).fill(0);
    Object.values(ethers.utils.arrayify(chamberData.tilemap)).forEach(async (tileType, index) => {
      const x = 2 + index % 16
      const y = 2 + Math.floor(index / 16)
      map[y * 20 + x] = tileType
      if (index == chamberData.doors[0] && !chamberData.locks[0]) {
        map[(y - 1) * 20 + x] = 255
        map[(y - 2) * 20 + x] = 255
      } else if (index == chamberData.doors[1] && !chamberData.locks[1]) {
        map[y * 20 + x + 1] = 255
        map[y * 20 + x + 2] = 255
      } else if (index == chamberData.doors[2] && !chamberData.locks[2]) {
        map[y * 20 + x - 1] = 255
        map[y * 20 + x - 2] = 255
      } else if (index == chamberData.doors[3] && !chamberData.locks[3]) {
        map[(y + 1) * 20 + x] = 255
        map[(y + 2) * 20 + x] = 255
      }
    })
    map.forEach(async (tileType, index) => {
      const isEntry = (index == chamberData.doors[chamberData.entryDir])
      let gridX = (index % 20)
      let gridY = Math.floor(index / 20)
      if (compass.east > 0) gridX += ((compass.east - 1) * 20)
      if (compass.west > 0) gridX -= (compass.west * 20)
      if (compass.south > 0) gridY += ((compass.south - 1) * 20)
      if (compass.north > 0) gridY -= (compass.north * 20)
      await worldSend("setTile", [
        chamberData.terrain,
        tileType,
        isEntry,
        gridX,
        gridY,
      ]);
    })
    return result
  };

  //---------------------------
  // Player / Movement
  //
  const spawn = (x: number, y: number) => {
    console.warn(`SPAWN@`, x, y)
    worldSend("spawn", [x, y]);
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
    // Player
    spawn,
    move,
  };
}
