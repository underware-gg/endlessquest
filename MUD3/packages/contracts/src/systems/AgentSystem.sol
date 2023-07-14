// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import {
  Agent, AgentData,
  Position,
  Blocker
} from "../codegen/Tables.sol";

contract AgentSystem is System {
  function setAgent(
    uint256 coord,
    uint256 seed,
    uint32 tokenId,
    uint8 yonder,
    uint8 terrain,
    uint8 gemType,
    uint16 coins,
    uint16 worth,
    int32 gridX,
    int32 gridY
  ) public {
    bytes32 key = getUniqueEntity();
    Agent.set(key,
      AgentData({
        coord: coord,
        tokenId: tokenId,
        seed: seed,
        yonder: yonder,
        terrain: terrain,
        gemType: gemType,
        coins: coins,
        worth: worth
      })
    );
    Blocker.set(key, true);
    Position.set(key, gridX, gridY);
  }
}
