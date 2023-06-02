import React, { ReactNode, createContext, useReducer, useContext, useEffect } from 'react'

//
// React + Typescript + Context
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
//

//--------------------------------
// Constants
//
export const initialState = {
  realmCoord: 0n,
  logo: 'https://raw.githubusercontent.com/funDAOmental/endlessquest/main/Assets/logos/EndlessQuest-frames/page_01.png',
  anim: 'https://raw.githubusercontent.com/funDAOmental/endlessquest/main/Assets/logos/EndlessQuest-logo4-optimised.gif',
}

const SettingsActions = {
  SET_REALM_COORD: 'SET_REALM_COORD',
}

//--------------------------------
// Types
//
type SettingsStateType = {
  realmCoord: bigint,
  logo: string,
  anim: string,
}

type ActionType =
  | { type: 'SET_REALM_COORD', payload: bigint }



//--------------------------------
// Context
//
const SettingsContext = createContext<{
  state: SettingsStateType
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => null,
})

//--------------------------------
// Provider
//
interface SettingsProviderProps {
  children: string | JSX.Element | JSX.Element[] | ReactNode
}
const SettingsProvider = ({
  children,
}: SettingsProviderProps) => {
  const [state, dispatch] = useReducer((state: SettingsStateType, action: ActionType) => {
    let newState = { ...state }
    switch (action.type) {
      case SettingsActions.SET_REALM_COORD: {
        newState.realmCoord = action.payload
        break
      }
      default:
        console.warn(`SettingsProvider: Unknown action [${action.type}]`)
        return state
    }
    return newState
  }, initialState)

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsProvider, SettingsContext, SettingsActions }


//--------------------------------
// Hooks
//

export const useSettingsContext = () => {
  const { state, dispatch } = useContext(SettingsContext)
  return {
    ...state,
    dispatch,
  }
}

