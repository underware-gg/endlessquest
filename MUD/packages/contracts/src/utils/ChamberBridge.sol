//SPDX-License-Identifier: Unlicense
// This contracts runs on L1, and controls a Greeter on L2.
// The addresses are specific to Optimistic Goerli.
pragma solidity ^0.8.0;

// from:
// https://github.com/ethereum-optimism/optimism-tutorial/tree/main/cross-dom-comm
// https://github.com/ethereum-optimism/optimism-tutorial/blob/main/cross-dom-comm/hardhat/contracts/FromL2_ControlL1Greeter.sol
// https://github.com/ethereum-optimism/optimism/blob/develop/packages/contracts/contracts/libraries/bridge/ICrossDomainMessenger.sol

// import { ICrossDomainMessenger } from  "@eth-optimism/contracts/libraries/bridge/ICrossDomainMessenger.sol";

contract ChamberBridge {
  // // Taken from https://github.com/ethereum-optimism/optimism/tree/develop/packages/contracts/deployments/goerli#layer-2-contracts
  // address private crossDomainMessengerAddr = 0x4200000000000000000000000000000000000007;

  // address private tokenContractAddress = 0x8E70b94C57b0CBC9807c0F58Bc251f4cD96AcDb0;

  // function tokenIdToCoord(uint256 tokenId) public {
  //   bytes memory message;
  //   message = abi.encodeWithSignature("tokenIdToCoord(uint256)", tokenId);
  //   ICrossDomainMessenger(crossDomainMessengerAddr).sendMessage(
  //     tokenContractAddress,
  //     message,
  //     0 // gas limit
  //   );
  // }
}