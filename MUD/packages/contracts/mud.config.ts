import { mudConfig } from "@latticexyz/world/register";

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
        coins: 'uint8',
        worth: 'uint8'
      }
    },
  },
});
