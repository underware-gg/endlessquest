import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineMapConfig,
  defineCameraConfig,
} from "@latticexyz/phaserx";
import worldTileset from "../../../public/assets/tilesets/world.png";
import { TileAnimations, Tileset } from "../../artTypes/world";
import { Sprites, Assets, Maps, Scenes, TILE_HEIGHT, TILE_WIDTH, Animations } from "./constants";

const ANIMATION_INTERVAL = 200;

const mainMap = defineMapConfig({
  chunkSize: TILE_WIDTH * 64, // tile size * tile amount
  tileWidth: TILE_WIDTH,
  tileHeight: TILE_HEIGHT,
  // backgroundTile: [Tileset.Grass],
  backgroundTile: [
    Tileset.BG0, Tileset.BG0,
    Tileset.BG5, Tileset.BG6,
    Tileset.BG0, Tileset.BG0,
    Tileset.BG0, Tileset.BG0,
    Tileset.BG0, Tileset.BG7,
    Tileset.BG0, Tileset.BG0,
    Tileset.BG1, Tileset.BG2,
    Tileset.BG3, Tileset.BG4,
    Tileset.BG0, Tileset.BG0,
    Tileset.BG0, Tileset.BG0,
  ],
  animationInterval: ANIMATION_INTERVAL,
  tileAnimations: TileAnimations,
  layers: {
    layers: {
      Background: { tilesets: ["Default"] },
      Foreground: { tilesets: ["Default"] },
    },
    defaultLayer: "Background",
  },
});

export const phaserConfig = {
  sceneConfig: {
    [Scenes.Main]: defineSceneConfig({
      assets: {
        [Assets.Tileset]: {
          type: AssetType.Image,
          key: Assets.Tileset,
          path: worldTileset,
        },
        [Assets.MainAtlas]: {
          type: AssetType.MultiAtlas,
          key: Assets.MainAtlas,
          // Add a timestamp to the end of the path to prevent caching
          path: `/assets/atlases/atlas.json?timestamp=${Date.now()}`,
          options: {
            imagePath: "/assets/atlases/",
          },
        },
      },
      maps: {
        [Maps.Main]: mainMap,
      },
      sprites: {
        [Sprites.Soldier]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/soldier/idle/0.png",
        },
        [Sprites.PlayerGhost]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/player/idle/0.png",
        },
      },
      animations: [
        {
          key: Animations.GolemIdle,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 3,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/golem/idle/",
          suffix: ".png",
        },
        //
        // Player
        {
          key: Animations.PlayerIdle,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 4,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/player/idle/",
          suffix: ".png",
        },
        //
        // Agents
        {
          key: Animations.AgentsBlacksmith,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 7,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/agents/blacksmith/",
          suffix: ".png",
        },
        {
          key: Animations.AgentsDancer,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 19,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/agents/dancer/",
          suffix: ".png",
        },
        {
          key: Animations.AgentsFisherman,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 3,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/agents/fisherman/",
          suffix: ".png",
        },
        {
          key: Animations.AgentsHerbalist,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 7,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/agents/herbalist/",
          suffix: ".png",
        },
        {
          key: Animations.AgentsMilady,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 3,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/agents/milady/",
          suffix: ".png",
        },
        {
          key: Animations.AgentsMiner,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 3,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/agents/miner/",
          suffix: ".png",
        },
        {
          key: Animations.AgentsPotionMaker,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 8,
          frameRate: 6,
          repeat: -1,
          prefix: "sprites/agents/potionmaker/",
          suffix: ".png",
        },
      ],
      tilesets: {
        Default: {
          assetKey: Assets.Tileset,
          tileWidth: TILE_WIDTH,
          tileHeight: TILE_HEIGHT,
        },
      },
    }),
  },
  scale: defineScaleConfig({
    parent: "phaser-game",
    zoom: 1,
    mode: Phaser.Scale.NONE,
  }),
  cameraConfig: defineCameraConfig({
    pinchSpeed: 1,
    wheelSpeed: 1,
    maxZoom: 3,
    minZoom: 1,
  }),
  cullingChunkSize: TILE_HEIGHT * 16,
};
