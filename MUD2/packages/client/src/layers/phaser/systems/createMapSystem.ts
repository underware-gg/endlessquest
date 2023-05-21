import { runQuery, defineQuery, getComponentValueStrict, Has, HasValue, Entity } from "@latticexyz/recs";
import { Tileset } from "../../../artTypes/world";
import { PhaserLayer } from "../createPhaserLayer";
import { createNoise2D } from "simplex-noise";
// import { map } from "rxjs";

const noise = createNoise2D();

const _random_int = (r: number, maxNonInclusive: number) => {
  return Math.floor(r * maxNonInclusive)
}
const _random_array = (r: number, array: any[]) => {
  return array[_random_int(r, array.length)]
}


export function createMapSystem(layer: PhaserLayer) {
  const {
    scenes: {
      Main: {
        maps: {
          Main: { putTileAt },
        },
      },
    },
    networkLayer: {
      // systemCalls: {
      //   spawn
      // },
      components: {
        Tiles,
        Position,
      },
    }
  } = layer;

  interface singleTile {
    terrain: number,
    tileType: number,
    isEntry: boolean,
  }
  interface singlePosition {
    x: number,
    y: number,
  }

  const _addTileToMap = (tile: singleTile, position: singlePosition) => {
    const {
      tileType,
      terrain,
    } = tile
    let seed = noise(position.x, position.y); // -1 .. 1
    seed = ((seed + 1) / 2); //0..1

    //
    // PATHS
    //
    if (tileType > 0) {
      // tiles
      let t = [Tileset.Grass1, Tileset.Grass2, Tileset.AirPath1, Tileset.FirePath1][terrain-1]
      putTileAt(position, t, "Background");

      // doors / portals / pathways
      if (tileType == 1 || tileType == 2) {
        putTileAt(position, Tileset.Rocks3, "Foreground");
      }
    }

    //
    // Walls
    //
    if (tileType == 0) {
      let t = null
      if (terrain == 1) { // Earth
        t = _random_array(seed, [
          null, null,
          Tileset.Tree1, Tileset.Tree1, Tileset.Tree2, Tileset.Moss5, Tileset.Moss4, Tileset.Mosses1,
        ])
      } else if (terrain == 2) { // Water
        putTileAt(position, Tileset.Water1, "Background");
        t = _random_array(seed, [
          null, null, null, null, null, null, null, null, null,
          Tileset.Water2, Tileset.Water2, Tileset.Water2, Tileset.Water2,
          Tileset.Water3, 
          Tileset.Water4, // skull
          Tileset.Floater1, Tileset.Floater2, Tileset.Floater3, Tileset.Floater4,
          Tileset.Floater1, Tileset.Floater2, Tileset.Floater3, Tileset.Floater4,
        ])
      } else if (terrain == 3) { // Air
        putTileAt(position, Tileset.AirPath3, "Background");
        t = _random_array(seed, [
          Tileset.Rocks1, Tileset.Rocks1, Tileset.Rocks3, Tileset.Rocks3,
          Tileset.Rock1, Tileset.Rock2, Tileset.Rock3, Tileset.Rock4,
          Tileset.Moss3, Tileset.Moss1,
        ])
      } else { // Fire
        putTileAt(position, Tileset.FirePath2, "Background");
        t = _random_array(seed, [
          null, null,
          Tileset.Debris1, Tileset.Debris2,
          Tileset.Debris3, Tileset.Debris3,
          // Tileset.Debris4, Tileset.Debris4,
          Tileset.Foliage1, Tileset.Foliage5, Tileset.Foliage6,
        ])
      }
      if (t !== null) {
        putTileAt(position, t, "Foreground");
      }
    }
  }

  const _addTileQuery = (entity: Entity) => {
    const tile = getComponentValueStrict(Tiles, entity)
    const position = getComponentValueStrict(Position, entity)
    // console.log(`TILES_UPDATE:`, tile, position)
    _addTileToMap(tile as singleTile, position as singlePosition)
  }

  const initQuery = runQuery([
    Has(Tiles),
    Has(Position),
  ])
  console.log(`INIT TILES QUERY`, initQuery)
  initQuery.forEach((entity) => {
    _addTileQuery(entity)
  })

  const query = defineQuery([
    Has(Tiles),
    Has(Position),
  ])

  query.update$.subscribe((comp) => {
    _addTileQuery(comp.entity)
  });


  // let observable = query.update$.pipe(map(() => [...query.matching]));
  // observable.subscribe((entities) => {
  //   entities.forEach((entity) => {
  //     const tile = getComponentValueStrict(Tiles, entity)
  //     const position = getComponentValueStrict(Position, entity)
  //     // console.log(`TILES_UPDATE:`, tile, position)
  //     _addTileToMap(tile as singleTile, position as singlePosition)
  //   });
  // });


  // const noise = createNoise2D();
  // for (let x = -10; x < 10; x++) {
  //   for (let y = -10; y < 10; y++) {
  //     const coord = { x, y };
  //     const seed = noise(x, y);
  //     putTileAt(coord, Tileset.Grass, "Background");
  //     if (seed >= 0.45) {
  //       putTileAt(coord, Tileset.Mountain, "Foreground");
  //     } else if (seed < -0.45) {
  //       putTileAt(coord, Tileset.Forest, "Foreground");
  //     }
  //   }
  // }
}
