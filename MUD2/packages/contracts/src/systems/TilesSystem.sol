// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { Tiles, TilesData } from "../codegen/Tables.sol";
// import { Crawl } from "../utils/Crawl.sol";

contract TilesSystem is System {

  // Bridge setters
  function setTile(
    // uint256 coord,
    // uint8 index,
    uint8 terrain,
    uint8 tileType,
    // uint8 tileX,
    // uint8 tileY,
    uint8 gridX,
    uint8 gridY
  ) public {
    bytes32 key = getUniqueEntity();
    Tiles.set(key,
      TilesData({
        // coord: coord,
        // index: index,
        terrain: terrain,
        tileType: tileType,
        // tileX: tileX,
        // tileY: tileY,
        gridX: gridX,
        gridY: gridY
      })
    );
  }
}
