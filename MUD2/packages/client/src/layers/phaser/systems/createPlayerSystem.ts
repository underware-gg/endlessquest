import { Has, defineEnterSystem, defineSystem, defineUpdateSystem, getComponentValueStrict, hasComponent, setComponent } from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { Animations, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";

export function createPlayerSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: {
        Position,
      },
      systemCalls: {
        spawn
      },
      playerEntity,
    },
    scenes: {
      Main: {
        objectPool,
        input,
        camera,
      },
    },
  } = layer;

  input.pointerdown$.subscribe((event) => {
    if (playerEntity && hasComponent(Position, playerEntity)) return;

    const x = event.pointer.worldX;
    const y = event.pointer.worldY;

    const position = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
    if (position.x === 0 && position.y === 0) return;

    spawn(position.x, position.y);
  });

  defineEnterSystem(world, [Has(Position)], ({ entity }) => {
    const playerObj = objectPool.get(entity, "Sprite");

    playerObj.setComponent({
      id: 'animation',
      once: (sprite) => {
        sprite.play(Animations.GolemIdle);
      }
    });
  });

  defineSystem(world, [Has(Position)], ({ entity }) => {
    const position = getComponentValueStrict(Position, entity);
    const pixelPosition = tileCoordToPixelCoord(position, TILE_WIDTH, TILE_HEIGHT);

    const playerObj = objectPool.get(entity, "Sprite");

    playerObj.setComponent({
      id: 'position',
      once: (sprite) => {
        sprite.setPosition(pixelPosition.x, pixelPosition.y);

        const isPlayer = entity === playerEntity;
        if (isPlayer) {
          camera.centerOn(pixelPosition.x, pixelPosition.y);
        }
      }
    });
  });
}