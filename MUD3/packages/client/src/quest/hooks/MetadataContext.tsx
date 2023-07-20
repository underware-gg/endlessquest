import React, { ReactNode, createContext, useReducer, useContext, useEffect, useMemo } from 'react'
import {
  promptMetadata,
  MetadataType, PromptMetadataOptions, PromptMetadataResponse,
  generateImage, ImageOptions, ImageResponse, ImageSize,
  GPTModel,
  prompts,
  Keys, getKey,
} from 'endlessquestagent'
import { useSettingsContext } from '../hooks/SettingsContext'
// Hyperspace
import { useHyperspaceContext } from '../hyperspace/hooks/HyperspaceContext'
import { useAgentMetadataDocument, useChamberMetadataDocument, useRealmMetadataDocument } from '../hyperspace/hooks/useMetadataDocument'
import { QuestRealmDoc, QuestChamberDoc, QuestAgentDoc } from 'hyperbox-sdk'
import { coordToSlug } from '@rsodre/crawler-data'
import { stringToHex } from 'viem'
// MUD
import { useRow, useComponentValue } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
import { useMUD } from '../../store'

//
// React + Typescript + Context
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
//

//--------------------------------
// Constants
//
export enum ContentType {
  Metadata = 'metadata',
  ArtUrl = 'artUrl',
}

export const initialState = {
  gptModel: GPTModel.GPT4,
  data: {
    [ContentType.Metadata]: {
      [MetadataType.None]: {}, // required by MetadataStateType
      [MetadataType.Realm]: {},
      [MetadataType.Chamber]: {},
      [MetadataType.Agent]: {},
      [MetadataType.Player]: {},
    },
    [ContentType.ArtUrl]: {
      [MetadataType.None]: {}, // required by MetadataStateType
      [MetadataType.Realm]: {},
      [MetadataType.Chamber]: {},
      [MetadataType.Agent]: {},
      [MetadataType.Player]: {},
    },
  }
}

const MetadataActions = {
  SET_GPT_MODEL: 'SET_GPT_MODEL',
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
  gptModel: GPTModel,
  data: {
    [content in ContentType]: {
      [type in MetadataType]: {
        [key: string]: StatusType
      }
    }
  }
}

type PayloadType = {
  content: ContentType,
  type: MetadataType,
  key: string,
  status: StatusType,
  metadata?: string | null,
  url?: string | null,
}
type ActionType =
  | { type: 'SET_GPT_MODEL', payload: GPTModel }
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
  networkLayer: any,
}
const MetadataProvider = ({
  children,
  networkLayer,
}: MetadataProviderProps) => {
  const { realmCoord } = useSettingsContext()
  const { remoteStore } = useHyperspaceContext()
  const {
    systemCalls: { },
    storeCache,
  } = networkLayer

  const [state, dispatch] = useReducer((state: MetadataStateType, action: ActionType) => {
    // console.log(`____CONTEXT IMAGE META`, content, type, key, status, metadata, url)
    let newState = { ...state }
    switch (action.type) {
      case MetadataActions.SET_GPT_MODEL: {
        newState.gptModel = action.payload as GPTModel
        break
      }
      case MetadataActions.SET: {
        const { content, type, key, status, metadata, url } = action.payload as PayloadType
        const currentStatus = state.data[content][type][key]
        if (status != currentStatus) {
          newState.data[content][type] = {
            ...state.data[content][type],
            [key]: status,
          }
          if (status == StatusType.Success) {
            try {
              let _setter = async () => {}
              if (content == ContentType.Metadata && metadata) {
                if (Object.keys(metadata).length == 0) throw (`Empty metadata {}`)
                if (type == MetadataType.Realm) {
                  _setter = async () => {
                    QuestRealmDoc.updateMetadata(remoteStore, key, metadata)
                  }
                } else if (type == MetadataType.Chamber) {
                  _setter = async () => {
                    QuestChamberDoc.updateMetadata(remoteStore, realmCoord, key, metadata)
                  }
                } else if (type == MetadataType.Agent) {
                  _setter = async () => {
                    console.log(`____UPDATE AGENT METATADA`, realmCoord, key, metadata)
                    QuestAgentDoc.updateMetadata(remoteStore, realmCoord, key, metadata)
                  }
                } else {
                  throw (`Invalid metadata type ${type}`)
                }
              } else if (content == ContentType.ArtUrl && url) {
                const _uploadArtUrl = async (filename: string, url: string) => {
                  const uploadUrl = `https://hyperspace.stage.fundaomental.com/api/storage/upload/quest/${realmCoord.toString()}/${filename}/${stringToHex(url)}`
                  try {
                    const { data, error } = await (await fetch(uploadUrl, {})).json()
                    return data?.downloadUrl ?? url
                  } catch(e) {
                    console.log(`_uploadArtUrl() ERROR:`, uploadUrl, e)
                  }
                  return url
                }
                if (type == MetadataType.Realm) {
                  _setter = async () => {
                    const downloadUrl = await _uploadArtUrl('realm_art', url)
                    QuestRealmDoc.updateArtUrl(remoteStore, key, downloadUrl)
                  }
                } else if (type == MetadataType.Chamber) {
                  _setter = async () => {
                    const downloadUrl = await _uploadArtUrl(`${key}_chamber_art`, url)
                    QuestChamberDoc.updateArtUrl(remoteStore, realmCoord, key, downloadUrl)
                  }
                } else if (type == MetadataType.Agent) {
                  _setter = async () => {
                    const downloadUrl = await _uploadArtUrl(`${key}_agent_art`, url)
                    QuestAgentDoc.updateArtUrl(remoteStore, realmCoord, key, downloadUrl)
                  }
                } else {
                  throw (`Invalid metadata type ${type}`)
                }
              }
              _setter()
            } catch (e) {
              console.warn(`MetadataContext metadata.[${type}][${key}] exception:`, e)
              newState.data[content][type][key] = StatusType.Error
            }
          }
        }
        break
      }
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
  key: string,
  currentValue: string | null,
  options: PromptMetadataOptions | ImageOptions,
  _parseReponseMetadata: ((matadata: any) => any | null) | null) => {
  const { dispatch } = useContext(MetadataContext)
  const { isUnknown, isFetching, isError, isSuccess } = useStateStatus(content, type, key)
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
          payload.metadata = _parseReponseMetadata?.(resp.metadata)
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

    if (isUnknown && key) {
      if (currentValue === '') {
        _generate()
      } else if (currentValue) {
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
  const realm = useMemo(() => (realmRow?.value ?? null), [realmRow])

  const doc = useRealmMetadataDocument(coord)

  useEffect(() => { console.log(`REALM META DOC:`, coord, realm, doc) }, [coord, realm, doc])

  const { gptModel } = useMetadataContext()

  const options: PromptMetadataOptions = {
    gptModel,
    type: MetadataType.Realm,
    terrain: null,
    gemType: null,
    coins: null,
    yonder: null,
  }

  const _parseReponseMetadata = (responseMetadata: any): any | null => {
    const worldMetadata = responseMetadata.world ?? null
    if (!worldMetadata) return null
    const result = {
      name: worldMetadata.world_name ?? worldMetadata.name ?? null,
      description: worldMetadata.world_description ?? worldMetadata.description ?? null,
      premise: worldMetadata.world_premise ?? worldMetadata.premise ?? '[premise]',
      boss: worldMetadata.world_boss ?? worldMetadata.boss ?? '[boss]',
      quirk: worldMetadata.world_boss_quirk ?? worldMetadata.quirk ?? '[quirk]',
      treasure: worldMetadata.world_treasure ?? worldMetadata.treasure ?? '[treasure]',
    }
    if (!result.name || !result.description) return null
    return result
  }

  return useRequestGenericMetadata(
    ContentType.Metadata,
    MetadataType.Realm,
    coord.toString(),
    realm ? (doc?.metadata ?? '') : null,
    options,
    _parseReponseMetadata
  )
}

//
// Chamber Metadata
//
export const useRequestChamberMetadata = (coord: bigint) => {
  const { networkLayer: { storeCache } } = useMUD()

  const chamberRow = useRow(storeCache, { table: 'Chamber', key: { coord } })
  const chamber = useMemo(() => (chamberRow?.value ?? null), [chamberRow])

  const chamberSlug = coordToSlug(coord, null)

  const { realmCoord } = useSettingsContext()
  const doc = useChamberMetadataDocument(realmCoord, chamberSlug)

  useEffect(() => { console.log(`CHAMBER META DOC:`, `#${chamber?.tokenId}`, realmCoord, chamberSlug, doc) }, [chamber, doc])

  const { gptModel } = useMetadataContext()

  const options: PromptMetadataOptions = useMemo(() => ({
    gptModel,
    type: MetadataType.Chamber,
    terrain: chamber?.terrain ?? null,
    gemType: chamber?.gemType ?? null,
    coins: chamber?.coins ?? null,
    yonder: chamber?.yonder ?? null,
  }), [chamber])

  const _parseReponseMetadata = (responseMetadata: any): any | null => {
    const chamberMetadata = responseMetadata.chamber ?? null
    if (!chamberMetadata) return null
    const result = {
      name: chamberMetadata.chamber_name ?? chamberMetadata.name ?? null,
      description: chamberMetadata.chamber_description ?? chamberMetadata.description ?? null,
      terrain: chamber?.terrain ?? null,
      yonder: chamber?.yonder ?? null,
      gemType: chamber?.gemType ?? null,
      coins: chamber?.coins ?? null,
    }
    if (!result.name || !result.description) return null
    return result
  }

  return useRequestGenericMetadata(
    ContentType.Metadata,
    MetadataType.Chamber,
    chamberSlug ?? '',
    chamber ? (doc?.metadata ?? '') : null,
    options,
    _parseReponseMetadata
  )
}

//
// Agent Metadata
//
export const useRequestAgentMetadata = (agentEntity: Entity | undefined) => {
  const { networkLayer: { components: { Agent } } } = useMUD()

  const agent = useComponentValue(Agent, agentEntity) ?? null
  const chamberSlug = agent ? coordToSlug(agent.coord, null) : null

  const { realmCoord } = useSettingsContext()
  const doc = useAgentMetadataDocument(realmCoord, chamberSlug)

  const { gptModel } = useMetadataContext()

  const options: PromptMetadataOptions = useMemo(() => ({
    gptModel,
    type: MetadataType.Agent,
    terrain: agent?.terrain ?? null,
    gemType: agent?.gemType ?? null,
    coins: agent?.coins ?? null,
    yonder: agent?.yonder ?? null,
  }), [agent])

  useEffect(() => { console.log(`AGENT META DOC:`, realmCoord, chamberSlug, agentEntity, agent, doc) }, [agentEntity, agent, doc])

  const _parseReponseMetadata = (responseMetadata: any): any | null => {
    const agentMetadata = responseMetadata.npc ?? responseMetadata.chamber?.npc ?? null
    // console.log(`>>>>>> AGENT META RESULT`, agentMetadata, responseMetadata)
    if (!agentMetadata) return null
    const result = {
      name: agentMetadata.npc_name ?? null,
      description: agentMetadata.npc_description ?? null,
      behaviour_mode: agentMetadata.behaviour_mode ?? '[behaviour_mode]',
      quirk: agentMetadata.npc_quirk ?? '[quirk]',
      terrain: agent?.terrain,
      yonder: agent?.yonder,
      gemType: agent?.gemType,
      coins: agent?.coins,
    }
    if (!result.name || !result.description) return null
    return result
  }

  return useRequestGenericMetadata(
    ContentType.Metadata,
    MetadataType.Agent,
    chamberSlug ?? '',
    agent ? (doc?.metadata ?? '') : null,
    options,
    _parseReponseMetadata
  )
}





//--------------------------------
// Art url Requests
//

//
// Realm Art
//
export const useRequestRealmArtUrl = (coord: bigint) => {
  const doc = useRealmMetadataDocument(coord)

  const prompt = useMemo(() => {
    if (doc?.metadata && !doc?.artUrl) {
      const meta = JSON.parse(doc.metadata)
      if (meta.name) {
        return `${meta.name}, ${meta.description}`
      }
    }
    return ''
  }, [doc])

  // @ts-ignore
  useEffect(() => { console.log(`REALM ART URL IMAGE:`, coord, prompt, `[${doc?.artUrl}]`) }, [prompt, doc])

  const options: ImageOptions = {
    prompt,
    size: ImageSize.Medium,
  }

  return useRequestGenericMetadata(
    ContentType.ArtUrl,
    MetadataType.Realm,
    coord.toString(),
    (prompt || doc?.artUrl) ? (doc?.artUrl ?? '') : null,
    options,
    null
  )
}

//
// Chamber Art
//
export const useRequestChamberArtUrl = (coord: bigint) => {
  const { realmCoord } = useSettingsContext()

  const chamberSlug = coordToSlug(coord, null)
  const doc = useChamberMetadataDocument(realmCoord, chamberSlug)

  const prompt = useMemo(() => {
    if (doc?.metadata && !doc?.artUrl) {
      const meta = JSON.parse(doc.metadata)
      if (meta.description && meta.terrain) {
        // @ts-ignore
        const pertype = prompts.chamberPrompts[meta.terrain] ?? ''
        return `${pertype} ${meta.description}`
      }
    }
    return ''
  }, [doc])

  // @ts-ignore
  useEffect(() => { console.log(`CHAMBER ART URL IMAGE:`, chamberSlug, prompt, `[${doc?.artUrl}]`) }, [prompt, doc])

  const options: ImageOptions = {
    prompt,
    size: ImageSize.Medium,
  }

  return useRequestGenericMetadata(
    ContentType.ArtUrl,
    MetadataType.Chamber,
    chamberSlug ?? '',
    (prompt || doc?.artUrl) ? (doc?.artUrl ?? '') : null,
    options,
    null
  )
}

//
// Agent Art
//
export const useRequestAgentArtUrl = (agentEntity: Entity) => {
  const { networkLayer: { components: { Agent } } } = useMUD()

  const agent = useComponentValue(Agent, agentEntity)
  const chamberSlug = agent ? coordToSlug(agent.coord, null) : null

  const { realmCoord } = useSettingsContext()
  const doc = useAgentMetadataDocument(realmCoord, chamberSlug)

  const prompt = useMemo(() => {
    if (doc?.metadata && !doc?.artUrl) {
      const meta = JSON.parse(doc.metadata)
      return `A watercolor portrait of a maritime figure, digital neon art, luminescent deep sea creatures: ${meta.description} nautical steampunk art, watercolor marine landscape, vintage nautical charts`
      // return `${meta.name}, ${meta.description}`
    }
    return ''
  }, [doc])

  // @ts-ignore
  useEffect(() => { console.log(`AGENT ART URL IMAGE:`, chamberSlug, prompt, `[${doc?.artUrl}]`) }, [prompt, doc])

  const options: ImageOptions = {
    prompt,
    size: ImageSize.Medium,
  }

  return useRequestGenericMetadata(
    ContentType.ArtUrl,
    MetadataType.Agent,
    chamberSlug ?? '',
    (prompt || doc?.artUrl) ? (doc?.artUrl ?? '') : null,
    options,
    null
  )
}


//--------------------------------
// Generic Hooks
//

export const useMetadataContext = () => {
  const { state } = useContext(MetadataContext)
  const gptModel = getKey(Keys.GPT_MODEL)
  return {
    ...state,
    gptModel: (gptModel && gptModel != 'null' && gptModel != 'undefined' ? gptModel : state.gptModel)
  }
}

const useStateStatus = (content: ContentType, type: MetadataType, key: string | undefined) => {
  const { state } = useContext(MetadataContext)
  const status = key ? state.data[content][type][key.toString()] : 0
  return {
    isUnknown: (!status),
    isFetching: (status === StatusType.Fetching),
    isSuccess: (status === StatusType.Success),
    isError: (status === StatusType.Error),
  }
}

export const useMetadataStatus = (type: MetadataType, key: string | undefined) => {
  return useStateStatus(ContentType.Metadata, type, key)
}

export const useArtUrlStatus = (type: MetadataType, key: string | undefined) => {
  return useStateStatus(ContentType.ArtUrl, type, key)
}


//--------------------------------
// Metadata Hooks
//

const useGenericMetadata = (doc: any, key: string, metadataType: MetadataType) => {
  const { isUnknown, isFetching, isError, isSuccess } = useMetadataStatus(metadataType, key)
  return {
    isUnknown,
    isFetching,
    isSuccess,
    isError,
    metadata: doc ? JSON.parse(doc.metadata) : {},
    artUrl: doc?.artUrl ?? null,
  }
}

export const useRealmMetadata = (coord: bigint) => {
  const doc = useRealmMetadataDocument(coord)
  return useGenericMetadata(doc, coord.toString(), MetadataType.Realm)
}

export const useChamberMetadata = (coord: bigint) => {
  const { realmCoord } = useSettingsContext()
  const chamberSlug = coordToSlug(coord, null)
  const doc = useChamberMetadataDocument(realmCoord, chamberSlug)
  return useGenericMetadata(doc, chamberSlug ?? '', MetadataType.Chamber)
}

export const useAgentMetadata = (agentEntity: Entity | undefined) => {
  const { networkLayer: { components: { Agent } } } = useMUD()
  const agent = useComponentValue(Agent, agentEntity)
  const chamberSlug = agent ? coordToSlug(agent.coord, null) : null
  const { realmCoord } = useSettingsContext()
  const doc = useAgentMetadataDocument(realmCoord, chamberSlug)
  return useGenericMetadata(doc, chamberSlug ?? '', MetadataType.Agent)
}
