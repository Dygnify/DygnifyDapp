// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./BaseUpgradeablePausable.sol";
import "./ConfigHelper.sol";

contract DygnifyConfig is BaseUpgradeablePausable{
    mapping(uint256 => address) public addresses;

    using ConfigHelper for DygnifyConfig;

    function _dygnifyConfig_init(address _owner) public initializer {
        _BaseUpgradeablePausable_init(_owner);
    }

    function setAddress(uint256 addressIndex, address newAddress)public nonReentrant whenNotPaused onlyAdmin{
        require(address(newAddress) != address(0), "Invalid Address");
        addresses[addressIndex] = newAddress; 
    }

    function getAddress(uint256 addressIndex)public view returns(address){
        return addresses[addressIndex];
    }
}