import { useState, useEffect } from 'react'
import {
  promptMetadata,
  PromptMetadataOptions,
  MetadataType,
} from '../openai'

export const usePromptMetadata = (options: PromptMetadataOptions) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<object | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let _mounted = true

    const _generate = async () => {
      const response = await promptMetadata(options)
      if (_mounted) {
        setIsWaiting(false)
        setMessage(null)
        setResponse(response.response ?? null)
        setMetadata(response.metadata ?? null)
        setError(response.error ?? null)
      }
    }

    setIsWaiting(false)
    setResponse(null)
    setMetadata(null)
    setError(null)
    if (options.type != MetadataType.None) {
      setMessage('Waiting...')
      setIsWaiting(true)
      _generate()
    }

    return () => {
      _mounted = false
    }
  }, [options])

  return {
    isWaiting,
    message,
    metadata,
    response,
    error,
  }
}

