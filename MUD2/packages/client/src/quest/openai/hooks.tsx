import { useState, useEffect, useMemo } from 'react'
import promptChat from './promptChat'
import prompMetadata, { PromptMetadataOptions } from './promptMetadata'

export const usePrompMetadata = (options: PromptMetadataOptions) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<object>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let _mounted = true

    const _generate = async () => {
      const response = await prompMetadata(options)
      if (_mounted) {
        setIsWaiting(false)
        setMessage(null)
        setResponse(response.response ?? null)
        setMetadata(response.metadata ?? {})
        setError(response.error ?? null)
      }
    }

    setIsWaiting(true)
    setMessage('Waiting...')
    setResponse(null)
    setMetadata({})
    setError(null)
    _generate()

    return () => {
      _mounted = false
    }
  }, [prompt])

  return {
    isWaiting,
    message,
    metadata,
    response,
    error,
  }
}

export const usePrompChat = (prompt: string) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let _mounted = true

    const _generate = async () => {
      const response = await promptChat({
        history: [],
        prompt: null,
      })
      if (_mounted) {
        setIsWaiting(false)
        setMessage(response.message ?? null)
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
    error,
  }
}
