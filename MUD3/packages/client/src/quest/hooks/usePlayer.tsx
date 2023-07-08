import { useMemo } from 'react'
import { useComponentValue } from '@latticexyz/react'
import { Entity } from '@latticexyz/recs'
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

  const agentEntity = useMemo(() => (location?.agent ?? '0x0'), [location]) as Entity
  const agentId = useMemo(() => (BigInt(agentEntity ? agentEntity as string : 0)), [agentEntity])

  const { tileType, isDoor, nextCoord, nextSlug } = useTile(position ?? { x: 0, y: 0 })

  return {
    position,
    name: player?.name ?? null,
    level: player?.level ?? null,
    coord,
    agentEntity, agentId,
    compass, slug,
    tileType, isDoor,
    nextCoord, nextSlug,
  }
}
