// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "../protocol/DygnifyConfig.sol";

interface IOpportunityPool {
    enum Subpool {
        JuniorSubpool,
        SeniorSubpool
    }

    struct SubpoolDetails {
        uint256 id;
        uint256 totalDepositable;
        uint256 depositedAmount;
        bool isPoolLocked;
        uint256 fundsLockedUntil;
        uint256 yieldGenerated;
        uint256 overdueGenerated;
    }

    function isStaking(address _investor) external view returns(bool);

    function initialize(
        DygnifyConfig _dygnifyConfig,
        bytes32 _opportunityID,
        uint256 _loanAmount,
        uint256 _loanTenureInDays,
        uint256 _loanInterest,
        uint256 _paymentFrequencyInDays,
        uint8 _loanType
    ) external;

    function deposit(uint8 _subpoolId, uint256 amount) external;

    function withdraw(uint8 _subpoolId, uint256 amount) external;

    function drawdown() external;

    function repayment() external;

    function withdrawAll(uint8 _subpoolId) external returns (uint256);

    function getUserWithdrawableAmount() external view returns (uint256);

    function getRepaymentAmount() external view returns (uint256);

    function getYieldPercentage() external view returns (uint256, uint256);

    function getOverDuePercentage() external view returns (uint256, uint256);

    function nextRepaymentTime() external view returns (uint256);

    function getSeniorTotalDepositable() external view returns (uint256);

    function getSeniorProfit() external view returns (uint256);

    function getOpportunityName()external view returns(string memory);

    function writeOffOpportunity() external;

    function getSeniorPoolWithdrawableAmount()external returns(uint256);
}


