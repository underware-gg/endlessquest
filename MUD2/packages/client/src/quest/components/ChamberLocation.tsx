import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react';
import { Has, HasValue, getComponentValueStrict } from '@latticexyz/recs';
import { useMUD } from '../../store';
import { useChamber } from '../hooks/useChamber';

export const ChamberLocation = () => {
  // const {
  //   components: { Position, Location },
  //   network: { playerEntity },
  // } = useMUD()

  const {
    coord,
    slug,
    tokenId,
    yonder,
    gemType,
    gemName,
    coins,
    worth,
    metadata,
    isFetching,
    isError,
    url,
  } = useChamber()

  return (
    <div>
      <div className='ChamberLocation'>

        <h2>Location</h2>
        <p className='Important'>{isFetching ? 'dreaming...' : (metadata?.name ?? '?')}</p>
        <p>{isFetching ? '...' : (metadata?.description ?? '?')}</p>

        <div className='Infos'>
          <div>Token Id: {tokenId?.toString() ?? '?'}</div>
          <div>Chamber: {slug ?? '?'}</div>
          {/* <div>Coord:{coord?.toString() ?? '?'}</div> */}
          <div>Yonder: {yonder ?? '?'}</div>
          <div>Gem: {gemName ?? '?'}</div>
          <div>Coins: {coins ?? '?'}</div>
          {/* <div>Worth: {worth ?? '?'}</div> */}
          {/* <div>Url: {url?.slice(0, 20) ?? '?'}</div> */}
        </div>
      </div>

      {url &&
        <div className='ChamberLocation'>
          <img className='FillParent' src={url} />
        </div>
      }
    </div>
  )
}
