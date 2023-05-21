import { createPhaserEngine } from "@latticexyz/phaserx";
import { namespaceWorld } from "@latticexyz/recs";
import { NetworkLayer } from "../network/createNetworkLayer";
import { registerSystems } from "./systems";
import { BOUNDS } from "./constants";

export type PhaserLayer = Awaited<ReturnType<typeof createPhaserLayer>>;
type PhaserEngineConfig = Parameters<typeof createPhaserEngine>[0];

export const createPhaserLayer = async (networkLayer: NetworkLayer, phaserConfig: PhaserEngineConfig) => {
  const world = namespaceWorld(networkLayer.world, "phaser");

  const { game, scenes, dispose: disposePhaser } = await createPhaserEngine(phaserConfig);
  world.registerDisposer(disposePhaser);

  const { camera } = scenes.Main;

  camera.phaserCamera.setBounds(BOUNDS.x, BOUNDS.y, BOUNDS.width, BOUNDS.height);
  camera.phaserCamera.centerOn(0, 0);
  camera.phaserCamera.setZoom(1);

  const components = {};

  const layer = {
    networkLayer,
    world,
    game,
    scenes,
    components,
  };

  registerSystems(layer);

  return layer;
};
