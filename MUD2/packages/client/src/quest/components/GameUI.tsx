import { useEffect, useState } from 'react'
import { RealmLocation } from './RealmLocation'
import { ChamberLocation } from './ChamberLocation'
import { PlayerLocation } from './PlayerLocation'
import { AgentLocation } from './AgentLocation'
import { ChatDialog } from './ChatDialog'
import { Loader } from './Loader'
import { usePlayer } from '../hooks/usePlayer'

declare global {
  interface Window { QuestNamespace: any }
}

export const GameUI = () => {
  const [agentName, setAgentName] = useState<string | null>(null)
  const [agentMetadata, setAgentMetadata] = useState<string | null>(null)
  const [isChatting, setIsChatting] = useState(false)

  const {
    agentId,
  } = usePlayer()

  const _onChat = (e: boolean, name: string | null, metadata: string | null) => {
    setAgentName(name)
    setAgentMetadata(metadata)
    setIsChatting(e)
  }

  useEffect(() => {
    window.QuestNamespace.controlsEnabled = !isChatting
  }, [isChatting])

  return (
    <div >
      <div className='GameUITop Flex'>
        <RealmLocation />
        <PlayerLocation />
      </div>

      <div className='GameUIRight'>
        {agentId == 0n ? <ChamberLocation />
          : <AgentLocation onChat={_onChat} />
        }
      </div>

      <Loader />

      {isChatting &&
        <ChatDialog onChat={setIsChatting} agentName={agentName ?? 'Agent'} agentMetadata={agentMetadata ?? ''} />
      }
    </div>
  )
}
