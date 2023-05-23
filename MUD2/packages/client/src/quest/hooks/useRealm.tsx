import { useMemo } from 'react';
import { useComponentValue, useRow } from '@latticexyz/react';
import { useMUD } from '../../store';
import { useCoord } from './useCoord';
import { usePlayer } from './usePlayer';
import { GemNames } from '../bridge/Crawl';
import { useRealmMetadata } from './useMetadata'
import { useChamberProfileImage } from './useProfileImage';

export const useRealm = () => {
  const {
    networkLayer: {
      components: { Chamber },
      storeCache,
    }
  } = useMUD()

  const coord = 999n

  const { metadata, isWaiting } = useRealmMetadata(coord)

  // const { url } = useChamberProfileImage(coord)
  const url = null

  return {
    metadata: metadata ?? null,
    url: url ?? null,
    isWaiting,
  }
}
