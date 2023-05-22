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
  } = useChamber()

  return (
    <div className='ChamberLocation'>
      <h2>Chamber</h2>
      <div>coord: {coord?.toString() ?? '?'}</div>
      <div>chamber: {slug ?? '?'}</div>
      <div>tokenId: {tokenId?.toString() ?? '?'}</div>
      <div>yonder: {yonder ?? '?'}</div>
      <div>gem: {gemName ?? '?'}</div>
      <div>coins: {coins ?? '?'}</div>
      <div>worth: {worth ?? '?'}</div>
    </div>
  )
}
