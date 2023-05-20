export enum Scenes {
  Main = "Main",
}

export enum Maps {
  Main = "Main",
}

export enum Animations {
  SwordsmanIdle = "SwordsmanIdle",
}
export enum Sprites {
  Soldier,
}

export enum Assets {
  MainAtlas = "MainAtlas",
  Tileset = "Tileset",
}

export const TILE_WIDTH = 32;
export const TILE_HEIGHT = 32;

export const CHAMBER_ROWS = 8;
export const CHAMBER_COLS = 8;

export const WORLD_WIDTH = CHAMBER_COLS * 20 * TILE_WIDTH;
export const WORLD_HEIGHT = CHAMBER_ROWS * 20 * TILE_HEIGHT;


export const BOUNDS = {
  x: -WORLD_WIDTH / 2,
  y: -WORLD_HEIGHT / 2,
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
}