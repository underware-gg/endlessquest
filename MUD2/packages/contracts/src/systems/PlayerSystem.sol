// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
  Player, PlayerData,
  PositionTableId,
  Position, PositionData,
  Health, HealthData,
  Strength,
  Tiles, TilesData
 } from "../codegen/Tables.sol";

import { addressToEntity } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { Direction } from "../codegen/Types.sol";

contract PlayerSystem is System {
  function spawn(string memory name, int32 x, int32 y) public {
    bytes32 player = addressToEntity(_msgSender());

    PlayerData memory existingPlayer = Player.get(player);
    require(existingPlayer.level == 0, "player already spawned");

    // bytes32[] memory playersAtPosition = getKeysWithValue(PositionTableId, Position.encode(x, y));
    // require(playersAtPosition.length == 0, "spawn location occupied");
    
    Player.set(player, 1, name);
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

    // check if there is a tile and it is not 0
    bool isTile = false;
    bytes32 otherPlayerKey = 0;
    bytes32[] memory thingsAtPosition = getKeysWithValue(PositionTableId, Position.encode(x, y));
    for(uint256 i = 0 ; i < thingsAtPosition.length; ++i) {
      TilesData memory tile = Tiles.get(thingsAtPosition[i]);
      if (tile.terrain > 0) {
        isTile = true;
        require(tile.tileType != 0, "blocking");
      }
      PlayerData memory otherPlayer = Player.get(thingsAtPosition[i]);
      if (otherPlayer.level > 0) {
        otherPlayerKey = thingsAtPosition[i];
      }
    }
    require(isTile, "no tile at destination");

    if(otherPlayerKey == 0) {
      Position.set(player, x, y);
    } else {
        int32 myStrength = Strength.get(player);
        HealthData memory otherPlayerHealth = Health.get(otherPlayerKey);
        int32 newHealth = otherPlayerHealth.current - myStrength;

        if(newHealth <= 0) {
          Health.deleteRecord(otherPlayerKey);
          Position.deleteRecord(otherPlayerKey);
          Strength.deleteRecord(otherPlayerKey);
        } else {
          Health.setCurrent(otherPlayerKey  , newHealth);
        }
    }
  }
}
