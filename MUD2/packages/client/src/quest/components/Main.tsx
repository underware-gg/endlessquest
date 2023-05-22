import { usePrompChat } from '../openai/hooks'

export const Main = () => {

  const { isWaiting, message, error } = usePrompChat('Hello')

  return (
    <div className='Main'>
      <div>{message}</div>
      {error &&
        <div>{error}</div>
      }

    </div>
  )
}
