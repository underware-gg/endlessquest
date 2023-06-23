import { useEffect, useMemo, useState } from 'react'
import { useMetadataContext } from '../hooks/MetadataContext'
import {
  ChatHistory,
  PromptAgentOptions,
  usePromptChat,
} from 'questagent'

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
  const { gptModel } = useMetadataContext()

  const options: PromptAgentOptions = {
    gptModel,
    history: previousHistory,
    prompt,
    agentMetadata,
  }

  const { isWaiting, message, error, history: newHistory } = usePromptChat(options)

  useEffect(() => {
    if (!isWaiting && (message || error)) {
      onDone(newHistory, message ?? error ?? '???')
    }
  }, [isWaiting, message, error,  newHistory])

  const meta = useMemo(() => JSON.parse(agentMetadata), [agentMetadata])

  return (
    <div>
      <div>{isWaiting ? (previousHistory.length == 0 ? <span>Starting chat with <span className='Importanter'>{meta.name}</span>...</span> : 'Waiting...') : 'got it'}</div>
      {error &&
        <div>{error}</div>
      }
    </div>
  )
}
