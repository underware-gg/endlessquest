//------------------------------
// Constants
//
export var Tiles;
(function (Tiles) {
    Tiles[Tiles["Tile_Void"] = 0] = "Tile_Void";
    Tiles[Tiles["Tile_Entry"] = 1] = "Tile_Entry";
    Tiles[Tiles["Tile_Exit"] = 2] = "Tile_Exit";
    Tiles[Tiles["Tile_LockedExit"] = 3] = "Tile_LockedExit";
    Tiles[Tiles["Tile_Gem"] = 4] = "Tile_Gem";
    Tiles[Tiles["Tile_HatchClosed"] = 5] = "Tile_HatchClosed";
    Tiles[Tiles["Tile_HatchDown"] = 6] = "Tile_HatchDown";
    Tiles[Tiles["Tile_HatchUp"] = 7] = "Tile_HatchUp";
    Tiles[Tiles["Tile_Empty"] = 254] = "Tile_Empty";
    Tiles[Tiles["Tile_Path"] = 255] = "Tile_Path";
})(Tiles || (Tiles = {}));
export const Terrain = {
    Empty: 0,
    Earth: 1,
    Water: 2,
    Air: 3,
    Fire: 4,
};
export const TerrainNames = {
    [Terrain.Empty]: '',
    [Terrain.Earth]: 'Earth',
    [Terrain.Water]: 'Water',
    [Terrain.Air]: 'Air',
    [Terrain.Fire]: 'Fire',
};
export const Gem = {
    Silver: 0,
    Gold: 1,
    Sapphire: 2,
    Emerald: 3,
    Ruby: 4,
    Diamond: 5,
    Ethernite: 6,
    Kao: 7,
    Coin: 8,
    // gem count
    Count: 8,
};
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
};
export const Dir = {
    North: 0,
    East: 1,
    West: 2,
    South: 3,
};
export const DirNames = {
    [Dir.North]: 'North',
    [Dir.East]: 'East',
    [Dir.West]: 'West',
    [Dir.South]: 'South',
};
const uint64_max = BigInt('18446744073709551615'); //new BN('0xffffffffffffffff', 16)
export const mask_Dir = uint64_max;
export const mask_North = (mask_Dir << 192n);
export const mask_East = (mask_Dir << 128n);
export const mask_West = (mask_Dir << 64n);
export const mask_South = mask_Dir;
export const coordToCompass = (coord) => {
    return {
        north: Number((coord >> 192n) & mask_Dir),
        east: Number((coord >> 128n) & mask_Dir),
        west: Number((coord >> 64n) & mask_Dir),
        south: Number(coord & mask_Dir),
    };
};
const slugSeparator = ',';
export const compassToSlug = (compass, separator = true) => {
    let result = '';
    result += (compass.south > 0 ? `S${compass.south}` : `N${compass.north ?? 0}`);
    if (separator)
        result += slugSeparator;
    result += (compass.west > 0 ? `W${compass.west}` : `E${compass.east ?? 0}`);
    return result;
};
export const coordToSlug = (coord, separator = true) => {
    return compassToSlug(coordToCompass(coord), separator);
};
