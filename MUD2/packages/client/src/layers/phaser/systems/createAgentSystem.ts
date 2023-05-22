import {
  Has, HasValue,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
  hasComponent,
  setComponent,
  defineQuery,
  runQuery,
} from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { Animations, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { pixelCoordToTileCoord, tileCoordToPixelCoord } from "@latticexyz/phaserx";

export function createAgentSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: {
        Position,
        Agent,
        Player,
        Tiles,
      },
      // systemCalls: {
      //   spawn,
      // },
      // playerEntity,
    },
    scenes: {
      Main: {
        objectPool,
      },
    },
  } = layer;

  defineEnterSystem(world, [Has(Position), Has(Agent)], ({ entity }) => {
    const position = getComponentValueStrict(Position, entity);
    const pixelPosition = tileCoordToPixelCoord(position, TILE_WIDTH, TILE_HEIGHT);

    // const spr = Animations.AgentsBlacksmith
    // const spr = Animations.AgentsDancer
    // const spr = Animations.AgentsFisherman
    const spr = Animations.AgentsHerbalist
    // const spr = Animations.AgentsMilady
    // const spr = Animations.AgentsMiner
    // const spr = Animations.AgentsPotionMaker

    const agentObj = objectPool.get(entity, "Sprite");
    agentObj.setComponent({
      id: 'animation',
      once: (sprite) => {
        sprite.setPosition(pixelPosition.x, pixelPosition.y);
        sprite.play(spr);
      }
    });
  });

  defineSystem(world, [Has(Position), Has(Player)], ({ entity }) => {
    const position = getComponentValueStrict(Position, entity);

    // find nearby agents when player moves
    [
      { ...position, x: position.x - 1 },
      { ...position, x: position.x + 1 },
      { ...position, y: position.y + 1 },
      { ...position, y: position.y - 1 },
    ].forEach((agentPosition) => {
      const tileQuery = runQuery([Has(Agent), HasValue(Position, agentPosition)])
      tileQuery.forEach((entity) => {
        const agent = getComponentValueStrict(Agent, entity)
        console.log(`CRAWLER: Reached Agent...`, agentPosition, agent)
      });
    })

  });
}