// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "./DygnifyConfig.sol";

contract OpportunityOrigination is Initializable{
    uint public currentOpportunityId;
    // DygnifyConfig public dygnifyConfig;
    
    enum OpportunityStatus{
        Unapprove,
        Approved,
        Funded
    }

    struct Opportunity{
        address borrower;
        string loanType;
        uint loanAmount;
        uint loanTenure;
        uint loanInterest;
        uint paymentFrequency;
        string collateralDocument;
        uint capitalLoss;
        OpportunityStatus opportunityStatus;
    }
    
    mapping(uint => Opportunity) public opportunityToId;
    mapping(address => uint[]) public opportunityOf;

    // function initialize(address config) public initializer {
    //     dygnifyConfig = DygnifyConfig(config);
    // }

    function getOpportunityOf(address _borrower)public view returns(uint[] memory){
        return opportunityOf[_borrower];
    }

    //Opportunity Creation
    function createOpportunity(
        address _borrower,
        string memory _loanType,
        uint _loanAmount,
        uint _loanTenure,
        uint _loanInterest,
        uint _paymentFrequency,
        string memory _collateralDocument,
        uint _capitalLoss
    )public{
        //onlyBorrower (add)
        // require(kycOf[msg.sender].isDoucument == kycOf[msg.sender].isLiveliness == kycOf[msg.sender].isAddress == kycOf[msg.sender].isAML == kycOf[msg.sender].imageHash == kycOf[msg.sender].result == true,"Please do your KYC before creating opportunity");
        Opportunity memory _opportunity;
        _opportunity.borrower = _borrower;
        _opportunity.loanType = _loanType;
        _opportunity.loanAmount = _loanAmount;
        _opportunity.loanTenure = _loanTenure;
        _opportunity.loanInterest = _loanInterest;
        _opportunity.paymentFrequency = _paymentFrequency;
        _opportunity.collateralDocument = _collateralDocument;
        _opportunity.capitalLoss = _capitalLoss;

        opportunityToId[currentOpportunityId] = _opportunity;
        opportunityOf[_borrower].push(currentOpportunityId);
        currentOpportunityId++;
    }

    function approveOpportunity(uint _opportunityId)public{
        //only auditor requirement (add)
        require( _opportunityId < currentOpportunityId ,"Opportunity doesn't exist");
        require(opportunityToId[_opportunityId].opportunityStatus == OpportunityStatus.Unapprove ,"Opportunity is already Approved");
        opportunityToId[_opportunityId].opportunityStatus = OpportunityStatus.Approved;
    }

    // function createOpportunityPool(uint _opportunityId)public returns(address pool){
    //     // onlyOwnerOrBorrower (add)
    //     require( _opportunityId < currentOpportunityId ,"Opportunity doesn't exist");
    //     require(opportunityToId[_opportunityId].isApproved == true ,"Opportunity is already Approved");
    //     address poolImplAddress = address(0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47);
    //     pool = deployMinimal(poolImplAddress);
    //     IOpportunityPool(pool).initialize(
    //         dygnifyConfig,10,
    //         opportunityToId[_opportunityId].borrower,
    //         opportunityToId[_opportunityId].loanType,  
    //         opportunityToId[_opportunityId].loanAmount,
    //         opportunityToId[_opportunityId].loanTenure,
    //         opportunityToId[_opportunityId].loanInterest,
    //         opportunityToId[_opportunityId].paymentFrequency,
    //         opportunityToId[_opportunityId].collateralDocument,
    //         opportunityToId[_opportunityId].capitalLoss
    //     );
    //     return pool;
    // }

    // // Stolen from:
    // // https://github.com/OpenZeppelin/openzeppelin-sdk/blob/master/packages/lib/contracts/upgradeability/ProxyFactory.sol
    // function deployMinimal(address _logic) internal returns (address proxy) {
    //     bytes20 targetBytes = bytes20(_logic);
    //     // solhint-disable-next-line no-inline-assembly
    //     assembly {
    //         let clone := mload(0x40)
    //         mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
    //         mstore(add(clone, 0x14), targetBytes)
    //         mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
    //         proxy := create(0, clone, 0x37)
    //     }
    //     return proxy;
    // }
}