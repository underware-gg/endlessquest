import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import * as bridge from "../bridge/bridge";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, storeCache }: SetupNetworkResult,
  { Counter, Token, Chamber }: ClientComponents,
  // { Token: TokenTable }: Tables,
) {
  const increment = async () => {
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const set_tokenIdToCoord = async (tokenId: bigint) => {

    let stored_coord = storeCache.tables.Token.get({ tokenId });
    if (stored_coord != null) {
      console.log(`STORED_COORD`, stored_coord)
      return
    }
    
    const coord = await bridge.tokenIdToCoord(tokenId)
    const tx = await worldSend("set_tokenIdToCoord", [tokenId, coord]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    const result = getComponentValue(Token, singletonEntity);
    console.log(`SET_COORD`, coord)
    return result
  };

  // const tokenURI = async (tokenId: string) => {
  //   const tx = await worldSend("tokenURI", [tokenId]);
  //   await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  //   return getComponentValue(Chamber, singletonEntity);
  // };

  return {
    increment,
    set_tokenIdToCoord,
  };
}
