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
        address underwriterAddress = 0x5409ED021D9299bf6814279A6A1411A7e866A631;

        IOpportunityOrigination opportunityOrigination = IOpportunityOrigination(
                0x74341e87b1c4dB7D5ED95F92b37509F2525A7A90
            );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        bytes32[] memory underwriterOpportunities = opportunityOrigination
            .getUnderWritersOpportunities(underwriterAddress);

        return underwriterOpportunities[0] == id;
    }

    function echidna_test_voteOpportunityRejected() public view returns (bool) {
        IOpportunityOrigination opportunityOrigination = IOpportunityOrigination(
                0x99356167eDba8FBdC36959E3F5D0C43d1BA9c6DB
            );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        IOpportunityOrigination.Opportunity
            memory opportunity = opportunityOrigination.getOpportunity(id);

        return
            uint8(opportunity.opportunityStatus) ==
            uint8(IOpportunityOrigination.OpportunityStatus.Rejected);
    }

    function echidna_test_voteOpportunityApproved() public view returns (bool) {
        IOpportunityOrigination opportunityOrigination = IOpportunityOrigination(
                0x58f4Cae2b25D7EB4A7cd819408d8d3a959C0230c
            );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        IOpportunityOrigination.Opportunity
            memory opportunity = opportunityOrigination.getOpportunity(id);

        return
            uint8(opportunity.opportunityStatus) ==
            uint8(IOpportunityOrigination.OpportunityStatus.Active);
    }

    function echidna_test_voteOpportunityUnsure() public view returns (bool) {
        IOpportunityOrigination opportunityOrigination = IOpportunityOrigination(
                0xcBAe15A320F56Fc9ad6c8319D55Be1FeF0750070
            );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        IOpportunityOrigination.Opportunity
            memory opportunity = opportunityOrigination.getOpportunity(id);

        return
            uint8(opportunity.opportunityStatus) ==
            uint8(IOpportunityOrigination.OpportunityStatus.Unsure);
    }

    function echidna_test_markDrawDown() public view returns (bool) {
        IOpportunityOrigination opportunityOrigination = IOpportunityOrigination(
                0xbCE0B5F6eb618c565C3E5f5cd69652bbC279f44E
            );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        return opportunityOrigination.isDrawdown(id);
    }

    function echidna_test_markRepaid() public view returns (bool) {
        IOpportunityOrigination opportunityOrigination = IOpportunityOrigination(
                0x385A3d0906BcC6c91754b4Eaf153E29822AaBCA4
            );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        IOpportunityOrigination.Opportunity
            memory opportunity = opportunityOrigination.getOpportunity(id);

        return
            uint8(opportunity.opportunityStatus) ==
            uint8(IOpportunityOrigination.OpportunityStatus.Repaid);
    }

    function echidna_test_markWriteOff() public view returns (bool) {
        IOpportunityOrigination opportunityOrigination = IOpportunityOrigination(
                0x8C23b75228c0487054D4a49Cbf8a21874302d1FD
            );

        bytes32 id = keccak256(abi.encodePacked("aadhar"));

        return opportunityOrigination.isDrawdown(id);
    }
}
