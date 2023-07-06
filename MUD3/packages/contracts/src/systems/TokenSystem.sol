// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Token } from "../codegen/tables/Token.sol";
import { ChamberBridge } from "../utils/ChamberBridge.sol";
import { Crawl } from "../utils/Crawl.sol";

contract TokenSystem is System {
  
  // Bridge setters
  function setTokenIdToCoord(uint32 tokenId, uint256 coord) public {
    Token.set(tokenId, coord);
  }
  
}
