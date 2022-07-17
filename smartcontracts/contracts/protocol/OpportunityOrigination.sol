// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseUpgradeablePausable.sol";
import "./DygnifyConfig.sol";
import "../interfaces/IOpportunityPool.sol";
import "./CollateralToken.sol";

contract OpportunityOrigination is BaseUpgradeablePausable{
    DygnifyConfig public dygnifyConfig;
    CollateralToken public collateralToken;
    using ConfigHelper for DygnifyConfig;
    
    enum OpportunityStatus{
        UnderReview,
        Rejected,
        Approved,
        Unsure,
        Collateralized,
        Active,
        Drawndown,
        Repayment
    }

    enum LoanType{
        InterestRepaymentsBulletLoan,
        TermLoan
    }

    struct Opportunity{
        bytes32 opportunityID;
        address borrower;
        string opportunityInfo;
        LoanType loanType;
        uint loanAmount;
        uint loanTenureInDays;
        uint loanInterest;
        uint paymentFrequencyInDays;
        string collateralDocument;
        uint capitalLoss;
        OpportunityStatus opportunityStatus;
        address opportunityPoolAddress;
    }
    
    mapping(bytes32 => Opportunity) public opportunityToId;
    mapping(address => bytes32[]) public opportunityOf;
    mapping(bytes32 => bool) public isOpportunity;
    // opportunityID => selected 9 auditors
    mapping(bytes32 => address[9]) auditorsOf;

    // storing all the opportunities in an array.
    bytes32[] public opportunityIds;

    function getTotalOpportunities()public view returns(uint256){
        return opportunityIds.length;
    }

    function _opportunityOrigination_init(address config) public initializer {
        dygnifyConfig = DygnifyConfig(config);
        address owner = dygnifyConfig.dygnifyAdminAddress();
        _BaseUpgradeablePausable_init(owner);
        collateralToken = CollateralToken(dygnifyConfig.collateralTokenAddress());
    }

    function getOpportunityOf(address _borrower)public view returns(bytes32[] memory){
        return opportunityOf[_borrower];
    }

    //Opportunity Creation
    function createOpportunity(
        address _borrower,
        string memory _opportunityInfo,
        uint8 _loanType,
        uint _loanAmount,
        uint _loanTenureInDays,
        uint _loanInterest,
        uint _paymentFrequencyInDays,
        string memory _collateralDocument,
        uint _capitalLoss
    )public nonReentrant whenNotPaused{
        // KYC check (add)
        // require(kycOf[msg.sender].isDoucument == kycOf[msg.sender].isLiveliness == kycOf[msg.sender].isAddress == kycOf[msg.sender].isAML == kycOf[msg.sender].imageHash == kycOf[msg.sender].result == true,"Please do your KYC before creating opportunity");
        
        require(_loanType <= uint8(LoanType.TermLoan),"LoanType : Out of range");
        require(_loanAmount > 0, "Loan Amount Must be greater than 0");
        require(address(_borrower) != address(0), "invalid borrower address");
        require(_loanInterest > 0, "Loan Interest Must be greater than 0");
        require(_loanTenureInDays > 0, "Loan Tenure Must be greater than 0");
        require(_paymentFrequencyInDays > 0, "Payment Frequency Must be greater than 0");
        require(_capitalLoss > 0, "Capital Loss Must be greater than 0");

        bytes32 id = keccak256(abi.encodePacked(_collateralDocument));
        require(isOpportunity[id] == false, "Opportunity ID already exist.");

        Opportunity memory _opportunity;
        _opportunity.opportunityID = id;
        _opportunity.borrower = _borrower;
        _opportunity.opportunityInfo = _opportunityInfo;
        _opportunity.loanType = LoanType(_loanType);
        _opportunity.loanAmount = _loanAmount;
        _opportunity.loanTenureInDays = _loanTenureInDays;
        _opportunity.loanInterest = _loanInterest;
        _opportunity.paymentFrequencyInDays = _paymentFrequencyInDays;
        _opportunity.collateralDocument = _collateralDocument;
        _opportunity.capitalLoss = _capitalLoss;

        opportunityToId[id] = _opportunity;
        opportunityOf[_borrower].push(id);
        isOpportunity[id] = true;
        opportunityIds.push(id);
    }
    
    // In future, this function assign random auditors to a opportunity ID. currently it only assign 1 auditor
    function assignAuditors(bytes32 _opportunityId, address _auditor)public onlyAdmin nonReentrant whenNotPaused{
        require(_auditor != address(0), "Invalid Address");
        require(isOpportunity[_opportunityId] == true, "Opportunity ID doesn't exist");
        require(opportunityToId[_opportunityId].opportunityStatus == OpportunityStatus.UnderReview ,"Opportunity is already Judged");
        auditorsOf[_opportunityId][0] = _auditor;
    }

    function voteOpportunity(bytes32 _opportunityId, uint8 _status)public nonReentrant whenNotPaused{
        require(auditorsOf[_opportunityId][0] == msg.sender, "You are not an audiitor for this Opportunity.");
        require(isOpportunity[_opportunityId] == true, "Opportunity ID doesn't exist");
        require(_status >= uint8(OpportunityStatus.Rejected) && _status <= uint8(OpportunityStatus.Unsure), "Status : out of range");
        require(opportunityToId[_opportunityId].opportunityStatus == OpportunityStatus.UnderReview ,"Opportunity is already Judged");
        opportunityToId[_opportunityId].opportunityStatus = OpportunityStatus(_status);
    }

    function mintCollateral(bytes32 _opportunityId)public nonReentrant whenNotPaused {
        require(isOpportunity[_opportunityId] == true, "Opportunity ID doesn't exist");
        require(msg.sender == opportunityToId[_opportunityId].borrower, "Only borrower of the opportunity can mint the collateral." );
        require(opportunityToId[_opportunityId].opportunityStatus == OpportunityStatus.Approved ,"Opportunity is not approved");
        collateralToken.safeMint(msg.sender, opportunityToId[_opportunityId].collateralDocument);
        opportunityToId[_opportunityId].opportunityStatus = OpportunityStatus.Collateralized;
    }

    function createOpportunityPool(bytes32 _opportunityId)public nonReentrant whenNotPaused returns(address pool){
        require(msg.sender == opportunityToId[_opportunityId].borrower, "You are not a borrower");
        require(opportunityToId[_opportunityId].opportunityStatus == OpportunityStatus.Collateralized ,"Collateral of the Opportunity is not minted.");
        require(isOpportunity[_opportunityId] == true, "Opportunity ID doesn't exist");

        address poolImplAddress = dygnifyConfig.poolImplAddress();
        pool = deployMinimal(poolImplAddress);
        IOpportunityPool(pool).initialize(
            address(dygnifyConfig),
            opportunityToId[_opportunityId].opportunityID,
            opportunityToId[_opportunityId].opportunityInfo,
            uint8(opportunityToId[_opportunityId].loanType),  
            opportunityToId[_opportunityId].loanAmount,
            opportunityToId[_opportunityId].loanTenureInDays,
            opportunityToId[_opportunityId].loanInterest,
            opportunityToId[_opportunityId].paymentFrequencyInDays,
            opportunityToId[_opportunityId].collateralDocument,
            opportunityToId[_opportunityId].capitalLoss
        );
        opportunityToId[_opportunityId].opportunityPoolAddress = pool;
        opportunityToId[_opportunityId].opportunityStatus = OpportunityStatus.Active;
        return pool;
    }

    // Source Credits:
    // https://github.com/OpenZeppelin/openzeppelin-sdk/blob/master/packages/lib/contracts/upgradeability/ProxyFactory.sol
    function deployMinimal(address _logic) internal returns (address proxy) {
        bytes20 targetBytes = bytes20(_logic);
        // solhint-disable-next-line no-inline-assembly
        assembly {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), targetBytes)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            proxy := create(0, clone, 0x37)
        }
        return proxy;
    }
}