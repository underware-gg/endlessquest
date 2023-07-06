import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity, storeCache }: SetupNetworkResult,
  { Counter }: ClientComponents
) {
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
    for(let i = 0 ; i < 10; ++i) {
      const tx = await worldSend("increment", []);
      // await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    }
    const result = getComponentValue(Counter, singletonEntity);
    console.log(`DECAMENT to...`, result?.value ?? '?')
    return result
  };

  return {
    increment,
    decament,
  };
}
