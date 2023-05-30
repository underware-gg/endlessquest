import React, { ReactNode, createContext, useReducer, useContext, useEffect, useMemo } from 'react'
import { useComponentValue, useRow } from '@latticexyz/react'
import { useMUD } from '../../store'
import promptMetadata, { MetadataType, PromptMetadataOptions } from '../openai/promptMetadata'
import { useComponentType } from './useComponentType'
import { isFullComponentValue } from '@latticexyz/recs'

//
// React + Typescript + Context
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
//

//--------------------------------
// Constants
//
export const initialState = {
  chambers: {},
  agents: {},
}

const MetadataActions = {
  CHAMBER_METADATA: 'CHAMBER_METADATA',
  AGENT_METADATA: 'AGENT_METADATA',
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
  chambers: {
    [coord: string]: StatusType,
  }
  agents: {
    [coord: string]: StatusType,
  }
}

type PayloadType = {
  coord: string,
  status: StatusType,
  metadata?: string,
}
type ActionType =
  | { type: 'CHAMBER_METADATA', payload: PayloadType }
  | { type: 'AGENT_METADATA', payload: PayloadType }



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
  const { setChamberMetadata, setAgentMetadata } = systemCalls

  const [state, dispatch] = useReducer((state: MetadataStateType, action: ActionType) => {
    const { coord, status, metadata } = action.payload
    const key = coord.toString()
    let newState = {
      chambers: { ...state.chambers },
      agents: { ...state.agents },
    }
    switch (action.type) {
      case MetadataActions.CHAMBER_METADATA: {
        const currentStatus = state.chambers[key]
        if (status != currentStatus) {
          newState.chambers[key] = status
          if (status == StatusType.Success && metadata) {
            setChamberMetadata(coord, JSON.stringify(metadata))
          }
        }
        break
      }
      case MetadataActions.AGENT_METADATA: {
        const currentStatus = state.agents[key]
        if (status != currentStatus) {
          newState.agents[key] = status
          if (status == StatusType.Success) {
            setAgentMetadata(coord, JSON.stringify(metadata))
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

export const useRequestChamberMetadata = (coord: bigint) => {
  const { dispatch } = useContext(MetadataContext)
  const { isUnknown, isFetching, isError, isSuccess } = useChamberMetadataStatus(coord)

  const {
    networkLayer: {
      storeCache,
    }
  } = useMUD()

  const chamberRow = useRow(storeCache, { table: 'Chamber', key: { coord } });
  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } });

  const chamber = useMemo(() => (chamberRow?.value ?? null), [chamberRow])
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])

  useEffect(() => { console.log(`CHAMBER META:`, chamber?.tokenId, metadata) }, [chamber, metadata])
  
  useEffect(() => {
    let payload = {
      coord,
      status: StatusType.Unknown,
      metadata: null,
    }

    const _generate = async () => {
      payload.status = StatusType.Fetching
      dispatch({
        type: MetadataActions.CHAMBER_METADATA,
        payload,
      })

      const response = await promptMetadata({
        type: MetadataType.Chamber,
        terrain: chamber?.terrain ?? null,
        gemType: chamber?.gemType ?? null,
        coins: chamber?.coins ?? null,
        yonder: chamber?.yonder ?? null,
      })

      if (response.error) {
        payload.status = StatusType.Error
        // @ts-ignore: accept any property
      } else if (response.metadata?.chamber) {
        // @ts-ignore: accept any property
        const chamberMetadata = response.metadata.chamber
        payload.status = StatusType.Success
        // @ts-ignore: accept any property
        payload.metadata = {
          name: chamberMetadata.chamber_name ?? chamberMetadata.name ?? '[name]',
          description: chamberMetadata.chamber_description ?? chamberMetadata.description ?? '[description]',
          terrain: chamber?.terrain ?? null,
          yonder: chamber?.yonder ?? null,
          gemType: chamber?.gemType ?? null,
          coins: chamber?.coins ?? null,
        }
      } else {
        payload.status = StatusType.Unknown
      }

      dispatch({
        type: MetadataActions.CHAMBER_METADATA,
        payload,
      })
    }

    if (isUnknown && chamber) {
      if (metadata === '') {
        _generate()
      } else if (metadata && metadata.length > 0) {
        payload.status = StatusType.Success
        dispatch({
          type: MetadataActions.CHAMBER_METADATA,
          payload,
        })
      }
    }

  }, [chamber, metadata, isUnknown])

  return {
    isUnknown,
    isFetching,
    isSuccess,
    isError,
  }
}

//--------------------------------
// Hooks
//

export const useMetadataContext = () => {
  const { state } = useContext(MetadataContext)
  return state
}

export const useChamberMetadataStatus = (coord: bigint) => {
  const { state } = useContext(MetadataContext)
  const status = state.chambers[coord.toString()]
  return {
    isUnknown: (!status),
    isFetching: (status === StatusType.Fetching),
    isSuccess: (status === StatusType.Success),
    isError: (status === StatusType.Error),
  }
}

export const useChamberMetadata = (coord: bigint) => {
  const { isUnknown, isFetching, isError, isSuccess } = useChamberMetadataStatus(coord)

  const {
    networkLayer: {
      storeCache,
    }
  } = useMUD()

  const metadataRow = useRow(storeCache, { table: 'ChamberMetadata', key: { coord } });
  const metadata = useMemo(() => (metadataRow?.value?.metadata ?? null), [metadataRow])

  return {
    isUnknown,
    isFetching,
    isSuccess,
    isError,
    metadata: metadata ? JSON.parse(metadata) : {},
  }
}
