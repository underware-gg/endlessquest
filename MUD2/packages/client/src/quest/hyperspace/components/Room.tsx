import { useEffect, useState } from 'react'

export const Room = ({
}) => {
  const [status, setStatus] = useState('?')
  const [room, setRoom] = useState<any | null>(null)

  const slug = '123quest'

  useEffect(() => {
    setStatus('mounted')
    console.log(`[${slug}] <Hyperspace> import...`)
    import('../core/room').then(async ({ default: Room }) => {
      console.log(`[${slug}] <Hyperspace> init...`)
      setStatus('imported')
      const _room = new Room()
      setStatus('contructed')
      await _room.init({
        // @ts-ignore
        slug,
      })
      // dispatchRoom(_game.room)
      setStatus('ignited')
      setRoom(_room)
    })
  }, [])

  return (
    <div className='RoomLoader'>
      Room [{status}][{room?.slug ?? ''}]
    </div>
  )
}
