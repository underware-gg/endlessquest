import { useGenerator } from '../openai/hooks'

export const Main = () => {

  const { isWaiting, message, result, error } = useGenerator('Hello')

  return (
    <div className='Main'>
      <div>{message}</div>

    </div>
  )
}
