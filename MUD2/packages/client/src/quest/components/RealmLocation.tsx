import { useSettingsContext } from '../hooks/SettingsContext'
import { useRealm } from '../hooks/useRealm'

export const RealmLocation = () => {
  const { realmCoord, anim } = useSettingsContext()

  const {
    opener,
    metadata,
    metadataIsFetching,
    url,
  } = useRealm(realmCoord)

  return (
    <>
      <div className='RealmImage'>
        <img className='FillParent' src={url ? url : anim} />
      </div>

      <div className='RealmLocation'>
        <h3>Realm</h3>
        <p className='Importanter'>{metadataIsFetching ? 'dreaming...' : (metadata?.name ?? '?')}</p>
        <p>{metadataIsFetching ? '...' : (metadata?.description ?? '?')}</p>
        <p>{opener}</p>
      </div>
    </>
  )
}
