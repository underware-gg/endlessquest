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
        opener: 'address',
        bitmap: 'uint256',
      }
    },
  },
});
