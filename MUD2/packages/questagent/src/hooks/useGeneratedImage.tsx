import { useState, useEffect } from 'react'
import { generateImage, ImageSize } from '../openai'

export const useGeneratedImage = (prompt: string | null) => {
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

    setIsWaiting(false)
    setUrl(null)
    setError(null)
    if (prompt) {
      setIsWaiting(true)
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
