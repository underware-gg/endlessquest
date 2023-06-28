import { useEffect, useState } from 'react'
import { useSettingsContext, SettingsActions } from '../hooks/SettingsContext'
import { useHyperspaceContext } from '../hyperspace/hooks/HyperspaceContext'
import { usePlayer } from '../hooks/usePlayer'
import { useAgent } from '../hooks/useAgent'
import { ChatDialog } from 'questagent'
import { coordToSlug } from '@rsodre/crawler-data'

declare global {
  interface Window { QuestNamespace: any }
}

export const ChatInterface = () => {
  const { realmCoord, isChatting, dispatch } = useSettingsContext()

  const _onStopChatting = () => {
    dispatch({
      type: SettingsActions.SET_IS_CHATTING,
      payload: false,
    })
  }
  useEffect(() => {
    window.QuestNamespace.controlsEnabled = !isChatting
  }, [isChatting])

  const { remoteStore } = useHyperspaceContext()
  const { agentEntity } = usePlayer()
  const { coord } = useAgent(agentEntity)

  return (
    <ChatDialog
      store={remoteStore}
      realmCoord={realmCoord}
      chamberSlug={coordToSlug(coord ?? 0n, null) ?? ''}
      isChatting={isChatting}
      onStopChatting={_onStopChatting}
    />
  )
}
