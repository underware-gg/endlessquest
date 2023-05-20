import { runQuery, defineQuery, getComponentValueStrict, Has, HasValue, Entity } from "@latticexyz/recs";
import { Tileset } from "../../../artTypes/world";
import { PhaserLayer } from "../createPhaserLayer";
// import { createNoise2D } from "simplex-noise";
// import { map } from "rxjs";

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
      systemCalls: {
        spawn
      },
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
    putTileAt(position, Tileset.Grass, "Background");
    if (tileType == 0) {
      if (terrain == 1 || terrain == 2) {
        putTileAt(position, Tileset.Forest, "Foreground");
      } else {
        putTileAt(position, Tileset.Mountain, "Foreground");
      }
    }
  }

  const _addTileQuery = (entity: Entity) => {
    const tile = getComponentValueStrict(Tiles, entity)
    const position = getComponentValueStrict(Position, entity)
    console.log(`TILES_UPDATE:`, tile, position)
    if (tile.isEntry) {
      spawn(position.x, position.y);
    }
    _addTileToMap(tile as singleTile, position as singlePosition)
  }

  const initQuery = runQuery([
    Has(Tiles),
    Has(Position),
  ])
  console.log(`INIT`, initQuery)
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
