import { useMemo } from 'react'
import { useRow } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { useCoord } from './useCoord'
import { usePlayer } from './usePlayer'
import { Gem, GemNames } from '@rsodre/crawler-data'
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

  const agentEntity = useMemo(() => (chamber?.value?.agent ?? '0x0'), [chamber]) as Entity

  const {
    metadata,
    artUrl,
    isFetching: metadataIsFetching,
    isError: metadataIsError,
  } = useChamberMetadata(coord ?? 0n)

  return {
    coord: coord ?? null,
    compass,
    slug,
    tokenId: chamber?.value?.tokenId ?? null,
    seed: chamber?.value?.seed ?? null,
    yonder: chamber?.value?.yonder ?? null,
    gemType: chamber?.value?.gemType ?? null,
    gemName: chamber?.value?.gemType != null ? GemNames[chamber?.value.gemType as Gem] : '?',
    coins: chamber?.value?.coins ?? null,
    worth: chamber?.value?.worth ?? null,
    agentEntity,
    metadata: metadata ?? null,
    metadataIsFetching,
    metadataIsError,
    artUrl: artUrl ?? null,
  }
}
