//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@rari-capital/solmate/src/tokens/ERC721.sol";
import "hardhat/console.sol";

abstract contract ReverseRecords {
  function getNames(address[] calldata addresses) external view virtual returns (string[] memory r);
}

contract SyntheticPunks is ERC721 {

  // TODO: Check if constants are cheaper
  // TODO: Attributes csv IPFS content hash
  string public spritesheetImageData;
  uint256[4][9] public spritesheetRanges;
  uint256 public claimPrice = 0.02 ether;
  address public withdrawAddress;
  address ensReverseAddress;

  mapping(address => bool) public claimed;

  enum Gender { Male, Female }

  constructor(
    string memory _name, 
    string memory _symbol, 
    string memory _spritesheetImageData, 
    uint256[4][9] memory _spritesheetRanges,
    address _withdrawAddress,
    address _ensReverseAddress
  ) ERC721(_name, _symbol) {
    spritesheetImageData = _spritesheetImageData;
    spritesheetRanges = _spritesheetRanges;
    withdrawAddress = _withdrawAddress;
    ensReverseAddress = _ensReverseAddress;
  }

  function claim() public payable {
    require(msg.value >= claimPrice, "Insufficient payment");
    _safeMint(msg.sender, uint256(uint160(msg.sender)));
    claimed[msg.sender] = true;
    uint256 refund = msg.value - claimPrice;
    if (refund > 0) {
      payable(msg.sender).transfer(refund);
    }
  }

  function withdraw() public {
    payable(withdrawAddress).transfer(address(this).balance);
  }

  function _tokenURI(address _address) public view returns (string memory) {
    return tokenURI(getTokenID(_address));
  }

  function getTokenID(address _address) public pure returns (uint256) {
    return uint256(uint160(_address));
  }

  function getAddress(uint256 id) public pure returns (address) {
    return address(uint160(id));
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
    uint256[] memory layers = getAttributes(id);
    string memory punkSVG = generatePunkSVG(layers);

    address userAddress = getAddress(id);
    string memory ensName = reverseName(userAddress);  
    string memory addressOrENS = bytes(ensName).length == 0 ? toString(userAddress) : ensName;
    
    string memory json = base64(bytes(abi.encodePacked('{"name": "', 'Synthetic CryptoPunk for ', addressOrENS, '", "description": "This is a unique Punk claimed by ', addressOrENS,'.", "image": "data:image/svg+xml;base64,', base64(bytes(punkSVG)), '"}')));

    return string(abi.encodePacked('data:application/json;base64,', json));
  }

  // Entropy 0
  function getGender(uint256 id) public view returns (Gender) {
    return randomUint(id, 0) % 2 == 0 ? Gender.Male : Gender.Female;
  }

  // Entropy 1,2-9
  function getAttributeCategories(uint256 id) public view returns (uint256[] memory) {
    uint256 checks = 2 + randomUint(id, 1) % (spritesheetRanges.length - 3); // Number of bytes to check
    uint256[] memory attributes = new uint256[](checks); // TODO: Check at least 1 attribute
    uint256 length = 0;
    console.log(checks);
    for (uint256 i; i < checks; i++) {
      uint256 newAttribute = randomUint(id, 2+i) % (spritesheetRanges.length - 2) + 1; // Skip base category
      
      bool added = contains(attributes, newAttribute);

      if (added) {
        continue;
      }

      uint lengthBefore = length;

      if (getGender(id) == Gender.Female) {
        if (!(spritesheetRanges[newAttribute][3] - spritesheetRanges[newAttribute][1] == 0)) {
          attributes[length] = newAttribute;
          length++;
          console.log("added", newAttribute);
        }
      } else {
        if (!(spritesheetRanges[newAttribute][2] - spritesheetRanges[newAttribute][0] == 0)) {
          attributes[length] = newAttribute;
          length++;
          console.log("added", newAttribute);
        }
      }

      if (lengthBefore == length) {
        console.log("skipped", newAttribute);
      }
    }
    uint256[] memory attributesResized = new uint256[](length+1);
    attributesResized[0] = 0;
    for (uint256 i; i < length; i++) {
      attributesResized[i+1] = attributes[i];
    }

    return attributesResized;
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

  function _getAttributes(address _address) public view returns (uint256[] memory) {
    return getAttributes(getTokenID(_address));
  }

  function getAttributes(uint256 id) public view returns (uint256[] memory) {
    uint256[] memory attributeCategories = getAttributeCategories(id);
    uint256[] memory layers = new uint256[](attributeCategories.length);
    for (uint256 i = 0; i < attributeCategories.length; i++) {
      layers[i] = getAttribute(id, attributeCategories[i]);
      // console.log(layers[i]);
    }
    return layers;
  }

  function generatePunkSVG(uint256[] memory layers) public view returns (string memory) {
    string memory start1 = '<svg viewBox="0 0 24 24" width="1000" xmlns="http://www.w3.org/2000/svg" ><defs><style>#spritesheet { image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated; } #punk { filter: drop-shadow(0px 0px 50px rgb(0, 255, 166, 0.7)); } svg { background : #6A9480; }</style><svg width="24" height="24" viewBox="48 0 24 24"><image id="spritesheet" preserveAspectRatio="xMinYMin slice" href="';
    string memory start3 = '"></image></svg></defs><svg id="punk">';
    string memory end = '</svg></svg>';
    string memory layersSVG = '';

    // Render in order
    for (uint256 i = 0; i < spritesheetRanges.length; i++) {
      for (uint256 j = 0; j < layers.length; j++) {
        if (spritesheetRanges[i][0] <= layers[j] && layers[j] < spritesheetRanges[i][3]) { // if layer is in range
          // console.log(layers[j]);
          uint256 id = layers[j];
          uint256 x = (id % 25) * 24;
          uint256 y = (id / 25) * 24;
          layersSVG = string(abi.encodePacked(layersSVG, '<svg width="24" height="24" viewBox="', toString(x), ' ', toString(y), ' 24 24"><use href="#spritesheet"></use></svg>'));
          break;
        }
      }
    }

    return string(abi.encodePacked(start1, spritesheetImageData, start3, layersSVG, end)) ;
  }
  
  function reverseName(address _address) internal view returns (string memory name) {
    if (address(0) == ensReverseAddress) {
      return name;
    }
    ReverseRecords ens = ReverseRecords(ensReverseAddress);
    address[] memory t = new address[](1);
    t[0] = _address;
    name = ens.getNames(t)[0];
  }

  function contains(uint256[] memory arr, uint256 element) internal pure returns (bool) {
    for (uint256 i = 0; i < arr.length; i++) {
      if (arr[i] == element) {
        return true;
      }
    }
    return false;
  }

  function randomUint(uint256 seed, uint256 offset) public view returns (uint256) {
    require(offset < 32, "Offset out of bounds");
    bytes32 entropy = keccak256(abi.encodePacked(address(this), seed)); // TODO: Consider not including address in entropy
    bytes32 mask = bytes32(0xff << (offset * 8));
    uint256 out = uint256((entropy & mask) >> (offset * 8));
    return out;
  }

  function toString(address account) public pure returns(string memory) {
    return toString(abi.encodePacked(account));
  }

  // function toString(uint256 value) public pure returns(string memory) {
  //   return toString(abi.encodePacked(value));
  // }

  function toString(bytes32 value) public pure returns(string memory) {
    return toString(abi.encodePacked(value));
  }

  function toString(bytes memory data) public pure returns(string memory) {
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(2 + data.length * 2);
    str[0] = "0";
    str[1] = "x";
    for (uint i = 0; i < data.length; i++) {
        str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
        str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
    }
    return string(str);
  }

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