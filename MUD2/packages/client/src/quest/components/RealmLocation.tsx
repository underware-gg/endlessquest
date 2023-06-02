import { useSettingsContext } from '../hooks/SettingsContext'
import { useRealm } from '../hooks/useRealm'

export const RealmLocation = () => {
  const { realmCoord } = useSettingsContext()

  const {
    metadata,
    metadataIsFetching,
    url,
  } = useRealm(realmCoord)

  return (
    <div>
      <div className='RealmLocation'>

        <h3>Realm</h3>
        <p className='Important'>{metadataIsFetching ? 'dreaming...' : (metadata?.name ?? '?')}</p>
        <p>{metadataIsFetching ? '...' : (metadata?.description ?? '?')}</p>

        {/* <div className='Infos'>
          <div>Yonder: {yonder ?? '?'}</div>
          <div>Gem: {gemName ?? '?'}</div>
          <div>Coins: {coins ?? '?'}</div>
          <div>Url: {url?.slice(0, 20) ?? '?'}</div>
        </div> */}

      </div>

      {/* {url &&
        <div className='RealmImage'>
          <img className='FillParent' src={url} />
        </div>
      } */}

    </div>
  )
}
