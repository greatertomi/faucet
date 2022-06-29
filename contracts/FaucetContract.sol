// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {

  // This is called when you make a transaction that doesn't specify function to call.
  // External functions are part of the public interface of the contract.
  // They can be called by via contracts and other transactions.
  receive() external payable {}

}
