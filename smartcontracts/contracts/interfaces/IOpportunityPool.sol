// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "../protocol/DygnifyConfig.sol";

interface IOpportunityPool {

    function initialize(
        DygnifyConfig _dygnifyConfig,
        bytes32 _opportunityID,
        string memory _opportunityInfo,
        uint8 _loanType,
        uint _loanAmount,
        uint _loanTenureInDays,
        uint _loanInterest,
        uint _paymentFrequencyInDays,
        string memory _collateralDocument,
        uint _capitalLoss
    ) external ;
}

