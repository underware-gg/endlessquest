import { usePlayer } from '../hooks/usePlayer'
import { useBridgeChamber } from '../hooks/BridgeContext'

export const PlayerLocation = () => {
  const {
    name,
    level,
    position,
    coord, slug,
    agentEntity, agentId,
    tileType, isDoor, nextCoord, nextSlug,
  } = usePlayer()

  // Always try to bridge current Chamber and the next
  useBridgeChamber(coord ?? 0n)
  useBridgeChamber(nextCoord ?? 0n)

  return (
    <div className='PlayerLocation'>
      <h3>Player</h3>
      {/* <div>Id: {name ?? '?'}</div> */}
      {/* <div>Level: {level ?? '?'}</div> */}

      <div className='Infos'>
        <div>World Position: {position?.x ?? '?'},{position?.y ?? '?'}</div>
        {/* <div>coord:{coord?.toString() ?? '?'}</div> */}
        <div>Chamber: {slug ?? '?'}</div>
        <div>Tile: {tileType}</div>
        <div>Agent: {agentId.toString()}</div>
        {isDoor ?? <div>Door to: {nextSlug}</div>}
      </div>
    </div>
  )
}
