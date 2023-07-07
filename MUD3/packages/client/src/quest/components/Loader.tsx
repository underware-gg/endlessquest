import { useMemo } from 'react'
import { useEntityQuery, useRow } from '@latticexyz/react'
import { HasValue, Entity } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { useBridgeContext, useBridgeToken, useBridgeChamber, useBridgeRealm } from '../hooks/BridgeContext'
// TODO...
// import {
//   useRequestRealmMetadata, useRequestChamberMetadata, useRequestAgentMetadata,
//   useRequestRealmArtUrl, useRequestChamberArtUrl, useRequestAgentArtUrl,
// } from '../hooks/MetadataContext'
import { useSettingsContext } from '../hooks/SettingsContext'
import { coordToSlug } from '@rsodre/crawler-data'

export const Loader = () => {
  const { realmCoord } = useSettingsContext()
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

  // force bridge selected Realm
  useBridgeRealm(realmCoord)

  // force bridge token #1
  useBridgeToken(1)
  useBridgeToken(2)
  useBridgeToken(3)
  useBridgeToken(4)

  return (
    <div className='Loader Infos Smaller'>
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
  const {
    networkLayer: {
      storeCache,
    }
  } = useMUD()

  const bridging = useBridgeRealm(coord)

  const realm = useRow(storeCache, { table: 'Realm', key: { coord } })
  const opener = useMemo(() => (realm?.value?.opener ?? null), [realm])
  const openerOk = Boolean(opener)

  // TODO...
  // const { isSuccess: metaIsSuccess, isError: metaIsError, isFetching: metaIsFetching } = useRequestRealmMetadata(coord)
  // const { isSuccess: urlIsSuccess, isError: urlIsError, isFetching: urlIsFetching } = useRequestRealmArtUrl(coord)

  return (
    <div>
      Realm(<span>{coord.toString() ?? '?'}) </span>
      {openerOk ? '.' : bridging ? 'r' : 'R'}
      {/* TODO... */}
      {/* {metaIsSuccess ? '.' : metaIsError ? '?' : metaIsFetching ? 'm' : 'M'} */}
      {/* {urlIsSuccess ? '.' : urlIsError ? '?' : urlIsFetching ? 'i' : 'I'} */}
    </div>
  )
}


//-------------------------------
// Token Loader
//
interface TokenLoaderProps {
  tokenId: number,
}

export const TokenLoader = ({
  tokenId = 0,
}: TokenLoaderProps) => {
  const {
    networkLayer: {
      storeCache,
    }
  } = useMUD()

  // bridge token #1
  const bridging = useBridgeToken(tokenId)

  const token = useRow(storeCache, { table: 'Token', key: { tokenId } })
  const coord = useMemo(() => (token?.value?.coord ?? 0n), [token])
  const coordOk = Boolean(coord)

  // bridge this chamber
  useBridgeChamber(coord)

  return (
    <div>
      Token(<span>{tokenId.toString() ?? '?'}) </span>
      {coordOk ? '.' : bridging ? 't' : 'T'}
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
      // components: { Tile },
      storeCache,
    }
  } = useMUD()

  const bridging = useBridgeChamber(coord)

  const slug = coordToSlug(coord)

  const chamberData = useRow(storeCache, { table: 'Chamber', key: { coord } })
  const seed = useMemo(() => (chamberData?.value?.seed?.toString() ?? null), [chamberData])
  // const agentEntity = useMemo(() => (chamberData?.value?.agent ?? '0x0'), [chamberData]) as Entity

  // TODO...
  // const tiles = useEntityQuery([HasValue(Tile, { tokenId: chamberData?.value?.tokenId ?? 0 })]) ?? []

  // TODO...
  // const { isSuccess: chamberIsSuccess, isError: chamberIsError, isFetching: chamberIsFetching } = useRequestChamberMetadata(coord)
  // const { isSuccess: agentIsSuccess, isError: agentIsError, isFetching: agentIsFetching } = useRequestAgentMetadata(agentEntity)

  // TODO...
  // const { isSuccess: chamberArtIsSuccess, isError: chamberArtIsError, isFetching: chamberArtIsFetching } = useRequestChamberArtUrl(coord)
  // const { isSuccess: agentArtIsSuccess, isError: agentArtIsError, isFetching: agentArtIsFetching } = useRequestAgentArtUrl(agentEntity)

  return (
    <div>
      Chamber(<span>{slug ?? '?'}) </span>
      {Boolean(seed) ? '.' : bridging ? 'c' : 'C'}
      {/* TODO... */}
      {/* {tiles.length == 400 ? '.' : tiles.length > 0 ? 't' : 'T'} */}
      {/* TODO... */}
      {/* {chamberIsSuccess ? '.' : chamberIsError ? '?' : chamberIsFetching ? 'm': 'M'} */}
      {/* {chamberArtIsSuccess ? '.' : chamberArtIsError ? '?' : chamberArtIsFetching ? 'i' : 'I'} */}
      {/* {' | '} */}
      {/* {agentIsSuccess ? '.' : agentIsError ? '?' : agentIsFetching ? 'm' : 'M'} */}
      {/* {agentArtIsSuccess ? '.' : agentArtIsError ? '?' : agentArtIsFetching ? 'i' : 'I'} */}
      {/* {' | '} */}
      {/* {tiles.length} */}
    </div>
  )
}
