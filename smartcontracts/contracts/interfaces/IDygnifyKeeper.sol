// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface IDygnifyKeeper {

    function addOpportunityInKeeper(bytes32 _id) external;

    function removeOpportunityInKeeper(bytes32 _id) external; 
}
