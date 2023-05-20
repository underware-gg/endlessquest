import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
    Token: {
      keySchema: {
        tokenId: 'uint256'
      },
      schema: {
        coord: 'uint256'
      }
    },
    Chamber: {
      keySchema: {
        coord: 'uint256'
      },
      schema: {
        // player who opened this chamber
        opener: 'address',
        // bridged data
        tokenId: 'uint256',
        seed: 'uint256',
        yonder: 'uint8',
        chapter: 'uint8',
        terrain: 'uint8',
        entryDir: 'uint8',
        gemPos: 'uint8',
        gemType: 'uint8',
        coins: 'uint16',
        worth: 'uint16'
      }
    },
    Doors: {
      keySchema: {
        key: 'bytes32',
      },
      schema: {
        coord: 'uint256',
        index: 'uint8',
        dir: 'uint8',
        locked: 'bool',
        nextCoord: 'uint256',
      }
    },
    Tiles: {
      keySchema: {
        key: 'bytes32',
      },
      schema: {
        // coord: 'uint256',
        // index: 'uint8',
        terrain: 'uint8',
        tileType: 'uint8',
        // tileX: 'uint8',
        // tileY: 'uint8',
        gridX: 'uint32',
        gridY: 'uint32',
      }
    },
  },
  modules: [
    {
      name: "UniqueEntityModule",
      root: true,
      args: [resolveTableId("Doors")],
    },
    {
      name: "UniqueEntityModule",
      root: true,
      args: [resolveTableId("Tiles")],
    },
  ],
});
