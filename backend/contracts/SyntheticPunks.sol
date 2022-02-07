//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";

contract SyntheticPunks is ERC721 {
  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

  function tokenURI(uint256 id) public view override returns (string memory) {
    return "";
  }
}