// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract MockInvestor {
    function isExistInInvestor(
        address /*_investor */,
        bytes32 /* _id */
    ) external pure returns (bool) {
        return true;
    }

    function addOpportunity(address /*_investor*/, bytes32 /*_id*/) external {}

    function removeOpportunity(
        address /*_investor*/,
        bytes32 /*_id*/
    ) external {}
}
