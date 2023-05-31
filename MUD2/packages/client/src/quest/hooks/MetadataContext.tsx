import React, { ReactNode, createContext, useReducer, useContext, useEffect, useMemo } from 'react'
import { useRow } from '@latticexyz/react'
import { useMUD } from '../../store'
import promptMetadata, { MetadataType, PromptMetadataOptions } from '../openai/promptMetadata'

//
// React + Typescript + Context
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
//

//--------------------------------
// Constants
//
export const initialState = {
  [MetadataType.None]: {}, // required by MetadataStateType
  [MetadataType.Realm]: {},
  [MetadataType.Chamber]: {},
  [MetadataType.Agent]: {},
  [MetadataType.Player]: {},
}

const MetadataActions = {
  SET_METADATA: 'SET_METADATA',
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
  [type in MetadataType]: {
    [key: string]: StatusType
  }
}

type PayloadType = {
  type: MetadataType,
  key: bigint,
  status: StatusType,
  metadata?: string | null,
}
type ActionType =
  | { type: 'SET_METADATA', payload: PayloadType }



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
  const { setChamberMetadata, setRealmMetadata, setAgentMetadata } = systemCalls

  const [state, dispatch] = useReducer((state: MetadataStateType, action: ActionType) => {
    const { type, key, status, metadata } = action.payload
    const _key = key.toString()
    let newState = { ...state }
    switch (action.type) {
      case MetadataActions.SET_METADATA: {
        const currentStatus = state[type][_key]
        if (status != currentStatus) {
          newState[type] = {
            ...state[type],
            [_key]: status,
          }
          if (status == StatusType.Success && metadata) {
            if (type == MetadataType.Chamber) {
              setChamberMetadata(key, JSON.stringify(metadata))
            } else if (type == MetadataType.Realm) {
              setRealmMetadata(key, JSON.stringify(metadata))
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
// Dispatches
//

const useRequestGenericMetadata = (
  type: MetadataType,
  key: bigint,
  currentMetadata: any,
  _makeOptions: () => PromptMetadataOptions,
  _parseResult: (matadata: any) => any | null) => {
  const { dispatch } = useContext(MetadataContext)
  const { isUnknown, isFetching, isError, isSuccess } = useMetadataStatus(type, key)

  useEffect(() => {
    let payload: PayloadType = {
      type,
      key,
      status: StatusType.Unknown,
      metadata: null,
    }

    const _generate = async () => {
      payload.status = StatusType.Fetching
      dispatch({
        type: MetadataActions.SET_METADATA,
        payload,
      })
      const options = _makeOptions()
      const response = await promptMetadata(options)

      if (response.error) {
        payload.status = StatusType.Error
      } else if (response.metadata) {
        payload.metadata = _parseResult(response.metadata)
        payload.status = payload.metadata ? StatusType.Success : StatusType.Error
      } else {
        payload.status = StatusType.Unknown
      }

      dispatch({
        type: MetadataActions.SET_METADATA,
        payload,
      })
    }

    if (isUnknown) {
      if (currentMetadata === '') {
        _generate()
      } else if (currentMetadata && currentMetadata.length > 0) {
        payload.status = StatusType.Success
        dispatch({
          type: MetadataActions.SET_METADATA,
          payload,
        })
      }
    }

  }, [isUnknown, currentMetadata])

  return {
    isUnknown,
    isFetching,
    isSuccess,
    isError,
  }
}



export const useRequestRealmMetadata = (coord: bigint) => {
  const { networkLayer: { storeCache } } = useMUD()

  const realmRow = useRow(storeCache, { table: 'Realm', key: { coord } })
  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })

  const realm = useMemo(() => (realmRow?.value ?? null), [realmRow])
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])

  useEffect(() => { console.log(`REALM META:`, coord, realm, metadata) }, [coord, realm, metadata])

  const _makeOptions = (): PromptMetadataOptions => {
    return {
      type: MetadataType.Realm,
      terrain: null,
      gemType: null,
      coins: null,
      yonder: null,
    }
  }
  const _parseResult = (responseMetadata: any): any | null => {
    const worldMetadata = responseMetadata.world
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
    MetadataType.Realm,
    coord,
    realm ? metadata : null,
    _makeOptions,
    _parseResult
  )
}

export const useRequestChamberMetadata = (coord: bigint) => {
  const { networkLayer: { storeCache } } = useMUD()

  const chamberRow = useRow(storeCache, { table: 'Chamber', key: { coord } })
  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } })

  const chamber = useMemo(() => (chamberRow?.value ?? null), [chamberRow])
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])

  useEffect(() => { console.log(`CHAMBER META:`, chamber?.tokenId, metadata) }, [chamber, metadata])

  const _makeOptions = (): PromptMetadataOptions => {
    return {
      type: MetadataType.Chamber,
      terrain: chamber?.terrain ?? null,
      gemType: chamber?.gemType ?? null,
      coins: chamber?.coins ?? null,
      yonder: chamber?.yonder ?? null,
    }
  }
  const _parseResult = (responseMetadata: any): any | null => {
    const chamberMetadata = responseMetadata.chamber
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
    MetadataType.Chamber,
    coord,
    chamber ? metadata : null,
    _makeOptions,
    _parseResult
  )
}


//--------------------------------
// Hooks
//

export const useMetadataContext = () => {
  const { state } = useContext(MetadataContext)
  return state
}

export const useMetadataStatus = (type: MetadataType, key: bigint) => {
  const { state } = useContext(MetadataContext)
  const status = state[type][key.toString()]
  return {
    isUnknown: (!status),
    isFetching: (status === StatusType.Fetching),
    isSuccess: (status === StatusType.Success),
    isError: (status === StatusType.Error),
  }
}

export const useChamberMetadata = (coord: bigint, type: MetadataType = MetadataType.Chamber) => {
  const { networkLayer: { storeCache } } = useMUD()
  const { isUnknown, isFetching, isError, isSuccess } = useMetadataStatus(type, coord)

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

export const useRealmMetadata = (coord: bigint) => {
  return useChamberMetadata(coord, MetadataType.Realm)
}


