// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Chamber } from "../codegen/Tables.sol";
import { Crawl } from "../utils/Crawl.sol";
import { ChamberBridge } from "../utils/ChamberBridge.sol";

contract ChamberSystem is System {
  function tokenURI(uint256 coord) public returns (string memory) {
    return "nothing yet";
  }
}
