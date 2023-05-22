import { useState, useEffect, useMemo } from 'react'
import promptAgent from './promptAgent'

export const useGenerator = (prompt: string) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let _mounted = true

    const _generate = async () => {
      const response = await promptAgent({
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
