import { useMemo } from 'react'
import { coordToCompass, compassToSlug } from '@rsodre/crawler-data'

export const useCoord = (coord:bigint) => {
  const compass = useMemo(() => (coordToCompass(coord ?? 0n)), [coord])
  const slug = useMemo(() => (compassToSlug(compass)), [compass])

  return {
    coord,
    compass: coord && compass ? compass : null,
    slug: coord && slug ? slug : null,
  }
}
