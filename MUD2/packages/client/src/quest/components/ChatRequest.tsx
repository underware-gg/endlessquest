import { useEffect, useMemo, useState } from 'react'
import { ChatHistory } from '../openai/generateChat'
import { usePrompChat } from '../openai/hooks'

interface ChatRequestProps {
  prompt: string,
  previousHistory: ChatHistory,
  agentMetadata: string,
  onDone: (h: ChatHistory, m: string) => any,
}

export const ChatRequest = ({
  prompt,
  previousHistory,
  agentMetadata,
  onDone = (h: ChatHistory, m: string) => { },
}: ChatRequestProps) => {

  const { isWaiting, message, error, history: newHistory } = usePrompChat(previousHistory, prompt, agentMetadata)

  useEffect(() => {
    if (!isWaiting && (message || error)) {
      onDone(newHistory, message ?? error ?? '???')
    }
  }, [isWaiting, message, error,  newHistory])

  const meta = useMemo(() => JSON.parse(agentMetadata), [agentMetadata])

  return (
    <div>
      <div>{isWaiting ? (previousHistory.length == 0 ? `Starting chat with ${meta.name}...` : 'Waiting...') : 'got it'}</div>
      {error &&
        <div>{error}</div>
      }
    </div>
  )
}
