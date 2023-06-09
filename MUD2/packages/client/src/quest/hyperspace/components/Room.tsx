import { useEffect, useState, useContext } from 'react'
import { HyperspaceContext } from '../hooks/HyperspaceContext'
import { useRemoteDocument } from '../hooks/useDocument'
import { useRemoteDocumentIds } from '../hooks/useDocumentIds'

export const Room = () => {
  // @ts-ignore
  const { dispatchRoom } = useContext(HyperspaceContext)
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
      dispatchRoom(_room)
      setStatus('inited')
      setRoom(_room)
    })
  }, [])

  return (
    <div className='RoomLoader'>
      <div className='LoaderContent'>
        Room [{status}][{room?.slug ?? ''}]
        <MetadataName type='questRealm' id='1' />
        <MetadataName type='questChamber' id='S1W1' />
        <MetadataName type='questChamber' id='S1E1' />
        <MetadataCount type='questRealm' />
        <MetadataCount type='questChamber' />
        <MetadataCount type='questAgent' />
        <MetadataCount type='questMessages' />
      </div>
    </div>
  )
}

export const MetadataName = ({
  // @ts-ignore
  type,
  // @ts-ignore
  id,
}) => {
  const doc = useRemoteDocument(type, id)
  return (
    <div>
      {/* @ts-ignore */}
      {id}: {doc?.name ?? '?'}
    </div>
  )
}

export const MetadataCount = ({
  // @ts-ignore
  type,
}) => {
  const ids = useRemoteDocumentIds(type)
  return (
    <div>
      {type}: {ids?.length ?? '?'}
    </div>
  )
}
