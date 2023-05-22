import { useComponentValue, useEntityQuery, useRow } from '@latticexyz/react';
import { Has, HasValue, getComponentValueStrict } from '@latticexyz/recs';
import { useMUD } from '../../store';
import { useEffect } from 'react';
import * as Crawl from '../bridge/Crawl';

export const Loader = () => {
  const {
    networkLayer: {
      components: { Counter, Doors, Tiles },
      systemCalls: { increment, decrement, bridge_tokenId, bridge_chamber },
      singletonEntity, storeCache,
    }
  } = useMUD();

  // const counter = useComponentValue(Counter, singletonEntity);
  // const tokenId = BigInt(counter?.value?.toString() ?? '0')
  const tokenId = 1n;

  //
  // TokenSystem
  //
  // query by KEY
  const token = useRow(storeCache, { table: 'Token', key: { tokenId } });
  const coord = token?.value?.coord ?? 0n
  useEffect(() => {
    if (tokenId && !coord) {
      bridge_tokenId(tokenId)
    }
  }, [tokenId, coord])
  // const compass = Crawl.coordToCompass(coord)
  // const slug = Crawl.compassToSlug(compass)
  const slug = Crawl.coordToSlug(coord)

  //
  // ChamberSystem
  //
  console.log(`Loader coord:`, coord)
  useEffect(() => {
    if (coord) {
      bridge_chamber(coord)
    }
  }, [coord])
  const chamberData = useRow(storeCache, { table: 'Chamber', key: { coord } });
  const seed = chamberData?.value?.seed?.toString() ?? null

  //
  // DoorSystem, TilesSystem
  //
  // query by VALUE
  const doors = useEntityQuery([HasValue(Doors, { coord })]) ?? []
  const tiles = useEntityQuery([HasValue(Tiles, { terrain: chamberData?.value?.terrain })]) ?? []

  const coordOk = Boolean(coord)
  const chamberOk = Boolean(seed)
  const doorsOk = doors.length > 0
  const tilesOk = tiles.length > 0

  return (
    <div className='Loader'>
      Load <span>{tokenId.toString() ?? '??'}</span>: 
      {coordOk ? 'x' : '.'}
      {chamberOk ? 'x' : '.'}
      {doorsOk ? 'x' : '.'}
      {tilesOk ? 'x' : '.'}
      {` ${slug}`}
    </div>
  );
};
