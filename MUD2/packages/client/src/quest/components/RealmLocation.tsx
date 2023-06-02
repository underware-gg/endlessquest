import { useSettingsContext } from '../hooks/SettingsContext'
import { useRealm } from '../hooks/useRealm'

export const RealmLocation = () => {
  const { realmCoord, logo } = useSettingsContext()

  const {
    metadata,
    metadataIsFetching,
    url,
  } = useRealm(realmCoord)

  return (
    <>
      <div className='RealmImage'>
        <img className='FillParent' src={url ?? logo} />
      </div>

      <div className='RealmLocation'>
        <h3>Realm</h3>
        <p className='Important'>{metadataIsFetching ? 'dreaming...' : (metadata?.name ?? '?')}</p>
        <p>{metadataIsFetching ? '...' : (metadata?.description ?? '?')}</p>
      </div>
    </>
  )
}
