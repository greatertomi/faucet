// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
  address[] public funders;
  // This is called when you make a transaction that doesn't specify function to call.
  // External functions are part of the public interface of the contract.
  // They can be called by via contracts and other transactions.
  receive() external payable {}

  function addFunds() external payable {
    funders.push(msg.sender);
  }

  function getAllFunders() public view returns (address[] memory) {
    return funders;
  }
}

// const instance = await Faucet.deployed()
