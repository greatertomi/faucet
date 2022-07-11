// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// INTERFACES INFO
// Interface cannot inherit from other smart contracts, they can only inherit from other interfaces
// They cannot declare constructors
// They cannot declare state variables
// all decalred functions have to be external

interface IFaucet {
  function addFunds() external payable;
  function withdraw(uint withdrawAmount) external;
}
