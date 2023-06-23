import { useState, useEffect } from 'react'
import { promptChat, PromptAgentOptions } from '../openai/promptChat'
import { ChatHistory } from '../openai/generateChat'

export const usePromptChat = (options: PromptAgentOptions) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [history, setHistory] = useState<ChatHistory>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let _mounted = true

    const _generate = async () => {
      const response = await promptChat(options)
      if (_mounted) {
        setIsWaiting(false)
        setMessage(response.message ?? null)
        setHistory(response.history ?? [])
        setError(response.error ?? null)
      }
    }

    setIsWaiting(true)
    setMessage('Waiting...')
    setError(null)
    _generate()

    return () => {
      _mounted = false
    }
  }, [prompt])

  return {
    isWaiting,
    message,
    history,
    error,
  }
}
