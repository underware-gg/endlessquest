import { useState, useEffect, useMemo } from 'react'
import prompMetadata, { MetadataType, PromptMetadataOptions } from './promptMetadata'
import promptChat from './promptChat'
import { ChatHistory } from './generateChat'
import { generateImage, ImageOptions, ImageSize } from './generateImage'

export const usePrompChat = (previousHistory: ChatHistory, prompt: string, agentMetadata: string) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [history, setHistory] = useState<ChatHistory>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let _mounted = true

    const _generate = async () => {
      const response = await promptChat({
        history: previousHistory,
        prompt,
        agentMetadata,
      })
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
    if (options.type != MetadataType.None) {
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


export const useImage = (prompt: string | null) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let _mounted = true

    const _generate = async () => {
      const options = {
        prompt: prompt ?? '',
        size: ImageSize.Medium,
      }
      const response = await generateImage(options)
      if (_mounted) {
        setIsWaiting(false)
        setUrl(response.url ?? null)
        setError(response.error ?? null)
      }
    }

    setIsWaiting(true)
    setUrl(null)
    setError(null)
    if (prompt) {
      _generate()
    }

    return () => {
      _mounted = false
    }
  }, [prompt])

  return {
    isWaiting,
    url,
    error,
  }
}
