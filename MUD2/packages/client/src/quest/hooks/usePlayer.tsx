import { useMemo } from 'react';
import { useComponentValue } from '@latticexyz/react';
import { useMUD } from '../../store';
import { useCoord } from './useCoord';

export const usePlayer = () => {
  const {
    networkLayer: {
      components: { Player, Position, Location },
      // systemCalls: { increment, decrement, bridge_tokenId, bridge_chamber },
      playerEntity,
    }
  } = useMUD()

  const player = useComponentValue(Player, playerEntity);
  const position = useComponentValue(Position, playerEntity);
  const location = useComponentValue(Location, playerEntity);
  const { compass, slug } = useCoord(location?.coord ?? 0n)

  return {
    position,
    name: player?.name ?? null,
    level: player?.level ?? null,
    coord: location?.coord ?? null,
    agent: location?.agent ?? undefined,
    compass,
    slug,
  }
}
