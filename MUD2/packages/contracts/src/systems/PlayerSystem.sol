// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
  Player, PlayerData,
  Position, PositionData, PositionTableId,
  Tile, TileData,
  Agent, AgentData,
  Location,
  Blocker
 } from "../codegen/Tables.sol";

import { addressToEntity } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { Direction } from "../codegen/Types.sol";
import { Crawl } from "../utils/Crawl.sol";

contract PlayerSystem is System {
  function spawnAtPosition(string memory name, int32 x, int32 y) public {
    bytes32 player = addressToEntity(_msgSender());

    PlayerData memory existingPlayer = Player.get(player);
    require(existingPlayer.level == 0, "player already spawned");

    // bytes32[] memory playersAtPosition = getKeysWithValue(PositionTableId, Position.encode(x, y));
    // require(playersAtPosition.length == 0, "spawn location occupied");
    
    Player.set(player, 1, name);
    Blocker.set(player, true);
    moveToPosition(x, y);
  }

  function moveToDirection(Direction direction) public {
    require(direction != Direction.Unknown, "invalid direction");

    bytes32 player = addressToEntity(_msgSender());

    PlayerData memory existingPlayer = Player.get(player);
    require(existingPlayer.level > 0, "player not spawned");

    PositionData memory position = Position.get(player);

    int32 x = position.x;
    int32 y = position.y;

    if (direction == Direction.Up) {
      y -= 1;
    } else if (direction == Direction.Down) {
      y += 1;
    } else if (direction == Direction.Left) {
      x -= 1;
    } else if (direction == Direction.Right) {
      x += 1;
    }

    moveToPosition(x, y);
  }

  function moveToPosition(int32 x, int32 y) public {
    bytes32 player = addressToEntity(_msgSender());

    // check if there is a tile and it is not 0
    bool isOverTile = false;
    bytes32[] memory thingsAtPosition = getKeysWithValue(PositionTableId, Position.encode(x, y));
    for(uint256 i = 0 ; i < thingsAtPosition.length; ++i) {
      //
      // Find Blockers at position
      bool blocker = Blocker.get(thingsAtPosition[i]);
      require(blocker == false, "--- BLOCKER! ---");
      //
      // Find Tile at position
      TileData memory tile = Tile.get(thingsAtPosition[i]);
      if (tile.terrain > 0) {
        isOverTile = true;
      }
    }
    require(isOverTile, "--- OUT OF BOUNDS! ---");

    Position.set(player, x, y);

    int256 north = (y < 0) ? int256((-y -1) / 20) + 1 : int256(0);
    int256 south = (y >= 0) ? int256(y / 20) + 1 : int256(0);
    int256 west = (x < 0) ? int256((-x -1) / 20) + 1 : int256(0);
    int256 east = (x >= 0) ? int256(x / 20) + 1 : int256(0);
    uint256 coord = Crawl.makeCoord(uint256(north), uint256(east), uint256(west), uint256(south));

    // Find agent close by!
    bytes32 agent = findAgentAtPosition(x - 1, y);
    if (agent == 0) agent = findAgentAtPosition(x + 1, y);
    if (agent == 0) agent = findAgentAtPosition(x, y - 1);
    if (agent == 0) agent = findAgentAtPosition(x, y + 1);
    Location.set(player, coord, agent);
  }

  function findAgentAtPosition(int32 x, int32 y) private view returns (bytes32) {
    bytes32[] memory thingsAtPosition = getKeysWithValue(PositionTableId, Position.encode(x, y));
    for(uint256 i = 0 ; i < thingsAtPosition.length; ++i) {
      AgentData memory agent = Agent.get(thingsAtPosition[i]);
      if (agent.coord > 0) {
        return thingsAtPosition[i];
      }
    }
    return 0;
  }

}
