import { useGenerator } from '../openai/hooks'

export const Main = () => {

  const { isWaiting, message, error } = useGenerator('Hello')

  return (
    <div className='Main'>
      <div>{message}</div>
      {error &&
        <div>{error}</div>
      }

    </div>
  )
}
