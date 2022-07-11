// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
  uint public numOfFunders;
  mapping(address => bool) private funders;
  mapping(uint => address) private lutFunders;

  modifier limitWithdraw(uint withdrawAmount) {
    require(withdrawAmount <= 100000000000000000, "Cannot withdraw more than 0.1 ether");
    _;
  }

  // This is called when you make a transaction that doesn't specify function to call.
  // External functions are part of the public interface of the contract.
  // They can be called by via contracts and other transactions.
  receive() external payable {}

  function transferOwnership(address newOwner) external onlyOwner {
    owner = newOwner;
  }

  function emitLog() public override pure returns(bytes32) {
    return "Hello world!";
  }

  function addFunds() override external payable {
    address funder = msg.sender;

    if (!funders[funder]) {
      uint index = numOfFunders++;
      funders[funder] = true;
      lutFunders[index] = funder;
    }
  }

  function getAllFunders() public view returns (address[] memory) {
    address[] memory _funders = new address[](numOfFunders);
    for (uint i = 0; i < numOfFunders; i++) {
      _funders[i] = lutFunders[i];
    }
    return _funders;
  }

  function getFunderAtIndex(uint8 index) external view returns(address) {
    return lutFunders[index];
  }

  function withdraw(uint withdrawAmount) override external limitWithdraw (withdrawAmount){
    require(withdrawAmount <= 100000000000000000, "Cannot withdraw more than 0.1 ether");
    payable(msg.sender).transfer(withdrawAmount);
  }
}

// const instance = await Faucet.deployed()
// instance.addFunds({from: accounts[0], value: "2000000000000000000"})
// instance.withdraw("90000000000000000", {from: accounts[0]})
