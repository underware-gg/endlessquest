import {
  Has, HasValue,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
  hasComponent,
  setComponent,
  defineQuery,
  runQuery,
  Entity,
 } from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { Animations, Sprites, Assets, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { phaserConfig } from "../../../layers/phaser/configurePhaser";
import atlasJson from "../../../../public/assets/atlases/atlas.json";

export function createPlayerSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: {
        Position,
        Player,
        Tiles,
        Door,
      },
      systemCalls: {
        spawn,
        bridge_chamber,
      },
      playerEntity,
    },
    scenes: {
      Main: {
        objectPool,
        input,
        camera,
        phaserScene,
      },
    },
  } = layer;

  let _ghost: Phaser.GameObjects.Sprite

  const _playerHasSpawned = () => {
    return (playerEntity && hasComponent(Player, playerEntity))
  }
  const _isPlayer = (entity:Entity) => {
    return (entity == playerEntity)
  }

  // spawn by click
  input.pointerdown$.subscribe((event) => {
    if (!event.pointer) return
    const x = event.pointer.worldX;
    const y = event.pointer.worldY;
    const position = pixelCoordToTileCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
    // only on free tiles
    const query = runQuery([Has(Tiles), HasValue(Position, position)])
    query.forEach((entity) => {
      const tile = getComponentValueStrict(Tiles, entity)
      console.log(`CRAWLER: Clicked tile:`, position, tile)
      if (tile.tileType != 0 && !_playerHasSpawned()) {
        console.log(`CRAWLER: Spawn at click!`)
        spawn(position.x, position.y);
      }
    });
  });


  // auto spawn when a new entry is loaded
  const query = defineQuery([Has(Tiles), Has(Position)])
  query.update$.subscribe((comp) => {
    if (_playerHasSpawned()) return;
    const tile = getComponentValueStrict(Tiles, comp.entity)
    if (tile.isEntry) {
      const position = getComponentValueStrict(Position, comp.entity)
      console.log(`CRAWLER: Spawn at entry!`, position, tile)
      spawn(position.x, position.y);
    }
  });

  defineEnterSystem(world, [Has(Position), Has(Player)], ({ entity }) => {
    const playerObj = objectPool.get(entity, "Sprite");
 
    playerObj.setComponent({
      id: 'animation',
      once: (sprite) => {
        sprite.play(Animations.PlayerIdle);
        sprite.setName('ThePlayer')
        // sprite.setScale(1.25)
      }
    });

    if (_isPlayer(entity) && _ghost == null) {
      const spriteName = phaserConfig.sceneConfig.Main.sprites[Sprites.PlayerGhost].frame
      // const spriteIndex = atlasJson.textures[0].frames.findIndex((atlasFrame) => atlasFrame.filename === spriteName);
      _ghost = phaserScene.add.sprite(playerObj.position.x, playerObj.position.y, Assets.MainAtlas, spriteName)
      _ghost.setAlpha(0.4)
      _ghost.setName('Ghost')
      _ghost.setVisible(false)
    }
  });

  defineSystem(world, [Has(Position), Has(Player)], ({ entity }) => {
    const position = getComponentValueStrict(Position, entity);
    const pixelPosition = tileCoordToPixelCoord(position, TILE_WIDTH, TILE_HEIGHT);

    const tileQuery = runQuery([Has(Tiles), HasValue(Position, position)])
    tileQuery.forEach((entity) => {
      const tile = getComponentValueStrict(Tiles, entity)
      console.log(`CRAWLER: Player moved...`, position, tile)
    });

    // move player sprite  
    const playerObj = objectPool.get(entity, "Sprite");
    playerObj.setComponent({
      id: 'position',
      once: (sprite) => {
        sprite.setPosition(pixelPosition.x, pixelPosition.y);
        if (_isPlayer(entity)) {
          // camera.centerOn(pixelPosition.x, pixelPosition.y);
          // need to expose camera.pan() on phaserx
          camera.phaserCamera.pan(pixelPosition.x, pixelPosition.y, 3000, 'Sine');
          _ghost.setPosition(pixelPosition.x + TILE_WIDTH / 2, pixelPosition.y + TILE_HEIGHT/2)
          _ghost.setVisible(false)
        }
      }
    });

    // get tile over player
    const doorQuery = runQuery([Has(Door), HasValue(Position, position)])
    doorQuery.forEach((entity) => {
      const door = getComponentValueStrict(Door, entity)
      console.log(`CRAWLER: Open door...`, position, door)
      bridge_chamber(door.nextCoord)
    });


  });
}