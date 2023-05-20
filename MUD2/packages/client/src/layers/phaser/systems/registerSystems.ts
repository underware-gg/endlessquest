import { PhaserLayer } from "../createPhaserLayer";
import { createCamera } from "./createCamera";
import { createMapSystem } from "./createMapSystem";
import { createPlayerSystem } from "./createPlayerSystem";
import { createControlsSystem } from "./createControlsSystem";

export const registerSystems = (layer: PhaserLayer) => {
  createCamera(layer);
  createMapSystem(layer);
  createPlayerSystem(layer);
  createControlsSystem(layer);
};
