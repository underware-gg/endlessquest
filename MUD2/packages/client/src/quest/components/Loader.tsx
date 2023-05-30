import { useEffect, useMemo } from 'react'
import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react'
import { Has, HasValue, getComponentValueStrict } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { useBridgeContext, useBridgeToken, useBridgeChamber } from '../hooks/BridgeContext'
import { useRequestChamberMetadata } from '../hooks/MetadataContext'
import * as Crawl from '../bridge/Crawl'

export const Loader = () => {
  const { tokens, chambers } = useBridgeContext()

  const loaders = useMemo(() => {
    let result = []
    for (let i = 0; i < tokens.length; ++i) {
      const tokenId = tokens[i]
      result.push(<TokenLoader key={`token_${tokenId.toString()}`} tokenId={tokenId} />)
    }
    for (let i = 0; i < chambers.length; ++i) {
      const coord = chambers[i]
      result.push(<ChamberLoader key={`chamber_${coord.toString()}`} coord={coord} />)
    }
    return result
  }, [tokens.length, chambers.length])
  // console.log(`BRIDGE>>>>>>>>>>>>`, tokens, chambers, loaders)

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

  // request Realm metadata
  const { isFetching, isSuccess } = useRequestChamberMetadata(1n)

  return (
    <div>
      Loader(<span>{tokenId.toString() ?? '?'}) </span>
      {coordOk ? '.' : 'T'}
      {isSuccess ? '.' : isFetching ? 'm' : 'M'}
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
      Loader(<span>{slug ?? '?'}) </span>
      {coordOk ? '.' : 'T'}
      {chamberOk ? '.' : 'C'}
      {tilesOk ? '.' : 'T'}
      {isSuccess ? '.' : isFetching ? 'm': 'M'}
      {false ? '.' : 'I'}
    </div>
  )
}

