import { useMemo } from 'react'
import { useComponentValue } from '@latticexyz/react'
import { normalizeEntityID } from '@latticexyz/network'
import { useMUD } from '../../store'
import { useCoord } from './useCoord'
import { useTile } from './useTile'

export const usePlayer = () => {
  const {
    networkLayer: {
      components: { Player, Position, Location },
      playerEntity,
    }
  } = useMUD()

  const player = useComponentValue(Player, playerEntity)
  const position = useComponentValue(Position, playerEntity)
  const location = useComponentValue(Location, playerEntity)
  const { compass, slug } = useCoord(location?.coord ?? 0n)

  const coord = useMemo(() => (location?.coord ?? undefined), [location])

  const agentEntity = useMemo(() => (normalizeEntityID(location?.agent ?? '0')), [location])
  const agentId = useMemo(() => (BigInt(agentEntity ? agentEntity as string : 0)), [agentEntity])

  const { tileType, isDoor, nextCoord } = useTile(position ?? { x: 0, y: 0 })

  return {
    position,
    name: player?.name ?? null,
    level: player?.level ?? null,
    coord,
    agentEntity, agentId,
    compass, slug,
    tileType, isDoor, nextCoord,
  }
}
