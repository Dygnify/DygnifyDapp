// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/SeniorPool.sol";
import "../protocol/old/TestUSDCToken.sol";

contract MockSeniorPool {
    SeniorPool seniorPool;
    TestUSDCToken uSDCTestToken;

    constructor(
        address seniorPoolContractAddress,
        address usdcContractAddress
    ) {
        seniorPool = SeniorPool(seniorPoolContractAddress);
        uSDCTestToken = TestUSDCToken(usdcContractAddress);
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
