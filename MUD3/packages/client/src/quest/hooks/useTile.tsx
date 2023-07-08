import { useMemo } from 'react'
import { useComponentValue, useEntityQuery } from '@latticexyz/react'
import { Has, HasValue } from '@latticexyz/recs'
import { useMUD } from '../../store'
import { coordToSlug } from '@rsodre/crawler-data'

export const useTile = (position: { x: number, y: number }) => {
  const {
    networkLayer: {
      components: { Tile, Position, Door },
      // singletonEntity, storeCache,
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
  const isDoor = nextCoord != 0n
  const nextSlug = isDoor ? coordToSlug(nextCoord, null) :  ''

  return {
    position,
    tile,
    tileType: tile?.tileType ?? 0,
    isDoor,
    nextCoord,
    nextSlug,
  }
}
