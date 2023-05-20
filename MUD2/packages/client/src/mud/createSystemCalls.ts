import { getComponentValue, getEntitiesWithValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import * as bridge from "../bridge/bridge";
import * as ethers from "ethers";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, storeCache }: SetupNetworkResult,
  { Counter, Token }: ClientComponents,
) {
  //
  // CounterSystem
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
    const coord = await bridge.tokenIdToCoord(tokenId)
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

  const bridge_chamber = async (coord: bigint) => {
    // check if already bridged
    let stored_chamber = storeCache.tables.Chamber.get({ coord });
    if (stored_chamber != null) {
      console.log(`STORED_CHAMBER:`, stored_chamber)
      return
    }
    // fetch
    const chamberData = await bridge.coordToChamberData(coord)
    console.warn(`BRIDGE_CHAMBER`, chamberData)
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
    console.warn(`BRIDGED_CHAMBER = `, result)
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
    console.log(`MAP_0`, map)
    Object.values(ethers.utils.arrayify(chamberData.tilemap)).forEach(async (tileType, index) => {
      const x = 2 + index % 16
      const y = 2 + Math.floor(index / 16)
      map[y * 20 + x] = tileType
    })
    console.log(`MAP_1`, map)
    map.forEach(async (tileType, index) => {
      const gridX = index % 20
      const gridY = Math.floor(index / 20)
      await worldSend("setTile", [
        // coord,
        // index,
        chamberData.terrain,
        tileType,
        // tileX,
        // tileY,
        gridX,
        gridY,
      ]);
    })

    return result
  };

  return {
    increment,
    decrement,
    bridge_tokenId,
    bridge_chamber,
  };
}
