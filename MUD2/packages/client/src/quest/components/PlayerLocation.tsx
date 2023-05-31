import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react'
import { Has, HasValue, getComponentValueStrict } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { usePlayer } from '../hooks/usePlayer'
import { useBridgeChamber } from '../hooks/BridgeContext'

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
    agentEntity, agentId,
    tileType, isDoor, nextCoord,
  } = usePlayer()

  // Bridge chamber if needed
  useBridgeChamber(nextCoord ?? 0n)

  return (
    <div className='PlayerLocation'>
      <h2>Player</h2>
      <div>Id: {name ?? '?'}</div>
      <div>Level: {level ?? '?'}</div>

      <div className='Infos'>
        <div>World Position: {position?.x ?? '?'},{position?.y ?? '?'}</div>
        {/* <div>coord:{coord?.toString() ?? '?'}</div> */}
        <div>Chamber: {slug ?? '?'}</div>
        <div>Tile: {tileType}</div>
        <div>Door: {isDoor ? 'yes' : 'no'}</div>
        <div>Agent: {agentId.toString()}</div>
      </div>
    </div>
  )
}
