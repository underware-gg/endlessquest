import { useEffect, useState, useContext } from 'react'
import { HyperspaceContext } from '../hooks/HyperspaceContext'
import { useRemoteDocument } from '../hooks/useDocument'
import { useRemoteDocumentIds } from '../hooks/useDocumentIds'
import { useSettingsContext } from '../../hooks/SettingsContext'
import { QuestRealmDoc, QuestChamberDoc, QuestAgentDoc, QuestEncounterDoc } from 'hyperbox-sdk'

export const RoomLoader = () => {
  const { realmCoord } = useSettingsContext()
  // @ts-ignore
  const { dispatchRoom } = useContext(HyperspaceContext)
  const [status, setStatus] = useState('?')
  const [room, setRoom] = useState<any | null>(null)

  const slug = ':endlessquest'

  useEffect(() => {
    setStatus('mounted')
    console.log(`[${slug}] <Hyperspace> import...`)
    import('../core/room/room').then(async ({ default: Room }) => {
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
    <div className='RoomLoader Infos Smaller'>
      <div className='LoaderContent'>
        Room [{status}][{room?.slug ?? ''}]
        <MetadataName type={QuestRealmDoc.type} id={realmCoord.toString()} />
        <MetadataName type={QuestChamberDoc.type} id={QuestChamberDoc.makeChamberKey(realmCoord, 'S1W1')} />
        <MetadataName type={QuestChamberDoc.type} id={QuestChamberDoc.makeChamberKey(realmCoord, 'S1E1')} />
        <MetadataCount type={QuestRealmDoc.type} />
        <MetadataCount type={QuestChamberDoc.type} />
        <MetadataCount type={QuestAgentDoc.type} />
        <MetadataCount type={QuestEncounterDoc.type} />
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
