//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
// import "hardhat/console.sol";

contract SyntheticPunks is ERC721 {

  string public spritesheetImageData;
  uint256[4][9] public spritesheetRanges;

  enum Gender { Male, Female }

  constructor(
    string memory _name, 
    string memory _symbol, 
    string memory _spritesheetImageData, 
    uint256[4][9] memory _spritesheetRanges
  ) ERC721(_name, _symbol) {
    spritesheetImageData = _spritesheetImageData;
    spritesheetRanges = _spritesheetRanges;
  }

  function _tokenURI(address _address) public view returns (string memory) {
    return tokenURI(tokenID(_address));
  }

  function tokenID(address _address) public pure returns (uint256) {
    return uint256(uint160(_address));
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
    uint256[] memory attributeCategories = getAttributeCategories(id);
    uint256[] memory layers = new uint256[](attributeCategories.length);
    for (uint256 i = 0; i < attributeCategories.length; i++) {
      layers[i] = getAttribute(id, attributeCategories[i]);
      // console.log(layers[i]);
    }

    string memory punkSVG = generatePunkSVG(layers);

    string memory json = base64(bytes(abi.encodePacked('{"name": "Synthetic CryptoPunk #', toString(id), '", "description": "This is a unique Punk associated with your wallet.", "image": "data:image/svg+xml;base64,', base64(bytes(punkSVG)), '"}')));

    return string(abi.encodePacked('data:application/json;base64,', json));
  }

  // Entropy 0
  function getGender(uint256 id) public view returns (Gender) {
    return randomUint(id, 0) % 2 == 0 ? Gender.Male : Gender.Female;
  }

  // Entropy 1,2-9
  function getAttributeCategories(uint256 id) public view returns (uint256[] memory) {
    uint256 checks = randomUint(id, 1) % (spritesheetRanges.length - 1); // Number of bytes to check
    uint256[] memory attributes = new uint256[](checks);
    uint256 length = 0;
    for (uint256 i; i < checks; i++) {
      uint256 newAttribute = randomUint(id, 2+i) % (spritesheetRanges.length - 2) + 1; // Skip base category
      bool exists = contains(attributes, newAttribute);
      if (!exists) {
        if (getGender(id) == Gender.Female) {
          if (!(spritesheetRanges[newAttribute][3] - spritesheetRanges[newAttribute][1] == 0)) {
            attributes[length] = newAttribute;
            length++;
          }
        } else {
          if (!(spritesheetRanges[newAttribute][2] - spritesheetRanges[newAttribute][0] == 0)) {
            attributes[length] = newAttribute;
            length++;
          }
        }
      }
    }
    uint256[] memory attributesResized = new uint256[](length+1);
    attributesResized[0] = 0;
    for (uint256 i; i < length; i++) {
      attributesResized[i+1] = attributes[i];
    }

    return attributesResized;
  }

  function contains(uint256[] memory arr, uint256 element) public pure returns (bool) {
    for (uint256 i = 0; i < arr.length; i++) {
      if (arr[i] == element) {
        return true;
      }
    }
    return false;
  }

  // Entropy 10
  function getAttribute(uint256 id, uint256 _attributeId) public view returns (uint256) {
    uint256[4] memory ranges = spritesheetRanges[_attributeId];
    Gender gender = getGender(id);
    if (gender == Gender.Female) {
      return ranges[1] + randomUint(id, 10+_attributeId) % (ranges[3] - ranges[1]);
    } else {
      return ranges[0] + randomUint(id, 10+_attributeId) % (ranges[2] - ranges[0]);
    }
  }

  function generatePunkSVG(uint256[] memory layers) public pure returns (string memory) {
    string memory start = '<svg viewBox="0 0 24 24" width="1000" xmlns="http://www.w3.org/2000/svg" ><defs><style>#spritesheet { image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated; }</style><svg width="24" height="24" viewBox="48 0 24 24"><image id="spritesheet" preserveAspectRatio="xMinYMin slice" href="data:image/png;charset:utf-8;base64,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"></image></svg></defs>';
    string memory end = '</svg>';
    string memory layersSVG = '';
    for (uint256 i = 0; i < layers.length; i++) {
      uint256 id = layers[i];
      uint256 x = (id % 25) * 24;
      uint256 y = (id / 25) * 24;
      layersSVG = string(abi.encodePacked(layersSVG, '<svg width="24" height="24" viewBox="', toString(x), ' ', toString(y), ' 24 24"><use href="#spritesheet"></use></svg>'));
    }

    return string(abi.encodePacked(start, layersSVG, end)) ;
  }

  function randomUint(uint256 seed, uint256 offset) public view returns (uint256) {
    require(offset < 32, "Offset out of bounds");
    bytes32 entropy = keccak256(abi.encodePacked(address(this), seed)); // TODO: Could declare this once and pass as param to save gas
    bytes32 mask = bytes32(0xff << (offset * 8));
    uint256 out = uint256((entropy & mask) >> (offset * 8));
    return out;
  }

  /// @dev Converts a `uint256` value to a string.
  /// @param n The integer to convert.
  /// @return nstr `n` as a decimal string.
  /// Source: https://github.com/mzhu25/sol2string
  function toString(uint256 n) 
    internal 
    pure 
    returns (string memory nstr) 
  {
    uint256 MAX_UINT256_STRING_LENGTH = 78;
    uint8 ASCII_DIGIT_OFFSET = 48;
    if (n == 0) {
      return "0";
    }
    // Overallocate memory
    nstr = new string(MAX_UINT256_STRING_LENGTH);
    uint256 k = MAX_UINT256_STRING_LENGTH;
    // Populate string from right to left (lsb to msb).
    while (n != 0) {
      assembly {
        let char := add(
          ASCII_DIGIT_OFFSET,
          mod(n, 10)
        )
        mstore(add(nstr, k), char)
        k := sub(k, 1)
        n := div(n, 10)
      }
    }
    assembly {
        // Shift pointer over to actual start of string.
        nstr := add(nstr, k)
        // Store actual string length.
        mstore(nstr, sub(MAX_UINT256_STRING_LENGTH, k))
    }
    return nstr;
  }

  /// @notice Encodes some bytes to the base64 representation
  function base64(bytes memory data) internal pure returns (string memory) {
    bytes memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    uint256 len = data.length;
    if (len == 0) return "";

    // multiply by 4/3 rounded up
    uint256 encodedLen = 4 * ((len + 2) / 3);

    // Add some extra buffer at the end
    bytes memory result = new bytes(encodedLen + 32);

    bytes memory table = TABLE;

    assembly {
      let tablePtr := add(table, 1)
      let resultPtr := add(result, 32)

      for {
        let i := 0
      } lt(i, len) {

      } {
        i := add(i, 3)
        let input := and(mload(add(data, i)), 0xffffff)

        let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
        out := shl(8, out)
        out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
        out := shl(8, out)
        out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
        out := shl(8, out)
        out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
        out := shl(224, out)

        mstore(resultPtr, out)

        resultPtr := add(resultPtr, 4)
      }

      switch mod(len, 3)
      case 1 {
          mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
      }
      case 2 {
          mstore(sub(resultPtr, 1), shl(248, 0x3d))
      }

      mstore(result, encodedLen)
    }

    return string(result);
  }
}