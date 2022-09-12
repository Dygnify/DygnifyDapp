// // SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IDygnifyConfig {

    function setAddress(uint256 addressIndex, address newAddress) external;

    function getAddress(uint256 addressIndex) external view returns (address);

    function setNumber(uint256 id, uint256 newNumber) external;

    function getNumber(uint256 id) external view returns (uint256);

    function setFlag(bytes32 id, bool isflag) external;

    function getFlag(bytes32 id) external view returns (bool);
}