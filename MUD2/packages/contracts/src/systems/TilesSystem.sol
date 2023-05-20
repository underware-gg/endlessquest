// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { Tiles, Position } from "../codegen/Tables.sol";
// import { Crawl } from "../utils/Crawl.sol";

contract TilesSystem is System {

  // Bridge setters
  function setTile(
    uint8 terrain,
    uint8 tileType,
    bool isEntry,
    int32 gridX,
    int32 gridY
  ) public {
    bytes32 key = getUniqueEntity();
    Tiles.set(key,
      terrain,
      tileType,
      isEntry
    );
    Position.set(key,
      gridX,
      gridY
    );
  }
}
