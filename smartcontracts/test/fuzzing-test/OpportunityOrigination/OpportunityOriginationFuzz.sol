// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/OpportunityOrigination.sol";
import "../../../contracts/interfaces/IOpportunityOrigination.sol";

contract OpportunityOriginationFuzz {
    function echidna_test_createOpportunity() public view returns (bool) {
        address OpportunityOriginationContractAddr = 0x1D7022f5B17d2F8B695918FB48fa1089C9f85401;

        address borrowerAddr = 0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84;

        OpportunityOrigination opportunityOrigination = OpportunityOrigination(
            OpportunityOriginationContractAddr
        );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        bool isOpportunity = opportunityOrigination.isOpportunity(id);
        uint opportunityIds = opportunityOrigination.getTotalOpportunities();

        return isOpportunity && opportunityIds == 1;
    }

    function echidna_test_assignUnderwriters() public view returns (bool) {
        address OpportunityOriginationContractAddr = 0x8Ea76477CfACa8F7Ea06477fD3c09a740ac6012a;

        address borrowerAddr = 0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84;

        OpportunityOrigination opportunityOrigination = OpportunityOrigination(
            OpportunityOriginationContractAddr
        );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        bytes32[] memory opportunities = opportunityOrigination
            .getOpportunityOf(borrowerAddr);

        return opportunities[0] == id;
    }

    function echidna_test_voteOpportunity() public view returns (bool) {
        address OpportunityOriginationContractAddr = 0x7209185959D7227FB77274e1e88151D7C4c368D3;

        address underwriter = 0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb;
        address borrowerAddr = 0x5409ED021D9299bf6814279A6A1411A7e866A631;

        OpportunityOrigination opportunityOrigination = OpportunityOrigination(
            OpportunityOriginationContractAddr
        );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        bytes32[] memory opportunities = opportunityOrigination
            .getOpportunityOf(borrowerAddr);

        return opportunities[0] == id;
    }
}
