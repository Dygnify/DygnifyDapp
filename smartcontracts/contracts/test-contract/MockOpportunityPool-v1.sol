// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/DygnifyConfig.sol";
import "hardhat/console.sol";

interface OP {
    function nextRepaymentTime() external view returns (uint256);
}

contract MockOpportunityPoolV1 {
    function getYourAddress() external view returns (address) {
        return address(this);
    }

    function nextRepaymentTime() external pure returns (uint256) {
        return 8640000;
    }

    function getSeniorTotalDepositable() external pure returns (uint256) {
        return 1000000;
    }

    function deposit(uint8 _subpoolId, uint256 amount) external {}
}
