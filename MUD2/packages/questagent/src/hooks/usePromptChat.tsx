import { useState, useEffect, useMemo } from 'react'
import {
  ChatHistory,
  promptChat, PromptAgentOptions,
} from '../openai'

export const usePromptChat = (options: PromptAgentOptions) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(true)
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
  }, [options.prompt, options.history.length])

  return {
    isWaiting,
    message,
    history,
    error,
  }
}
