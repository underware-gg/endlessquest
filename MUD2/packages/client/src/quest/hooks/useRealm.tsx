import React from 'react'
import { useMUD } from '../../store'
import { useRealmMetadata } from './MetadataContext'

export const useRealm = () => {
  const {
    networkLayer: {
      components: { Chamber },
      storeCache,
    }
  } = useMUD()

  const coord = 1n

  const { metadata, isFetching: metadataIsFetching, isError: metadataIsError } = useRealmMetadata(coord)

  // const { url } = useChamberProfileImage(coord)
  const url = null

  return {
    metadata: metadata ?? null,
    metadataIsFetching,
    metadataIsError,
    url: url ?? null,
  }
}
