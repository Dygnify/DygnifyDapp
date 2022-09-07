// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IInvestor {

    function addOpportunity(address _investor, bytes32 _id) external;
    
    function removeOpportunity(address _investor, bytes32 _id) external;

    function getOpportunityOfInvestor(address _investor)external view returns(bytes32[] memory);

    function isExistInInvestor(address _investor, bytes32 _id)external view returns(bool);
}
