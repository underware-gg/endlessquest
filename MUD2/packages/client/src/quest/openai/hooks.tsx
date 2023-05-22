import { useState, useEffect } from 'react'
import generate from './generator'

export const useGenerator = (prompt: string) => {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let _mounted = true

    const _generate = async () => {
      const response = await generate({
        animal: prompt
      })
      if (_mounted) {
        setResult(response.result ?? null)
        setError(response.error ?? null)
      }
    }

    _generate()

    return () => {
      _mounted = false
    }
  }, [prompt])

  return {
    result,
    error,
  };
};
