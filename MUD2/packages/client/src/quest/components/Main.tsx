import { usePrompChat, usePrompMetadata } from '../openai/hooks'
import { MetadataType } from '../openai/promptMetadata'

export const Main = () => {

  // const { isWaiting, message, error } = usePrompChat('Hello')
  const { isWaiting, metadata, response, message, error } = usePrompMetadata({
    type: MetadataType.Chamber,
    terrain: 1,
    gemType: 0,
    coins: 100,
    yonder:1,
  })

  return (
    <div className='Main'>
      <div>{response ?? message}</div>
      {error &&
        <div>{error}</div>
      }

    </div>
  )
}
