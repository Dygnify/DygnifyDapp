// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract MockOpportunityOrigination {
    address poolAddress;

    constructor(address _poolAddress) {
        poolAddress = _poolAddress;
    }

    function getOpportunityPoolAddress(
        bytes32 id
    ) external view returns (address) {
        return poolAddress;
    }
}
