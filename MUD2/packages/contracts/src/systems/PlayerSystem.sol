// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
  Position,
  PositionTableId,
  PositionData,
  Health,
  HealthData,
  Strength
 } from "../codegen/Tables.sol";

import { addressToEntity } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { Direction } from "../codegen/Types.sol";

contract PlayerSystem is System {
  function spawn(int32 x, int32 y) public {
    require(x != 0 || y != 0, "cannot spawn at 0 coord");
    bytes32 player = addressToEntity(_msgSender());
    PositionData memory existingPosition = Position.get(player);

    require(existingPosition.x == 0 && existingPosition.y == 0, "player already spawned");

    bytes32[] memory playersAtPosition = getKeysWithValue(PositionTableId, Position.encode(x, y));
    require(playersAtPosition.length == 0, "spawn location occupied");
    
    Position.set(player, x, y);
    Health.set(player, HealthData({
      max: 100,
      current: 100
    }));
    Strength.set(player, 25);
  }

  function move(Direction direction) public {
    require(direction != Direction.Unknown, "invalid direction");

    bytes32 player = addressToEntity(_msgSender());
    PositionData memory existingPosition = Position.get(player);

    require(existingPosition.x != 0 || existingPosition.y != 0, "player not spawned");

    int32 x = existingPosition.x;
    int32 y = existingPosition.y;

    if (direction == Direction.Up) {
      y -= 1;
    } else if (direction == Direction.Down) {
      y += 1;
    } else if (direction == Direction.Left) {
      x -= 1;
    } else if (direction == Direction.Right) {
      x += 1;
    }

    bytes32[] memory playersAtPosition = getKeysWithValue(PositionTableId, Position.encode(x, y));
    
    if(playersAtPosition.length == 0) {
      Position.set(player, x, y);
    } else {
        int32 myStrength = Strength.get(player);
        bytes32 otherPlayer = playersAtPosition[0];
        HealthData memory otherPlayerHealth = Health.get(otherPlayer);
        int32 newHealth = otherPlayerHealth.current - myStrength;

        if(newHealth <= 0) {
          Health.deleteRecord(otherPlayer);
          Position.deleteRecord(otherPlayer);
          Strength.deleteRecord(otherPlayer);
        } else {
          Health.setCurrent(otherPlayer, newHealth);
        }
    }
  }
}
