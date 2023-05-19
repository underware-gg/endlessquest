import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Counter, Token, Chamber }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldSend("increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const tokenIdToCoord = async (tokenId: bigint) => {
    const tx = await worldSend("tokenIdToCoord", [tokenId]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Token, singletonEntity);
  };

  // const tokenURI = async (tokenId: string) => {
  //   const tx = await worldSend("tokenURI", [tokenId]);
  //   await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  //   return getComponentValue(Chamber, singletonEntity);
  // };

  return {
    increment,
    tokenIdToCoord,
  };
}
