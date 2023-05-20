// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { Doors, DoorsData } from "../codegen/Tables.sol";
import { Crawl } from "../utils/Crawl.sol";

contract DoorsSystem is System {

  // Bridge setters
  function setDoor(
    uint256 coord,
    uint8 index,
    uint8 dir,
    bool locked
  ) public {
    bytes32 key = getUniqueEntity();
    Doors.set(key,
      DoorsData({
        coord: coord,
        index: index,
        dir: dir,
        locked: locked,
        nextCoord: Crawl.offsetCoord(coord, Crawl.Dir(dir))
      })
    );
  }
}
