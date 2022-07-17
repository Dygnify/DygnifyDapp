// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOpportunityPool {

    function initialize(
        address _dygnifyConfig,
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

