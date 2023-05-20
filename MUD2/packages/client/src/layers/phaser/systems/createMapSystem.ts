import { EntityType } from "@latticexyz/recs";
import { Tileset } from "../../../artTypes/world";
import { PhaserLayer } from "../createPhaserLayer";
import { createNoise2D } from "simplex-noise";

export function createMapSystem(layer: PhaserLayer) {
  const {
    scenes: {
      Main: {
        maps: {
          Main: { putTileAt },
        },
      },
    },
  } = layer;

  interface singleTile {
    terrain: number,
    tileType: number,
    gridX: number,
    gridY: number,
  }

  const _addTileToMap = (tile: singleTile) => {
    const {
      tileType,
      terrain,
      gridX: x,
      gridY: y,
    } = tile
    const coord = { x, y }
    putTileAt(coord, Tileset.Grass, "Background");
    if (tileType == 0) {
      if (terrain == 1) {
        putTileAt(coord, Tileset.Forest, "Foreground");
      } else {
        putTileAt(coord, Tileset.Mountain, "Foreground");
      }
    }
  }

  const {
    components: { Counter, Doors, Tiles },
    systemCalls: { increment, decrement, bridge_tokenId, bridge_chamber },
    singletonEntity, storeCache,
  } = layer.networkLayer


  const tiles = storeCache.tables.Tiles.scan({});
  console.log(`TILES:`, tiles)
  tiles.forEach((tile) => _addTileToMap(tile.value as singleTile))

  Tiles.update$.subscribe((tile) => {
    const [nextValue, prevValue] = tile.value;
    console.log(`TILES_UPDATE:`, nextValue)
    _addTileToMap(nextValue as singleTile)
    // console.log("Counter updated", update, { nextValue, prevValue });
    // document.getElementById("counter")!.innerHTML = String(nextValue?.value ?? "unset");
  });




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
