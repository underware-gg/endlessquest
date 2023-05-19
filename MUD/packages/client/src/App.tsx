import { useComponentValue, useEntityQuery, useRow } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { Has, HasValue } from "@latticexyz/recs";
import { useEffect } from "react";

export const App = () => {
  const {
    components: { Counter, Token },
    systemCalls: { increment, set_tokenIdToCoord },
    network: { singletonEntity, storeCache },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);
  const tokenId = counter?.value ?? 0

  // query by KEY
  const token = useRow(storeCache, { table: "Token", key: { tokenId: BigInt(tokenId) } });
  const coord = token?.value?.coord?.toString() ?? null

  console.log(`APP`, tokenId, coord, token)
  useEffect(() => {
    if (tokenId && coord == null) {
      console.log(`USE_EFFECT_SET_____`)
      set_tokenIdToCoord(BigInt(tokenId))
    }
  }, [tokenId, coord])

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
      {/* <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("get coord:", await tokenIdToCoord(BigInt(tokenId)));
        }}
      >
        Make coord
      </button> */}
      <div>coord: {coord ?? '?'}</div>
    </>
  );
};
