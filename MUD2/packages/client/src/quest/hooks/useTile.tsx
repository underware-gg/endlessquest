import { useMemo } from 'react'
import { useComponentValue, useEntityQuery } from '@latticexyz/react'
import { Has, HasValue } from '@latticexyz/recs'
import { useMUD } from '../../store'

export const useTile = (position: { x: number, y: number }) => {
  const {
    networkLayer: {
      components: { Tile, Position, Door },
      systemCalls: { increment, decrement, bridge_tokenId, bridge_chamber },
      singletonEntity, storeCache,
    }
  } = useMUD()

  // Get Tile component at position
  const cleanPos = {
    x: position.x,
    y: position.y,
  }
  const entities = useEntityQuery([Has(Tile), HasValue(Position, cleanPos)]) ?? []
  const entity = useMemo(() => entities.length > 0 ? entities[0] : undefined, [entities])

  // QUERY from entities
  // const tiles = useMemo(() => {
  //   return [...entities].map(id => {
  //     const data = getComponentValueStrict(Tile, id)
  //     return data
  //   })
  // }, [entities])


  const tile = useComponentValue(Tile, entity)
  const door = useComponentValue(Door, entity)
  const nextCoord = door?.nextCoord ?? 0n

  return {
    position,
    tile,
    tileType: tile?.tileType ?? 0,
    isDoor: nextCoord != 0n,
    nextCoord,
  }
}
