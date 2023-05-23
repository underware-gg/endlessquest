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
    agentEntity,
    agentId,
  } = usePlayer()

  return (
    <div className='PlayerLocation'>
      <h2>Player</h2>
      <div>Id: {name ?? '?'}</div>
      <div>Level: {level ?? '?'}</div>

      <div className='Infos'>
        <div>World Position: {position?.x ?? '?'},{position?.y ?? '?'}</div>
        {/* <div>coord:{coord?.toString() ?? '?'}</div> */}
        <div>chamber: {slug ?? '?'}</div>
        <div>agent: {agentId.toString()}</div>
      </div>
    </div>
  )
}
