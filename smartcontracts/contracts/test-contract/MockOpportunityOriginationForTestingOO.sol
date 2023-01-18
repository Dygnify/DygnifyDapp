// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/DygnifyKeeper.sol";
import "./MockOpportunityPool.sol";
import "../interfaces/IDygnifyKeeper.sol";
import "../protocol/DygnifyConfig.sol";
import "hardhat/console.sol";

contract MockOpportunityOriginationForTestingOO {
    address poolAddress;
    address DygnifyKeeperAddress;
    DygnifyConfig public dygnifyConfig;
    using ConfigHelper for DygnifyConfig;

    // needed mappings
    mapping(bytes32 => Opportunity) public opportunityToId;
    mapping(bytes32 => bool) public isOpportunity;

    // needed structs
    struct Opportunity {
        bytes32 opportunityID;
        address borrower;
        string opportunityName;
        string opportunityInfo;
        LoanType loanType;
        uint256 loanAmount;
        uint256 loanTenureInDays;
        uint256 loanInterest;
        uint256 paymentFrequencyInDays;
        string collateralDocument;
        uint256 capitalLoss;
        OpportunityStatus opportunityStatus;
        address opportunityPoolAddress;
        uint256 createdOn;
    }

    struct CreateOpportunity {
        address borrower;
        string opportunityName;
        string opportunityInfo;
        LoanType loanType;
        uint256 loanAmount;
        uint256 loanTenureInDays;
        uint256 loanInterest;
        uint256 paymentFrequencyInDays;
        string collateralDocument;
        uint256 capitalLoss;
    }

    // needed enums
    enum OpportunityStatus {
        UnderReview,
        Rejected,
        Approved,
        Unsure,
        Collateralized,
        Active,
        Drawndown,
        WriteOff,
        Repaid
    }

    enum LoanType {
        InterestRepaymentsBulletLoan,
        TermLoan
    }

    constructor(
        DygnifyConfig config,
        address _poolAddress,
        address _dygnifyKeeperAddress
    ) {
        dygnifyConfig = DygnifyConfig(config);
        DygnifyKeeperAddress = _dygnifyKeeperAddress;
        poolAddress = _poolAddress;
    }

    //Opportunity Creation
    function createOpportunity(
        CreateOpportunity memory _opportunityData,
        OpportunityStatus status
    ) external {
        bytes32 id = keccak256(
            abi.encodePacked(_opportunityData.collateralDocument)
        );

        Opportunity memory _opportunity;
        _opportunity.opportunityID = id;
        _opportunity.borrower = _opportunityData.borrower;
        _opportunity.opportunityName = _opportunityData.opportunityName;
        _opportunity.opportunityInfo = _opportunityData.opportunityInfo;
        _opportunity.loanType = _opportunityData.loanType;
        _opportunity.loanAmount += _opportunityData.loanAmount;
        _opportunity.loanTenureInDays = _opportunityData.loanTenureInDays;
        _opportunity.loanInterest = _opportunityData.loanInterest;
        _opportunity.paymentFrequencyInDays = _opportunityData
            .paymentFrequencyInDays;
        _opportunity.collateralDocument = _opportunityData.collateralDocument;
        _opportunity.capitalLoss = _opportunityData.capitalLoss;
        _opportunity.createdOn = block.timestamp;
        
        _opportunity.opportunityPoolAddress = poolAddress;
        _opportunity.opportunityStatus = status;

        opportunityToId[id] = _opportunity;
        isOpportunity[id] = true;
    }

    function markDrawDown(bytes32 id) external {
        require(isOpportunity[id] == true, "Opportunity ID doesn't exist");
        require(
            opportunityToId[id].opportunityStatus == OpportunityStatus.Active,
            "Opportunity pool is not active"
        );
        require(
            msg.sender == opportunityToId[id].opportunityPoolAddress,
            "Only Opportunity Pool can mark it as drawdown"
        );
        require(
            opportunityToId[id].opportunityPoolAddress != address(0),
            "Opportunity Pool is not created yet"
        );
        opportunityToId[id].opportunityStatus = OpportunityStatus.Drawndown;
        IDygnifyKeeper(DygnifyKeeperAddress).addOpportunityInKeeper(id);
    }

    function markRepaid(bytes32 id) external {
        require(isOpportunity[id] == true, "Opportunity ID doesn't exist");
        require(
            opportunityToId[id].opportunityStatus ==
                OpportunityStatus.Drawndown,
            "Opportunity pool is haven't drawdown yet."
        );
        require(
            msg.sender == opportunityToId[id].opportunityPoolAddress,
            "Only Opportunity Pool can mark it as repaid"
        );
        require(
            opportunityToId[id].opportunityPoolAddress != address(0),
            "Opportunity Pool is not created yet"
        );
        opportunityToId[id].opportunityStatus = OpportunityStatus.Repaid;
        IDygnifyKeeper(DygnifyKeeperAddress).removeOpportunityInKeeper(id);
    }

    function markWriteOff(bytes32 id, address _pool) external {
        require(isOpportunity[id] == true, "Opportunity ID doesn't exist");
        require(
            opportunityToId[id].opportunityStatus ==
                OpportunityStatus.Drawndown,
            "Opportunity pool is haven't drawdown yet."
        );
        require(
            msg.sender == dygnifyConfig.dygnifyKeeperAddress(),
            "Only dygnifyKeeper can mark it as writeoff"
        );
        opportunityToId[id].opportunityStatus = OpportunityStatus.WriteOff;
        IOpportunityPool(_pool).writeOffOpportunity();
    }

    function isDrawdown(bytes32 id) external pure returns (bool) {
        return true;
    }

    function getOpportunityPoolAddress(
        bytes32 id
    ) external view returns (address) {
        return poolAddress;
    }
}
