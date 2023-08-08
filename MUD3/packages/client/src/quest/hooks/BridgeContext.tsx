import React, { ReactNode, createContext, useReducer, useContext, useEffect } from 'react'
import { Queue } from '../utils'

const q_bridge = new Queue(100, 'q_bridge')

//--------------------------------
// Constants
//
export const initialState = {
  tokens: [],
  chambers: [],
  realms: [],
}

const BridgeActions = {
  BRIDGE_TOKEN: 'BRIDGE_TOKEN',
  BRIDGE_CHAMBER: 'BRIDGE_CHAMBER',
  BRIDGE_REALM: 'BRIDGE_REALM',
}

//--------------------------------
// Types
//
type BridgeStateType = {
  tokens: Array<number>,
  chambers: Array<bigint>,
  realms: Array<bigint>,
}

type ActionType =
  | { type: 'BRIDGE_TOKEN', payload: number }
  | { type: 'BRIDGE_CHAMBER', payload: bigint }
  | { type: 'BRIDGE_REALM', payload: bigint }


//--------------------------------
// Context
//
const BridgeContext = createContext<{
  state: BridgeStateType
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => null,
})


//--------------------------------
// Provider
//
interface BridgeProviderProps {
  children: string | JSX.Element | JSX.Element[] | ReactNode
  networkLayer: any,
}
const BridgeProvider = ({
  children,
  networkLayer,
}: BridgeProviderProps) => {
  const {
    systemCalls: {
      bridge_tokenId, bridge_chamber, bridge_realm,
    },
  } = networkLayer

  useEffect(() => {
    q_bridge.start()
  }, [])

  const [state, dispatch] = useReducer((state: BridgeStateType, action: ActionType) => {
    let newState = { ...state }
    switch (action.type) {
      case BridgeActions.BRIDGE_TOKEN: {
        const tokenId = action.payload as number
        if (tokenId > 0n && !state.tokens.includes(tokenId)) {
          newState.tokens = [...state.tokens]
          newState.tokens.push(tokenId)
          q_bridge.push(async () => {
            await bridge_tokenId(tokenId)
          }, 'bridge_tokenId')
        }
        break
      }
      case BridgeActions.BRIDGE_CHAMBER: {
        const coord = action.payload as bigint
        if (coord > 0n && !state.chambers.includes(coord)) {
          newState.chambers = [...state.chambers]
          newState.chambers.push(coord)
          q_bridge.push(async () => {
            await bridge_chamber(coord)
          }, 'bridge_chamber')
        }
        break
      }
      case BridgeActions.BRIDGE_REALM: {
        const coord = action.payload as bigint
        if (coord > 0n && !state.realms.includes(coord)) {
          newState.realms = [...state.realms]
          newState.realms.push(coord)
          q_bridge.push(async () => {
            await bridge_realm(coord)
          }, 'bridge_realm')
        }
        break
      }
      default:
        console.warn(`BridgeProvider: Unknown action [${action.type}]`)
        return state
    }
    return newState
  }, initialState)

  // const dispatchBridge = (type:string, payload:any) => {
  //   dispatch({ type, payload })
  // }

  return (
    <BridgeContext.Provider value={{ state, dispatch }}>
      {children}
    </BridgeContext.Provider>
  )
}

export { BridgeProvider, BridgeContext, BridgeActions }



//--------------------------------
// Dispatches
//

export const useBridgeToken = (tokenId: number) => {
  const { state, dispatch } = useContext(BridgeContext)
  useEffect(() => {
    if (tokenId) {
      dispatch({
        type: BridgeActions.BRIDGE_TOKEN,
        payload: tokenId,
      })
    }
  }, [tokenId])
  return state.tokens.includes(tokenId)
}

export const useBridgeChamber = (coord: bigint) => {
  const { state, dispatch } = useContext(BridgeContext)
  useEffect(() => {
    if (coord) {
      dispatch({
        type: BridgeActions.BRIDGE_CHAMBER,
        payload: coord,
      })
    }
  }, [coord])
  return state.chambers.includes(coord)
}

export const useBridgeRealm = (coord: bigint) => {
  const { state, dispatch } = useContext(BridgeContext)
  useEffect(() => {
    if (coord) {
      dispatch({
        type: BridgeActions.BRIDGE_REALM,
        payload: coord,
      })
    }
  }, [coord])
  return state.realms.includes(coord)
}


//--------------------------------
// Hooks
//

export const useBridgeContext = () => {
  const { state } = useContext(BridgeContext)
  return state
}

