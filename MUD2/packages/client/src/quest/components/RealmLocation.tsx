import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react'
import { Has, HasValue, getComponentValueStrict } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { useRealm } from '../hooks/useRealm'

export const RealmLocation = () => {

  const {
    metadata,
    metadataIsFetching,
    url,
  } = useRealm(1n)

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

    </div>
  )
}
