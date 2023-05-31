import React, { ReactNode, createContext, useReducer, useContext, useEffect } from 'react'

//
// React + Typescript + Context
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
//

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
  tokens: Array<bigint>,
  chambers: Array<bigint>,
  realms: Array<bigint>,
}

type ActionType =
  | { type: 'BRIDGE_TOKEN', payload: bigint }
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
  systemCalls: any,
}
const BridgeProvider = ({
  children,
  systemCalls,
}: BridgeProviderProps) => {
  const { bridge_tokenId, bridge_chamber, bridge_realm } = systemCalls

  const [state, dispatch] = useReducer((state: BridgeStateType, action: ActionType) => {
    let newState = { ...state }
    switch (action.type) {
      case BridgeActions.BRIDGE_TOKEN: {
        const tokenId = action.payload
        if (tokenId > 0n && !state.tokens.includes(tokenId)) {
          state.tokens.push(tokenId)
          bridge_tokenId(tokenId)
        }
        break
      }
      case BridgeActions.BRIDGE_CHAMBER: {
        const coord = action.payload
        if (coord > 0n && !state.chambers.includes(coord)) {
          state.chambers.push(coord)
          bridge_chamber(coord)
        }
        break
      }
      case BridgeActions.BRIDGE_REALM: {
        const coord = action.payload
        if (coord > 0n && !state.realms.includes(coord)) {
          state.realms.push(coord)
          bridge_realm(coord)
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

export const useBridgeToken = (tokenId: bigint) => {
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

