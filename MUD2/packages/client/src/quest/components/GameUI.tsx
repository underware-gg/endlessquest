import { useEffect, useState } from 'react'
import { RealmLocation } from './RealmLocation'
import { ChamberLocation } from './ChamberLocation'
import { PlayerLocation } from './PlayerLocation'
import { AgentLocation } from './AgentLocation'
import { ChatDialog } from './ChatDialog'
import { Loader } from './Loader'
import { usePlayer } from '../hooks/usePlayer'
// import { useSettingsContext } from '../hooks/SettingsContext'

declare global {
  interface Window { QuestNamespace: any }
}

export const GameUI = () => {
  // const { isChatting } = useSettingsContext()

  const {
    agentId,
  } = usePlayer()

  return (
    <div >
      <div className='GameUITop Flex'>
        <RealmLocation />
        <PlayerLocation />
      </div>

      <div className='GameUIRight'>
        {agentId == 0n ?
          <ChamberLocation />
          : <AgentLocation />
        }
      </div>

      <Loader />

      <ChatDialog />
    </div>
  )
}
