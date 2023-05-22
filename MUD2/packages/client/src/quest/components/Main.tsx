import { useGenerator } from '../openai/hooks'

export const Main = () => {

  const { result, error } = useGenerator('dog')

  return (
    <div className='Main'>
      {result &&
        <div>AIResult: {result}</div>
      }
      {error &&
        <div>AIError: {error}</div>
      }

    </div>
  )
}
