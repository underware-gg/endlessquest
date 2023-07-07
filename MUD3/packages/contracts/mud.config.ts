import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    Direction: [
      'Unknown',
      'Up',
      'Down',
      'Left',
      'Right',
    ]
  },
  tables: {
    Counter: {
      keySchema: {},
      schema: "uint32",
    },


    //-----------------------
    Realm: {
      keySchema: {
        coord: 'uint256'
      },
      schema: {
        // player who opened this Realm
        opener: 'address',
      }
    },
    //-----------------------
    Token: {
      keySchema: {
        tokenId: 'uint32'
      },
      schema: {
        coord: 'uint256'
      }
    },
    //-----------------------
    Chamber: {
      keySchema: {
        coord: 'uint256'
      },
      schema: {
        // player who opened this Chamber
        opener: 'address',
        // bridged data
        tokenId: 'uint32',
        seed: 'uint256',
        yonder: 'uint8',
        chapter: 'uint8',
        terrain: 'uint8',
        entryDir: 'uint8',
        gemPos: 'uint8',
        gemType: 'uint8',
        coins: 'uint16',
        worth: 'uint16',
        agent: 'bytes32'
      }
    },
    ChamberMetadata: {
      keySchema: {
        coord: 'uint256'
      },
      schema: {
        metadata: 'string',
        url: 'string',
      }
    },
    //-----------------------
    Agent: {
      keySchema: {
        key: 'bytes32',
      },
      schema: {
        coord: 'uint256',
        seed: 'uint256',
        tokenId: 'uint32',
        yonder: 'uint8',
        terrain: 'uint8',
        gemType: 'uint8',
        coins: 'uint16',
        worth: 'uint16'
      }
    },
    Metadata: {
      schema: {
        metadata: 'string',
        url: 'string',
      }
    },
    // //-----------------------
    // Tile: {
    //   keySchema: {
    //     key: 'bytes32',
    //   },
    //   schema: {
    //     tokenId: 'uint32', // just for queries
    //     terrain: 'uint8',
    //     tileType: 'uint8',
    //     isEntry: 'bool',
    //   }
    // },
    // Door: {
    //   schema: {
    //     nextCoord: 'uint256',
    //   }
    // },
    Position: {
      schema: {
        x: 'int32',
        y: 'int32',
      }
    },
    Blocker: {
      schema: {
        enabled: 'bool',
      }
    },
    // //-----------------------
    // Player: {
    //   schema: {
    //     level: 'uint8',
    //     name: 'string',
    //   }
    // },
    // Location: {
    //   schema: {
    //     coord: 'uint256',
    //     agent: 'bytes32',
    //   }
    // },


  },

  modules: [
    {
      name: 'UniqueEntityModule',
      root: true,
      args: [],
    },
    // {
    //   name: 'KeysWithValueModule',
    //   root: true,
    //   args: [resolveTableId('Position')],
    // },
  ],

});
