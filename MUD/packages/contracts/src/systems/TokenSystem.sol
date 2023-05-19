// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Token } from "../codegen/tables/Token.sol";
import { ChamberBridge } from "../utils/ChamberBridge.sol";
import { Crawl } from "../utils/Crawl.sol";

contract TokenSystem is System {
  function tokenIdToCoord(uint256 tokenId) public returns (uint256) {
    uint256 coord = Token.get(tokenId);
    if(coord == 0) {
      coord = tokenId == 0 ? 0 : 1000 + tokenId;
      Token.set(tokenId, coord);
    }
    // Token.set(tokenId, 777);
    return coord;
  }
}
