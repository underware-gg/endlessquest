export declare enum Tiles {
    Tile_Void = 0,
    Tile_Entry = 1,
    Tile_Exit = 2,
    Tile_LockedExit = 3,
    Tile_Gem = 4,
    Tile_HatchClosed = 5,
    Tile_HatchDown = 6,
    Tile_HatchUp = 7,
    Tile_Empty = 254,
    Tile_Path = 255
}
export declare const Terrain: {
    Empty: number;
    Earth: number;
    Water: number;
    Air: number;
    Fire: number;
};
export declare const TerrainNames: {
    [x: number]: string;
};
export declare const Gem: {
    Silver: number;
    Gold: number;
    Sapphire: number;
    Emerald: number;
    Ruby: number;
    Diamond: number;
    Ethernite: number;
    Kao: number;
    Coin: number;
    Count: number;
};
export declare const GemNames: {
    [x: number]: string;
};
export declare const Dir: {
    North: number;
    East: number;
    West: number;
    South: number;
};
export declare const DirNames: {
    [x: number]: string;
};
export declare const mask_Dir: bigint;
export declare const mask_North: bigint;
export declare const mask_East: bigint;
export declare const mask_West: bigint;
export declare const mask_South: bigint;
export interface Compass {
    north: number;
    east: number;
    west: number;
    south: number;
}
export declare const coordToCompass: (coord: bigint) => Compass;
export declare const compassToSlug: (compass: Compass, separator?: boolean) => string;
export declare const coordToSlug: (coord: bigint, separator?: boolean) => string;
