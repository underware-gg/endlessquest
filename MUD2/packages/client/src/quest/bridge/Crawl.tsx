
//------------------------------
// Constsnts
//
export enum Tiles {
  Tile_Void = 0x00,
  Tile_Entry = 0x01,
  Tile_Exit = 0x02,
  Tile_LockedExit = 0x03,
  Tile_Gem = 0x04,
  Tile_HatchClosed = 0x05,
  Tile_HatchDown = 0x06,
  Tile_HatchUp = 0x07,
  Tile_Empty = 0xfe,
  Tile_Path = 0xff,
}

export const Terrain = {
  Empty: 0,
  Earth: 1,
  Water: 2,
  Air: 3,
  Fire: 4,
}
export const TerrainNames = {
  [Terrain.Empty]: '',
  [Terrain.Earth]: 'Earth',
  [Terrain.Water]: 'Water',
  [Terrain.Air]: 'Air',
  [Terrain.Fire]: 'Fire',
}

export const Gem = {
  Silver: 0,
  Gold: 1,
  Sapphire: 2,
  Emerald: 3,
  Ruby: 4,
  Diamond: 5,
  Ethernite: 6,
  Kao: 7,
  Coin: 8, // not a gem!
  // gem count
  Count: 8,
}
export const GemNames = {
  [Gem.Silver]: 'Silver',
  [Gem.Gold]: 'Gold',
  [Gem.Sapphire]: 'Sapphire',
  [Gem.Emerald]: 'Emerald',
  [Gem.Ruby]: 'Ruby',
  [Gem.Diamond]: 'Diamond',
  [Gem.Ethernite]: 'Ethernite',
  [Gem.Kao]: 'Kao',
  [Gem.Coin]: 'Coin',
}

export const Dir = {
  North: 0,
  East: 1,
  West: 2,
  South: 3,
}
export const DirNames = {
  [Dir.North]: 'North',
  [Dir.East]: 'East',
  [Dir.West]: 'West',
  [Dir.South]: 'South',
}


const uint64_max = BigInt('18446744073709551615') //new BN('0xffffffffffffffff', 16)
export const mask_Dir = uint64_max
export const mask_North = (mask_Dir << 192n)
export const mask_East = (mask_Dir << 128n)
export const mask_West = (mask_Dir << 64n)
export const mask_South = mask_Dir

export interface Compass {
  north: number
  east: number
  west: number
  south: number
}

export const coordToCompass = (coord: bigint): Compass => {
  return {
    north: Number((coord >> 192n) & mask_Dir),
    east: Number((coord >> 128n) & mask_Dir),
    west: Number((coord >> 64n) & mask_Dir),
    south: Number(coord & mask_Dir),
  }
}

const slugSeparator = ','
export const compassToSlug = (compass: Compass, separator = true): string => {
  let result = ''
  result += (compass.south > 0 ? `S${compass.south}` : `N${compass.north ?? 0}`)
  if (separator) result += slugSeparator
  result += (compass.west > 0 ? `W${compass.west}` : `E${compass.east ?? 0}`)
  return result
}

export const coordToSlug = (coord: bigint, separator = true): string => {
  return compassToSlug(coordToCompass(coord), separator)
}
