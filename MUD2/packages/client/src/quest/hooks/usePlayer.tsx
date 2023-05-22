import { useMemo } from 'react';
import { useComponentValue } from '@latticexyz/react';
import { useMUD } from '../../store';
import * as Crawl from '../bridge/Crawl';

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

  const compass = useMemo(() => (Crawl.coordToCompass(location?.coord ?? 0n)), [location])
  const slug = useMemo(() => (Crawl.compassToSlug(compass)), [compass])

  return {
    position,
    name: player?.name ?? '?',
    level: player?.level ?? '?',
    coord: location?.coord ?? '?',
    agent: location?.agent ?? '?',
    compass,
    slug,
  }
}
