import { useMemo } from 'react';
import * as Crawl from '../bridge/Crawl';

export const useCoord = (coord:bigint) => {
  const compass = useMemo(() => (Crawl.coordToCompass(coord ?? 0n)), [coord])
  const slug = useMemo(() => (Crawl.compassToSlug(compass)), [compass])

  return {
    coord,
    compass: coord && compass ? compass : null,
    slug: coord && slug ? slug : null,
  }
}
