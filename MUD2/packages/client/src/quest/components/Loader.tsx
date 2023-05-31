import { useMemo } from 'react'
import { useEntityQuery, useRow } from '@latticexyz/react'
import { HasValue } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { useBridgeContext, useBridgeToken, useBridgeChamber, useBridgeRealm } from '../hooks/BridgeContext'
import { useRequestChamberMetadata, useRequestRealmMetadata } from '../hooks/MetadataContext'
import * as Crawl from '../bridge/Crawl'

export const Loader = () => {
  const { realms, tokens, chambers } = useBridgeContext()

  const loaders = useMemo(() => {
    let result = []
    for (let i = 0; i < realms.length; ++i) {
      const coord = realms[i]
      result.push(<RealmLoader key={`realm_${coord.toString()}`} coord={coord} />)
    }
    for (let i = 0; i < tokens.length; ++i) {
      const tokenId = tokens[i]
      result.push(<TokenLoader key={`token_${tokenId.toString()}`} tokenId={tokenId} />)
    }
    for (let i = 0; i < chambers.length; ++i) {
      const coord = chambers[i]
      result.push(<ChamberLoader key={`chamber_${coord.toString()}`} coord={coord} />)
    }
    return result
  }, [realms.length, tokens.length, chambers.length])

  // force bridge Realm #1
  useBridgeRealm(1n)

  // force bridge token #1
  useBridgeToken(1n)

  return (
    <div className='Loader Infos'>
      <div className='LoaderContent'>
        {loaders}
      </div>
    </div>
  )
}


//-------------------------------
// TokenLoader
//
interface TokenLoaderProps {
  tokenId: bigint,
}

export const TokenLoader = ({
  tokenId = 0n,
}: TokenLoaderProps) => {
  const {
    networkLayer: {
      storeCache,
    }
  } = useMUD()

  // bridge token #1
  useBridgeToken(tokenId)

  const token = useRow(storeCache, { table: 'Token', key: { tokenId } })
  const coord = useMemo(() => (token?.value?.coord ?? 0n), [token])
  const coordOk = Boolean(coord)

  // bridge this chamber
  useBridgeChamber(coord)

  return (
    <div>
      Token(<span>{tokenId.toString() ?? '?'}) </span>
      {coordOk ? '.' : 'T'}
    </div>
  )
}


//-------------------------------
// TokenLoader
//
interface ChamberLoaderProps {
  tokenId?: bigint | null,
  coord: bigint,
}

export const ChamberLoader = ({
  tokenId = null,
  coord = 0n,
}: ChamberLoaderProps) => {
  const {
    networkLayer: {
      components: { Tiles },
      storeCache,
    }
  } = useMUD()

  useBridgeChamber(coord)

  const chamberData = useRow(storeCache, { table: 'Chamber', key: { coord } })
  const chamberTokenId = useMemo(() => (chamberData?.value?.tokenId.toString() ?? null), [chamberData])
  const seed = useMemo(() => (chamberData?.value?.seed?.toString() ?? null), [chamberData])

  // const doors = useEntityQuery([HasValue(Doors, { coord })]) ?? []
  const tiles = useEntityQuery([HasValue(Tiles, { terrain: chamberData?.value?.terrain })]) ?? []

  const coordOk = Boolean(coord)
  const chamberOk = Boolean(seed)
  const tilesOk = tiles.length > 0

  // const compass = Crawl.coordToCompass(coord)
  // const slug = Crawl.compassToSlug(compass)
  const slug = Crawl.coordToSlug(coord)

  // request Chamber metadata
  const { isFetching, isSuccess } = useRequestChamberMetadata(coord)

  return (
    <div>
      Chamber(<span>{slug ?? '?'}) </span>
      {coordOk ? '.' : 'T'}
      {chamberOk ? '.' : 'C'}
      {tilesOk ? '.' : 'T'}
      {isSuccess ? '.' : isFetching ? 'm': 'M'}
      {false ? '.' : 'I'}
    </div>
  )
}

//-------------------------------
// RealmLoader
//
interface RealmLoaderProps {
  coord: bigint,
}

export const RealmLoader = ({
  coord = 0n,
}: RealmLoaderProps) => {
  const {
    networkLayer: {
      components: { Tiles },
      storeCache,
    }
  } = useMUD()

  useBridgeRealm(coord)

  // request Realm metadata
  const { isFetching, isSuccess } = useRequestRealmMetadata(coord)

  return (
    <div>
      Realm(<span>{coord.toString() ?? '?'}) </span>
      {isSuccess ? '.' : isFetching ? 'm' : 'M'}
    </div>
  )
}
