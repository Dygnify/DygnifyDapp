// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/Investor.sol";

contract InvestorFuzz {
    Investor investor;

    function echidna_test_addOpportunity() public returns (bool) {
        investor = Investor(0x25B8Fe1DE9dAf8BA351890744FF28cf7dFa8f5e3);
        bytes32[] memory opportunities = investor.getOpportunityOfInvestor(
            0x5409ED021D9299bf6814279A6A1411A7e866A631
        );

        return opportunities[0] == keccak256("id1");
    }

    function echidna_test_removeOpportunity() public returns (bool) {
        investor = Investor(0x10aDd991dE718a69DeC2117cB6aA28098836511B);
        bytes32[] memory opportunities = investor.getOpportunityOfInvestor(
            0x5409ED021D9299bf6814279A6A1411A7e866A631
        );

        return opportunities[0] == bytes32(0);
    }

    function echidna_test_getOpportunityOfInvestor() public returns (bool) {
        investor = Investor(0x04B5dAdd2c0D6a261bfafBc964E0cAc48585dEF3);
        bytes32[] memory opportunities = investor.getOpportunityOfInvestor(
            0x5409ED021D9299bf6814279A6A1411A7e866A631
        );

        return opportunities[0] == keccak256("id1");
    }

    function echidna_test_isExistInInvestor() public returns (bool) {
        investor = Investor(0x8Ea76477CfACa8F7Ea06477fD3c09a740ac6012a);

        return
            investor.isExistInInvestor(
                0x5409ED021D9299bf6814279A6A1411A7e866A631,
                keccak256("id1")
            );
    }
}
