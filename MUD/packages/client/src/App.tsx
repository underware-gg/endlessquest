import { useComponentValue, useEntityQuery, useRow } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { Has, HasValue } from "@latticexyz/recs";
import { useEffect } from "react";

export const App = () => {
  const {
    components: { Counter, Token },
    systemCalls: { increment, decrement, bridge_tokenId, bridge_chamber },
    network: { singletonEntity, storeCache },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);
  const tokenId = BigInt(counter?.value?.toString() ?? '0')

  // query by VALUE
  // const token = useEntityQuery([HasValue(Token, { coord: BigInt(tokenId) })])

  // query by KEY
  const token = useRow(storeCache, { table: "Token", key: { tokenId } });
  const coord = token?.value?.coord ?? 0n

  useEffect(() => {
    if (tokenId && !coord) {
      bridge_tokenId(tokenId)
    }
  }, [tokenId, coord])

  useEffect(() => {
    if (coord) {
      bridge_chamber(coord)
    }
  }, [coord])
  const chamberData = useRow(storeCache, { table: "Chamber", key: { coord } });
  const seed = chamberData?.value?.seed?.toString() ?? null

  return (
    <>
      <div>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value < ", await decrement());
        }}
      >Decrement</button>
      <button type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value > ", await increment());
        }}
      >Increment</button>

      <hr />
      {/* <button type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("get coord:", await tokenIdToCoord(BigInt(tokenId)));
        }}
      >
        Make coord
      </button> */}
      <div>coord: {coord?.toString() ?? '?'}</div>

      <hr />
      <div>seed: {seed ?? '?'}</div>

    </>
  );
};
