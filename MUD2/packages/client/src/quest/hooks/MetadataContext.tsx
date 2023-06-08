import React, { ReactNode, createContext, useReducer, useContext, useEffect, useMemo } from 'react'
import { useRow, useComponentValue } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { useMUD } from '../../store'
import promptMetadata, { MetadataType, PromptMetadataOptions, PromptMetadataResponse } from '../openai/promptMetadata'
import { generateImage, ImageOptions, ImageResponse, ImageSize } from '../openai/generateImage'
import { useHyperspaceContext } from '../hyperspace/hooks/HyperspaceContext'
import { prompts } from '../prompts/prompts'
import { questChamber } from '../hyperspace/core/merge/crdt-type'

//
// React + Typescript + Context
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
//

//--------------------------------
// Constants
//
export enum ContentType {
  Metadata = 'metadata',
  Url = 'url',
}

export const initialState = {
  [ContentType.Metadata]: {
    [MetadataType.None]: {}, // required by MetadataStateType
    [MetadataType.Realm]: {},
    [MetadataType.Chamber]: {},
    [MetadataType.Agent]: {},
    [MetadataType.Player]: {},
  },
  [ContentType.Url]: {
    [MetadataType.None]: {}, // required by MetadataStateType
    [MetadataType.Realm]: {},
    [MetadataType.Chamber]: {},
    [MetadataType.Agent]: {},
    [MetadataType.Player]: {},
  },
}

const MetadataActions = {
  SET: 'SET',
}

//--------------------------------
// Types
//
enum StatusType {
  Unknown = 0,
  Fetching = 1,
  Success = 2,
  Error = 99,
}

type MetadataStateType = {
  [content in ContentType]: {
    [type in MetadataType]: {
      [key: string]: StatusType
    }
  }
}

type KeyType = bigint | Entity

type PayloadType = {
  content: ContentType,
  type: MetadataType,
  key: KeyType,
  status: StatusType,
  metadata?: string | null,
  url?: string | null,
}
type ActionType =
  | { type: 'SET', payload: PayloadType }



//--------------------------------
// Context
//
const MetadataContext = createContext<{
  state: MetadataStateType
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => null,
})

//--------------------------------
// Provider
//
interface MetadataProviderProps {
  children: string | JSX.Element | JSX.Element[] | ReactNode
  systemCalls: any,
}
const MetadataProvider = ({
  children,
  systemCalls,
}: MetadataProviderProps) => {
  const { QuestRealm, QuestChamber, QuestAgent } = useHyperspaceContext()
  const {
    setChamberMetadata, setRealmMetadata, setAgentMetadata,
    setChamberArtUrl, setRealmArtUrl, setAgentArtUrl,
  } = systemCalls

  const [state, dispatch] = useReducer((state: MetadataStateType, action: ActionType) => {
    const { content, type, key, status, metadata, url } = action.payload
    // console.log(`____CONTEXT IMAGE META`, content, type, key, status, metadata, url)
    const _key = key.toString()
    let newState = { ...state }
    switch (action.type) {
      case MetadataActions.SET:
        const currentStatus = state[content][type][_key]
        if (status != currentStatus) {
          newState[content][type] = {
            ...state[content][type],
            [_key]: status,
          }
          if (status == StatusType.Success) {
            try {
              if (content == ContentType.Metadata && metadata) {
                const _meta = JSON.stringify(metadata)
                if (_meta == '{}') throw (`Empty metadata {}`)
                if (type == MetadataType.Realm) {
                  setRealmMetadata(key, _meta)
                  QuestRealm.updateRealmMetadata(key, metadata)
                } else if (type == MetadataType.Chamber) {
                  setChamberMetadata(key, _meta)
                  QuestChamber.updateChamberMetadata(key, metadata)
                } else if (type == MetadataType.Agent) {
                  setAgentMetadata(key, _meta)
                } else {
                  throw (`Invalid metadata type ${type}`)
                }
              } else if (content == ContentType.Url && url) {
                if (type == MetadataType.Realm) {
                  setRealmArtUrl(key, url)
                  QuestRealm.updateRealmArtUrl(key, url)
                } else if (type == MetadataType.Chamber) {
                  setChamberArtUrl(key, url)
                  QuestChamber.updateChamberArtUrl(key, url)
                } else if (type == MetadataType.Agent) {
                  setAgentArtUrl(key, url)
                } else {
                  throw (`Invalid metadata type ${type}`)
                }
              }
            } catch (e) {
              console.warn(`MetadataContext metadata.[${type}][${_key}] exception:`, e)
              newState[content][type][_key] = StatusType.Error
            }
          }
        }
        break
      default:
        console.warn(`MetadataProvider: Unknown action [${action.type}]`)
        return state
    }
    return newState
  }, initialState)

  // const dispatchMetadata = (type:string, payload:any) => {
  //   dispatch({ type, payload })
  // }

  return (
    <MetadataContext.Provider value={{ state, dispatch }}>
      {children}
    </MetadataContext.Provider>
  )
}

export { MetadataProvider, MetadataContext, MetadataActions }





//--------------------------------
// Generic Requests
//

const useRequestGenericMetadata = (
  content: ContentType,
  type: MetadataType,
  key: KeyType,
  currentValue: string | null,
  options: PromptMetadataOptions | ImageOptions,
  _parseResult: ((matadata: any) => any | null) | null) => {
  const { dispatch } = useContext(MetadataContext)
  const { isUnknown, isFetching, isError, isSuccess } = useStatus(content, type, key)
  const isMetadata = content == ContentType.Metadata

  useEffect(() => {
    let payload: PayloadType = {
      content,
      type,
      key,
      status: StatusType.Unknown,
      metadata: null,
      url: null,
    }

    const _generate = async () => {
      payload.status = StatusType.Fetching
      dispatch({
        type: MetadataActions.SET,
        payload,
      })
      const response = isMetadata ? 
        await promptMetadata(options as PromptMetadataOptions)
        : await generateImage(options as ImageOptions)

      payload.status = StatusType.Unknown
      
      if (response.error) {
        payload.status = StatusType.Error
      } else if (isMetadata) {
        const resp = response as PromptMetadataResponse
        if (resp.metadata) {
          payload.metadata = _parseResult?.(resp.metadata)
          payload.status = payload.metadata ? StatusType.Success : StatusType.Error
        }
      } else {
        const resp = response as ImageResponse
        if (resp.url) {
          payload.url = resp.url
          payload.status = payload.url ? StatusType.Success : StatusType.Error
        }
      }

      dispatch({
        type: MetadataActions.SET,
        payload,
      })
    }

    if (isUnknown && key !== 0n && key != '') {
      if (currentValue === '') {
        _generate()
      } else if (currentValue && currentValue.length > 0) {
        payload.status = StatusType.Success
        dispatch({
          type: MetadataActions.SET,
          payload,
        })
      }
    }

  }, [isUnknown, currentValue])

  return {
    isUnknown,
    isFetching,
    isSuccess,
    isError,
  }
}


//--------------------------------
// Metadata Requests
//

//
// Realm Metadata
//
export const useRequestRealmMetadata = (coord: bigint) => {
  const { networkLayer: { storeCache } } = useMUD()

  const realmRow = useRow(storeCache, { table: 'Realm', key: { coord } })
  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })

  const realm = useMemo(() => (realmRow?.value ?? null), [realmRow])
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])

  useEffect(() => { console.log(`REALM META:`, coord, realm, `[${metadata}]`) }, [coord, realm, metadata])

  const options: PromptMetadataOptions = {
    type: MetadataType.Realm,
    terrain: null,
    gemType: null,
    coins: null,
    yonder: null,
  }

  const _parseResult = (responseMetadata: any): any | null => {
    const worldMetadata = responseMetadata.world ?? null
    if (!worldMetadata) return null
    return {
      name: worldMetadata.world_name ?? worldMetadata.name ?? '[name]',
      description: worldMetadata.world_description ?? worldMetadata.description ?? '[description]',
      premise: worldMetadata.world_premise ?? worldMetadata.premise ?? '[premise]',
      boss: worldMetadata.world_boss ?? worldMetadata.boss ?? '[boss]',
      quirk: worldMetadata.world_boss_quirk ?? worldMetadata.quirk ?? '[quirk]',
      treasure: worldMetadata.world_treasure ?? worldMetadata.treasure ?? '[treasure]',
    }
  }

  return useRequestGenericMetadata(
    ContentType.Metadata,
    MetadataType.Realm,
    coord,
    realm ? metadata : null,
    options,
    _parseResult
  )
}

//
// Chamber Metadata
//
export const useRequestChamberMetadata = (coord: bigint) => {
  const { networkLayer: { storeCache } } = useMUD()

  const chamberRow = useRow(storeCache, { table: 'Chamber', key: { coord } })
  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })

  const chamber = useMemo(() => (chamberRow?.value ?? null), [chamberRow])
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])

  useEffect(() => { console.log(`CHAMBER META:`, chamber?.tokenId, `[${metadata}]`) }, [chamber, metadata])

  const options: PromptMetadataOptions = useMemo(() => ({
    type: MetadataType.Chamber,
    terrain: chamber?.terrain ?? null,
    gemType: chamber?.gemType ?? null,
    coins: chamber?.coins ?? null,
    yonder: chamber?.yonder ?? null,
  }), [chamber])

  const _parseResult = (responseMetadata: any): any | null => {
    const chamberMetadata = responseMetadata.chamber ?? null
    if (!chamberMetadata) return null
    return {
      name: chamberMetadata.chamber_name ?? chamberMetadata.name ?? '[name]',
      description: chamberMetadata.chamber_description ?? chamberMetadata.description ?? '[description]',
      terrain: chamber?.terrain ?? null,
      yonder: chamber?.yonder ?? null,
      gemType: chamber?.gemType ?? null,
      coins: chamber?.coins ?? null,
    }
  }

  return useRequestGenericMetadata(
    ContentType.Metadata,
    MetadataType.Chamber,
    coord,
    chamber ? metadata : null,
    options,
    _parseResult
  )
}

//
// Agent Metadata
//
export const useRequestAgentMetadata = (agentEntity: Entity | undefined) => {
  const { networkLayer: { components: { Agent, Metadata } } } = useMUD()

  // const entity = useMemo(() => normalizeEntityID(agentEntity ?? '0'), [agentEntity])

  const agent = useComponentValue(Agent, agentEntity) ?? null
  const metadataData = useComponentValue(Metadata, agentEntity) ?? null
  const metadata = useMemo(() => (metadataData?.metadata ?? null), [metadataData])

  const options: PromptMetadataOptions = useMemo(() => ({
    type: MetadataType.Agent,
    terrain: agent?.terrain ?? null,
    gemType: agent?.gemType ?? null,
    coins: agent?.coins ?? null,
    yonder: agent?.yonder ?? null,
  }), [agent])

  useEffect(() => { console.log(`AGENT META:`, agentEntity, agent, `[${metadata}]`) }, [agentEntity, agent, metadata])

  const _parseResult = (responseMetadata: any): any | null => {
    const agentMetadata = responseMetadata.npc ?? responseMetadata.chamber?.npc ?? null
    // console.log(`>>>>>> AGENT META RESULT`, agentMetadata, responseMetadata)
    if (!agentMetadata) return null
    return {
      name: agentMetadata.name ?? '[name]',
      description: agentMetadata.description ?? '[description]',
      behaviour_mode: agentMetadata.behaviour_mode ?? '[behaviour]',
      quirk: agentMetadata.quirk ?? '[quirk]',
      terrain: agent?.terrain,
      yonder: agent?.yonder,
      gemType: agent?.gemType,
      coins: agent?.coins,
    }
  }

  return useRequestGenericMetadata(
    ContentType.Metadata,
    MetadataType.Agent,
    agentEntity ?? ('' as Entity),
    agent ? metadata : null,
    options,
    _parseResult
  )
}





//--------------------------------
// Art url Requests
//

//
// Realm Art
//
export const useRequestRealmArtUrl = (coord: bigint) => {
  const { networkLayer: { storeCache } } = useMUD()

  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])
  const url = useMemo(() => (metadataRow?.value?.url ?? null), [metadataRow])

  const prompt = useMemo(() => {
    if (metadata && url === '') {
      const meta = JSON.parse(metadata)
      if (meta.name) {
        return `${meta.name}, ${meta.description}`
      }
    }
    return ''
  }, [metadata, url])

  // @ts-ignore
  useEffect(() => { console.log(`REALM ART URL IMAGE:`, coord, prompt, `[${url}]`) }, [prompt, url])

  const options: ImageOptions = {
    prompt,
    size: ImageSize.Medium,
  }

  return useRequestGenericMetadata(
    ContentType.Url,
    MetadataType.Realm,
    coord,
    (prompt || url) ? url : null,
    options,
    null
  )
}

//
// Chamber Art
//
export const useRequestChamberArtUrl = (coord: bigint) => {
  const { networkLayer: { storeCache } } = useMUD()

  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])
  const url = useMemo(() => (metadataRow?.value?.url ?? null), [metadataRow])

  const prompt = useMemo(() => {
    if (metadata && url === '') {
      const meta = JSON.parse(metadata)
      if (meta.description) {
        const pertype = prompts.chamberPrompts[meta?.terrain ?? 0] ?? ''
        return `${pertype} ${meta.description}`
      }
    }
    return ''
  }, [metadata, url])

  // @ts-ignore
  useEffect(() => { console.log(`CHAMBER ART URL IMAGE:`, coord, prompt, `[${url}]`) }, [prompt, url])

  const options: ImageOptions = {
    prompt,
    size: ImageSize.Medium,
  }

  return useRequestGenericMetadata(
    ContentType.Url,
    MetadataType.Chamber,
    coord,
    (prompt || url) ? url : null,
    options,
    null
  )
}

//
// Agent Art
//
export const useRequestAgentArtUrl = (agentEntity: Entity) => {
  const {
    networkLayer: {
      components: { Agent, Metadata },
    }
  } = useMUD()

  const agent = useComponentValue(Agent, agentEntity)
  const metadataData = useComponentValue(Metadata, agentEntity)
  const metadata = metadataData?.metadata ?? null
  const url = metadataData?.url ?? null

  const prompt = useMemo(() => {
    if (agent && metadata && !url) {
      const meta = JSON.parse(metadata)
      return `A watercolor portrait of a maritime figure, digital neon art, luminescent deep sea creatures: ${meta.description} nautical steampunk art, watercolor marine landscape, vintage nautical charts`
      // return `${meta.name}, ${meta.description}`
    }
    return ''
  }, [metadata, url])

  // @ts-ignore
  useEffect(() => { console.log(`AGENT ART URL IMAGE:`, url) }, [url])

  const options: ImageOptions = {
    prompt,
    size: ImageSize.Medium,
  }

  return useRequestGenericMetadata(
    ContentType.Url,
    MetadataType.Agent,
    agentEntity,
    (prompt || url) ? url : null,
    options,
    null
  )
}


//--------------------------------
// Generic Hooks
//

export const useMetadataContext = () => {
  const { state } = useContext(MetadataContext)
  return state
}

const useStatus = (content: ContentType, type: MetadataType, key: KeyType | undefined) => {
  const { state } = useContext(MetadataContext)
  const status = key ? state[content][type][key.toString()] : 0
  return {
    isUnknown: (!status),
    isFetching: (status === StatusType.Fetching),
    isSuccess: (status === StatusType.Success),
    isError: (status === StatusType.Error),
  }
}

export const useMetadataStatus = (type: MetadataType, key: KeyType | undefined) => {
  return useStatus(ContentType.Metadata, type, key)
}

export const useArtUrlStatus = (type: MetadataType, key: KeyType | undefined) => {
  return useStatus(ContentType.Url, type, key)
}


//--------------------------------
// Metadata Hooks
//

export const useRealmMetadata = (coord: bigint) => {
  return useChamberMetadata(coord, MetadataType.Realm)
}

export const useChamberMetadata = (coord: bigint, type: MetadataType = MetadataType.Chamber) => {
  const { isUnknown, isFetching, isError, isSuccess } = useMetadataStatus(type, coord)
  const { networkLayer: { storeCache } } = useMUD()

  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])

  return {
    isUnknown,
    isFetching,
    isSuccess,
    isError,
    metadata: metadata ? JSON.parse(metadata) : {},
  }
}

export const useAgentMetadata = (agentEntity: Entity | undefined) => {
  const { isUnknown, isFetching, isError, isSuccess } = useMetadataStatus(MetadataType.Agent, agentEntity)
  const { networkLayer: { components: { Metadata } } } = useMUD()

  const metadataData = useComponentValue(Metadata, agentEntity) ?? null
  const metadata = useMemo(() => (metadataData?.metadata ?? null), [metadataData])

  return {
    isUnknown,
    isFetching,
    isSuccess,
    isError,
    metadata: metadata ? JSON.parse(metadata) : {},
  }
}

//--------------------------------
// Art Url Hooks
//

export const useRealmArtUrl = (coord: bigint) => {
  return useChamberArtUrl(coord, MetadataType.Realm)
}

export const useChamberArtUrl = (coord: bigint, type: MetadataType = MetadataType.Chamber) => {
  const { isUnknown, isFetching, isError, isSuccess } = useArtUrlStatus(type, coord)
  const { networkLayer: { storeCache } } = useMUD()

  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })
  const url = useMemo(() => (metadataRow?.value?.url ?? null), [metadataRow])

  return {
    isUnknown,
    isFetching,
    isSuccess,
    isError,
    url,
  }
}

export const useAgentArtUrl = (agentEntity: Entity | undefined) => {
  const { isUnknown, isFetching, isError, isSuccess } = useArtUrlStatus(MetadataType.Agent, agentEntity)
  const { networkLayer: { components: { Metadata } } } = useMUD()

  const metadataData = useComponentValue(Metadata, agentEntity) ?? null
  const url = useMemo(() => (metadataData?.url ?? null), [metadataData])

  return {
    isUnknown,
    isFetching,
    isSuccess,
    isError,
    url,
  }
}
