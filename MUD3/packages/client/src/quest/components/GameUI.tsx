import React from 'react'
import { usePlayer } from '../hooks/usePlayer'
import { RealmLocation } from './RealmLocation'
import { ChamberLocation } from './ChamberLocation'
import { PlayerLocation } from './PlayerLocation'
import { AgentLocation } from './AgentLocation'
import { ChatInterface } from './ChatInterface'
import { RoomLoader } from '../hyperspace/components/RoomLoader'
import { Loader } from './Loader'
import { CounterValue } from './CounterValue'

declare global {
  interface Window { QuestNamespace: any }
}

export const GameUI = () => {
  const { agentId } = usePlayer()

  return (
    <div >
      <CounterValue />

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

      <RoomLoader />

      <ChatInterface/>
    </div>
  )
}
