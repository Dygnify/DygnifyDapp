// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../interfaces/IInvestor.sol";
import "../protocol/SeniorPool.sol";

contract MockOpportunityPool {
    uint256 nextRepayment;
    uint256 seniorTotalDepositable;
    uint256 seniorProfit;
    uint256 seniorPoolWithdrawableAmount;

    function isStaking(address /* _investor */) external pure returns (bool) {
        return true;
    }

    // Have to call Investor in context of OpportunityPool
    // It is necessary for test
    function addOpportunity(
        address investorAddress,
        address _investor,
        bytes32 _id
    ) external {
        IInvestor Investor = IInvestor(investorAddress);
        Investor.addOpportunity(_investor, _id);
    }

    function removeOpportunity(
        address investorAddress,
        address _investor,
        bytes32 _id
    ) external {
        IInvestor Investor = IInvestor(investorAddress);
        Investor.removeOpportunity(_investor, _id);
    }

    function getOpportunityOfInvestor(
        address investorAddress,
        address _investor
    ) external view returns (bytes32[] memory) {
        IInvestor Investor = IInvestor(investorAddress);
        return Investor.getOpportunityOfInvestor(_investor);
    }

    function isExistInInvestor(
        address investorAddress,
        address _investor,
        bytes32 _id
    ) public view returns (bool) {
        IInvestor Investor = IInvestor(investorAddress);
        return Investor.isExistInInvestor(_investor, _id);
    }

    function increaseNextRepaymentTime(uint256 _nextRepayment) external {
        nextRepayment = block.timestamp + _nextRepayment;
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

    function repayment(
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
