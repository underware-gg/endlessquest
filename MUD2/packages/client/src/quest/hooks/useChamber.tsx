import { useMemo } from 'react'
import { useComponentValue, useRow } from '@latticexyz/react'
import { useMUD } from '../../store'
import { useCoord } from './useCoord'
import { usePlayer } from './usePlayer'
import { GemNames } from '../bridge/Crawl'
import { useChamberProfileImage } from './useProfileImage'
import { useChamberMetadata } from './MetadataContext'

export const useChamber = () => {
  const {
    networkLayer: {
      components: { Chamber },
      storeCache,
    }
  } = useMUD()

  const { coord } = usePlayer()
  const chamber = useRow(storeCache, { table: 'Chamber', key: { coord: (coord ?? 0n) } })
  const { compass, slug } = useCoord(coord ?? 0n)

  const { metadata, isFetching: metadataIsFetching, isError: metadataIsError } = useChamberMetadata(coord ?? 0n)

  const { url } = useChamberProfileImage(coord ?? 0n)

  return {
    coord: coord ?? null,
    compass,
    slug,
    tokenId: chamber?.value?.tokenId ?? null,
    seed: chamber?.value?.seed ?? null,
    yonder: chamber?.value?.yonder ?? null,
    gemType: chamber?.value?.gemType ?? null,
    gemName: chamber?.value?.gemType != null ? GemNames[chamber?.value.gemType] : '?',
    coins: chamber?.value?.coins ?? null,
    worth: chamber?.value?.worth ?? null,
    metadata: metadata ?? null,
    metadataIsFetching,
    metadataIsError,
    url: url ?? null,
  }
}
