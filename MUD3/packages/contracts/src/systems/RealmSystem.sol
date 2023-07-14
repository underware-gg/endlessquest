// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
  Realm
} from "../codegen/Tables.sol";

contract RealmSystem is System {

  function setRealm(
    uint256 coord
  ) public {
    Realm.set(coord,
      _msgSender() // opener
    );
  }
}
