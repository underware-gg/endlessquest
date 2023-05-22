export enum Scenes {
  Main = "Main",
}

export enum Maps {
  Main = "Main",
}

export enum Animations {
  GolemIdle = "GolemIdle",
  GolemGhost = "GolemGhost",
  // Player
  PlayerIdle = "PlayerIdle",
  PlayerGhost = "PlayerGhost",
  // Agents
  AgentsBlacksmith = "AgentsBlacksmith",
  AgentsDancer = "AgentsDancer",
  AgentsFisherman = "AgentsFisherman",
  AgentsHerbalist = "AgentsHerbalist",
  AgentsMilady = "AgentsMilady",
  AgentsMiner = "AgentsMiner",
  AgentsPotionMaker = "AgentsPotionMaker",
}
export enum Sprites {
  Soldier,
}

export enum Assets {
  MainAtlas = "MainAtlas",
  Tileset = "Tileset",
}

export enum Direction {
  Unknown,
  Up,
  Down,
  Left,
  Right
}

export const TILE_WIDTH = 32;
export const TILE_HEIGHT = 32;

export const CHAMBER_ROWS = 22;
export const CHAMBER_COLS = 22;

export const WORLD_WIDTH = CHAMBER_COLS * 20 * TILE_WIDTH;
export const WORLD_HEIGHT = CHAMBER_ROWS * 20 * TILE_HEIGHT;

export const BOUNDS = {
  x: -WORLD_WIDTH / 2,
  y: -WORLD_HEIGHT / 2,
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
}