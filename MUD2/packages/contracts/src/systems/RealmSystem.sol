// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {
  Realm,
  ChamberMetadata, ChamberMetadataData
} from "../codegen/Tables.sol";

contract RealmSystem is System {

  function setRealm(
    uint256 coord
  ) public {
    Realm.set(coord,
      _msgSender() // opener
    );
    ChamberMetadata.set(coord, ChamberMetadataData("", ""));
  }

  function setRealmMetadata(uint256 coord, string memory metadata) public {
    ChamberMetadataData memory data = ChamberMetadata.get(coord);
    data.metadata = metadata;
    ChamberMetadata.set(coord, data);
  }

  function setRealmProfileImage(uint256 coord, string memory url) public {
    ChamberMetadataData memory data = ChamberMetadata.get(coord);
    data.url = url;
    ChamberMetadata.set(coord, data);
  }
}
