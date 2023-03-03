// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/SeniorPool.sol";

contract MockOpportunityPoolV1 {
    uint256 nextRepayment;
    uint256 seniorTotalDepositable;
    uint256 seniorProfit;
    uint256 seniorPoolWithdrawableAmount;

    function setNextRepaymentTime(uint256 _nextRepayment) external {
        nextRepayment = _nextRepayment;
    }

    function setSeniorTotalDepositable(
        uint256 _seniorTotalDepositable
    ) external {
        seniorTotalDepositable = _seniorTotalDepositable;
    }

    function setSeniorProfit(uint _seniorProfit) external {
        seniorProfit = _seniorProfit;
    }

    function nextRepaymentTime() external view returns (uint256) {
        return nextRepayment;
    }

    function getSeniorTotalDepositable() external view returns (uint256) {
        return seniorTotalDepositable;
    }

    function deposit(uint8 _subpoolId, uint256 amount) external {}

    function writeOffOpportunity() external {}

    function toCheckwithDrawFromOpportunity(
        bool _isWriteOff,
        bytes32 opportunityId,
        uint256 _amount,
        address _seniorPoolAddress
    ) external {
        SeniorPool seniorPool = SeniorPool(_seniorPoolAddress);
        seniorPool.withDrawFromOpportunity(_isWriteOff, opportunityId, _amount);
    }

    function setSeniorPoolWithdrawableAmount(
        uint256 _seniorPoolWithdrawableAmount
    ) external {
        seniorPoolWithdrawableAmount = _seniorPoolWithdrawableAmount;
    }

    function getSeniorPoolWithdrawableAmount() external view returns (uint256) {
        return seniorPoolWithdrawableAmount;
    }

    function getSeniorProfit() external view returns (uint256) {
        return seniorProfit;
    }
}
