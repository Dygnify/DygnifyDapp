// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../interfaces/IInvestor.sol";

contract MockOpportunityPool {
    function isStaking(address _investor) external view returns (bool) {
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
}
