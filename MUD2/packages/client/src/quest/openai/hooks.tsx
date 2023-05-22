import { useState, useEffect, useMemo } from 'react'
import generate from './generator'

export const useGenerator = (prompt: string) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let _mounted = true

    const _generate = async () => {
      const response = await generate({
        prompt
      })
      if (_mounted) {
        setIsWaiting(false)
        setResult(response.result ?? null)
        setError(response.error ?? null)
      }
    }

    setIsWaiting(true)
    setResult(null)
    setError(null)
    _generate()

    return () => {
      _mounted = false
    }
  }, [prompt])

  const message = useMemo(() => {
    return isWaiting ? 'Waiting...' :
      error ? 'Unfortunate error ¯\_(ツ)_/¯' :
      result
  }, [isWaiting, result, error])

  return {
    isWaiting,
    result,
    error,
    message,
  };
};
