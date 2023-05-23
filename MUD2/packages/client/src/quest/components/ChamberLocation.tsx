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
    isWaiting,
    url,
  } = useChamber()

  return (
    <div className='ChamberLocation'>

      <h2>Chamber</h2>
      <p>{isWaiting ? 'dreaming...' : (metadata?.name ?? '?')}</p>
      <p>{isWaiting ? '...' : (metadata?.description ?? '?')}</p>

      <div className='Infos'>
        <div>Token Id: {tokenId?.toString() ?? '?'}</div>
        <div>Chamber: {slug ?? '?'}</div>
        <div>Coord:{coord?.toString() ?? '?'}</div>
        <div>Yonder: {yonder ?? '?'}</div>
        <div>Gem: {gemName ?? '?'}</div>
        <div>Coins: {coins ?? '?'}</div>
        {/* <div>Worth: {worth ?? '?'}</div> */}
        <div>Url: {url?.slice(0,20) ?? '?'}</div>
      </div>

      <div className='LocationImage'>
        <img className='LocationImg' src={url ?? ''} />
      </div>

    </div>
  )
}
