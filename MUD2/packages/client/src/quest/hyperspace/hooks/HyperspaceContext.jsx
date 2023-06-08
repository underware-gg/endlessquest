import React, { createContext, useReducer, useContext } from 'react'

//--------------------------------
// Context
//
export const initialState = {
  room: null,
}
const HyperspaceContext = createContext(initialState)

const HyperspaceActions = {
  SET_ROOM: 'SET_ROOM',
}

//--------------------------------
// Provider
//
const HyperspaceProvider = ({
  // @ts-ignore
  children,
}) => {
  // @ts-ignore
  const [state, dispatch] = useReducer((state, action) => {
    let newState = { ...state }
    switch (action.type) {
      case HyperspaceActions.SET_ROOM:
        newState.room = action.payload
        break
      default:
        console.warn(`HyperspaceProvider: Unknown action [${action.type}]`)
        return state
    }
    return newState
  }, initialState)

  // const dispatchHyperspace = (type, payload) => {
  //   dispatch({ type, payload })
  // }

  // @ts-ignore
  const dispatchRoom = (room) => {
    // @ts-ignore
    dispatch({
      type: HyperspaceActions.SET_ROOM,
      payload: room
    })
  }

  return (
    // @ts-ignore
    <HyperspaceContext.Provider value={{ state, dispatch, dispatchRoom }}>
      {children}
    </HyperspaceContext.Provider>
  )
}

export { HyperspaceProvider, HyperspaceContext, HyperspaceActions }


//--------------------------------
// Hooks
//

export const useHyperspaceContext = () => {
  // @ts-ignore
  const { state: { room } } = useContext(HyperspaceContext)
  return {
    room,
    slug: room?.clientRoom?.slug ?? null,
    branch: room?.clientRoom?.branch ?? null,
    localStore: room?.localStore ?? null,
    remoteStore: room?.remoteStore ?? null,
    clientRoom: room?.clientRoom ?? null,
    agentId: room?.clientAgent?.agentId ?? null,
    Screen: room?.Screen ?? null,
    QuestRealm: room?.QuestRealm ?? null,
    QuestChamber: room?.QuestChamber ?? null,
    QuestAgent: room?.QuestAgent ?? null,
    // QuestMessages: room?.QuestMessages ?? null,
  }
}

