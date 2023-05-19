import { useComponentValue, useEntityQuery, useRow } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { Has, HasValue } from "@latticexyz/recs";

export const App = () => {
  const {
    components: { Counter, Token },
    systemCalls: { increment, tokenIdToCoord },
    network: { singletonEntity, storeCache },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);
  const tokenId = counter?.value ?? 0

  // query by KEY
  const token = useRow(storeCache, { table: "Token", key: { tokenId: BigInt(tokenId) } });

  // query by VALUE
  // const token = useEntityQuery([HasValue(Token, { coord: BigInt(tokenId) })])


  return (
    <>
      <div>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button>
      <hr />
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("get coord:", await tokenIdToCoord(BigInt(tokenId)));
        }}
      >
        Make coord
      </button>
      <div>coord: {token?.value?.coord?.toString() ?? '?'}</div>
    </>
  );
};
