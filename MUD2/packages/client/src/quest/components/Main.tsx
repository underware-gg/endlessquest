import { useComponentValue, useEntityQuery, useRow } from "@latticexyz/react";
import { useMUD } from "../../store";
import { Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";
import { useEffect } from "react";

export const Main = () => {
  const {
    networkLayer: {
      components: { Counter, Doors, Tiles },
      systemCalls: { increment, decrement, bridge_tokenId, bridge_chamber },
      singletonEntity, storeCache,
    }
  } = useMUD();


  return (
    <div className='Main'>

    </div>
  );
};
