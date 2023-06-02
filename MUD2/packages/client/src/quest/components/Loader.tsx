import { useMemo } from 'react'
import { useEntityQuery, useRow } from '@latticexyz/react'
import { HasValue, Entity } from '@latticexyz/recs'
import { normalizeEntityID } from '@latticexyz/network'
import { useMUD } from '../../store'
import { useBridgeContext, useBridgeToken, useBridgeChamber, useBridgeRealm } from '../hooks/BridgeContext'
import { useRequestChamberMetadata, useRequestRealmMetadata, useRequestAgentMetadata } from '../hooks/MetadataContext'
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
// Realm Loader
//
interface RealmLoaderProps {
  coord: bigint,
}

export const RealmLoader = ({
  coord = 0n,
}: RealmLoaderProps) => {

  useBridgeRealm(coord)

  // request Realm metadata
  const { isSuccess, isError, isFetching } = useRequestRealmMetadata(coord)

  return (
    <div>
      Realm(<span>{coord.toString() ?? '?'}) </span>
      {isSuccess ? '.' : isError ? '?' : isFetching ? 'm' : 'M'}
    </div>
  )
}


//-------------------------------
// Token Loader
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
// Chamber + Agent Loader
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
      components: { Tile },
      storeCache,
    }
  } = useMUD()

  useBridgeChamber(coord)

  const chamberData = useRow(storeCache, { table: 'Chamber', key: { coord } })
  const seed = useMemo(() => (chamberData?.value?.seed?.toString() ?? null), [chamberData])
  const agentEntity = useMemo(() => normalizeEntityID(chamberData?.value?.agent ?? '0'), [chamberData])

  const tiles = useEntityQuery([HasValue(Tile, { terrain: chamberData?.value?.terrain })]) ?? []

  const slug = Crawl.coordToSlug(coord)

  const { isFetching: chamberIsFetching, isError: chamberIsError, isSuccess: chamberIsSuccess } = useRequestChamberMetadata(coord)
  const { isFetching: agentIsFetching, isError: agentIsError, isSuccess: agentIsSuccess } = useRequestAgentMetadata(agentEntity)

  return (
    <div>
      Chamber(<span>{slug ?? '?'}) </span>
      {Boolean(seed) ? '.' : 'C'}
      {tiles.length == 400 ? '.' : tiles.length > 0 ? 't' : 'T'}
      {chamberIsSuccess ? '.' : chamberIsError ? '?' : chamberIsFetching ? 'm': 'M'}
      {false ? '.' : 'I'}
      {' | '}
      {agentIsSuccess ? '.' : agentIsError ? '?' : agentIsFetching ? 'm' : 'M'}
      {false ? '.' : 'I'}
    </div>
  )
}
