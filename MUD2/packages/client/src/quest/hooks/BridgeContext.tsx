import React, { createContext, useReducer, useContext, ReactNode } from 'react'

//
// React + Typescript + Context
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
//

//--------------------------------
// Constants
//
export const initialState = {
  tokens: {
  },
  chambers: {
  },
}

const BridgeActions = {
  BRIDGE_TOKEN: 'BRIDGE_TOKEN',
  BRIDGE_CHAMBER: 'BRIDGE_CHAMBER',
}

//--------------------------------
// Types
//
type BridgeStateType = {
  tokens: {
    [tokenId: string]: boolean
  },
  chambers: {
    [coord: string]: boolean
  }
}

type PropsType = {
  children: string | JSX.Element | JSX.Element[] | ReactNode
}

type ActionType =
  | { type: 'BRIDGE_TOKEN', payload: bigint }
  | { type: 'BRIDGE_CHAMBER', payload: bigint }



//--------------------------------
// Context
//
const BridgeContext = createContext<{
  state: BridgeStateType
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => null
})

//--------------------------------
// Provider
//
const BridgeProvider = ({
  children
}: PropsType) => {
  const [state, dispatch] = useReducer((state: BridgeStateType, action: ActionType) => {
    let newState = { ...state }
    switch (action.type) {
      case BridgeActions.BRIDGE_TOKEN:
        // newState.error = action.payload
        break
      case BridgeActions.BRIDGE_CHAMBER:
        // newState.nonce = action.payload
        break
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
// Hooks
//

export const useBridgeContext = () => {
  const { state } = useContext(BridgeContext)
  return state
}

