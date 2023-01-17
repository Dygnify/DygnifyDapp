// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/SeniorPool.sol";
import "./USDCTestToken.sol";

contract MockSeniorPool {
    SeniorPool seniorPool;
    USDCTestToken uSDCTestToken;

    constructor(
        address seniorPoolContractAddress,
        address usdcContractAddress
    ) {
        seniorPool = SeniorPool(seniorPoolContractAddress);
        uSDCTestToken = USDCTestToken(usdcContractAddress);
    }

    function approveUSDC(uint amount) internal {
        uSDCTestToken.approve(address(seniorPool), amount);
    }

    function stake(uint256 amount) external {
        approveUSDC(amount);
        seniorPool.stake(amount);
    }

    function withdrawWithLP(uint256 amount) external {
        seniorPool.withdrawWithLP(amount);
    }
}
