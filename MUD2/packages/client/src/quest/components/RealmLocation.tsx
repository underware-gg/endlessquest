import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react';
import { Has, HasValue, getComponentValueStrict } from '@latticexyz/recs';
import { useMUD } from '../../store';
import { useRealm } from '../hooks/useRealm';

export const RealmLocation = () => {

  const {
    metadata,
    isWaiting,
    url,
  } = useRealm()

  return (
    <div>
      <div className='RealmLocation'>

        <h2>Realm</h2>
        <p className='Important'>{isWaiting ? 'dreaming...' : (metadata?.name ?? '?')}</p>
        <p>{isWaiting ? '...' : (metadata?.description ?? '?')}</p>

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
