import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react';
import { Has, HasValue, getComponentValueStrict } from '@latticexyz/recs';
import { useMUD } from '../../store';
import { usePlayer } from '../hooks/usePlayer';

export const PlayerLocation = () => {
  // const {
  //   components: { Position, Location },
  //   network: { playerEntity },
  // } = useMUD()

  const {
    name,
    level,
    position,
    coord, slug,
    agent,
  } = usePlayer()

  return (
    <div className='PlayerLocation'>
      <h2>Player</h2>
      <div>Name: {name ?? '?'}</div>
      <div>Level: {level ?? '?'}</div>
      <div>Pos: {position?.x ?? '?'},{position?.y ?? '?'}</div>
      {/* <div>coord:{coord?.toString() ?? '?'}</div> */}
      <div>chamber: {slug ?? '?'}</div>
      <div>agent: {BigInt(agent ? agent as string : 0).toString() ?? '?'}</div>
    </div>
  )
}
