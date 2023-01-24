// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/OpportunityPool.sol";
import "./UsdcToken.sol";

contract MockSeniorPoolForOpportunityPool {
    address opportunityPoolAddress;

    constructor(address _opportunityPoolAddress) {
        opportunityPoolAddress = _opportunityPoolAddress;
    }

    function initPool(
        DygnifyConfig _dygnifyConfig,
        bytes32 _opportunityID,
        uint256 _loanAmount,
        uint256 _loanTenureInDays,
        uint256 _loanInterest,
        uint256 _paymentFrequencyInDays,
        uint8 _loanType
    ) external {
        OpportunityPool opportunityPool = OpportunityPool(
            opportunityPoolAddress
        );
        opportunityPool.initialize(
            _dygnifyConfig,
            _opportunityID,
            _loanAmount,
            _loanTenureInDays,
            _loanInterest,
            _paymentFrequencyInDays,
            _loanType
        );
    }

    function deposit(uint8 _subpoolId, uint256 amount) external {
        OpportunityPool opportunityPool = OpportunityPool(
            opportunityPoolAddress
        );
        opportunityPool.deposit(_subpoolId, amount);
    }

    function setAllowance(
        address usdcAddress,
        address spender,
        uint256 amount
    ) external {
        UsdcToken usdcToken = UsdcToken(usdcAddress);
        usdcToken.approve(spender, amount);
    }

    function withDrawFromOpportunity(
        bool /* _isWriteOff */,
        bytes32 /* opportunityId */,
        uint256 /* _amount */
    ) external {}

    function withdrawAll(uint8 _subpoolId) external returns (uint256) {
        OpportunityPool opportunityPool = OpportunityPool(
            opportunityPoolAddress
        );
        uint amount = opportunityPool.withdrawAll(_subpoolId);
        return amount;
    }

    function getOpportunityName() external pure returns (string memory) {
        return "Opportunity1";
    }
}
