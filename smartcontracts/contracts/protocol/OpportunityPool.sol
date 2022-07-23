// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LPToken.sol";
import "./DygnifyConfig.sol";
import "./BaseUpgradeablePausable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./OpportunityOrigination.sol";
//locking senior pool and junior pool

contract OpportunityPool is BaseUpgradeablePausable{
    DygnifyConfig public dygnifyConfig;
    using ConfigHelper for DygnifyConfig;
    using SafeMathUpgradeable for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20Upgradeable for IERC20;
    OpportunityOrigination public opportunityOrigination;

    IERC20 public usdcToken;
    LPToken public lpToken;

    bytes32 public opportunityID;
    uint8 public loanType;
    uint public loanAmount;
    string public opportunityInfo;
    uint public loanTenureInDays;
    uint public loanInterest;
    uint public paymentFrequencyInDays;
    string public collateralDocument;
    uint public capitalLoss; 
    uint public poolBalance;
    uint public repaymentStartTime;
    uint public repaymentCounter = 1;
    uint public emiAmount;
    uint public dailyInterestRate;
    
    bool public isDrawdownsPaused;

    bytes32 public constant SENIOR_POOL_ROLE = keccak256("SENIOR_POOL_ROLE");
    bytes32 public constant BORROWER_ROLE = keccak256("BORROWER_ROLE");
    bytes32 public constant POOL_LOCKER_ROLE = keccak256("POOL_LOCKER_ROLE");

    // backer's Address => stakingBalance
    mapping(address => uint256) public stakingBalance;
    // backer's Address => isStaking (boolean)
    mapping(address => bool) public isStaking;

    SubpoolDetails public seniorSubpoolDetails;
    SubpoolDetails public juniorSubpoolDetails;

    enum Subpool{
        JuniorSubpool,
        SeniorSubpool
    }

    struct SubpoolDetails{
        uint256 id;
        uint256 totalDepositable;
        uint256 depositedAmount;
        bool isLock;
    }

    event Deposited(address indexed executor, uint8 indexed subpool, uint256 amount);
    event Withdrew(address indexed executor, uint8 indexed subpool, uint256 amount);

    function initialize(
        DygnifyConfig _dygnifyConfig,
        bytes32 _opportunityID,
        string memory _opportunityInfo,
        uint8 _loanType,
        uint _loanAmount,
        uint _loanTenureInDays,
        uint _loanInterest,
        uint _paymentFrequencyInDays,
        string memory _collateralDocument,
        uint _capitalLoss
    ) public initializer {
        dygnifyConfig = _dygnifyConfig;
        address owner = dygnifyConfig.dygnifyAdminAddress();
        require(owner != address(0), "Invalid Owner");
        opportunityOrigination = OpportunityOrigination(dygnifyConfig.getOpportunityOrigination());

        _BaseUpgradeablePausable_init(owner);
        usdcToken = IERC20(dygnifyConfig.usdcAddress());
        lpToken = LPToken(dygnifyConfig.lpTokenAddress());
        _setRoleAdmin(SENIOR_POOL_ROLE, ADMIN_ROLE);
        _setRoleAdmin(BORROWER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(POOL_LOCKER_ROLE, ADMIN_ROLE);
        _setupRole(POOL_LOCKER_ROLE, owner);

        if(dygnifyConfig.getFlag(_opportunityID) == false){
            // follow 4x leverage ratio
            seniorSubpoolDetails.isLock = true;
            uint256 temp = loanAmount.div(dygnifyConfig.getLeverageRatio()+1);
            seniorSubpoolDetails.totalDepositable = temp.mul(dygnifyConfig.getLeverageRatio());
            juniorSubpoolDetails.totalDepositable = loanAmount - seniorSubpoolDetails.totalDepositable;
        }
        else{
            juniorSubpoolDetails.isLock = true;
            seniorSubpoolDetails.totalDepositable = loanAmount;
        }

        opportunityID = _opportunityID;
        opportunityInfo = _opportunityInfo;
        loanType = _loanType;
        loanAmount = _loanAmount;
        loanTenureInDays = _loanTenureInDays;
        loanInterest = _loanInterest;
        paymentFrequencyInDays = _paymentFrequencyInDays;
        collateralDocument = _collateralDocument;
        capitalLoss = _capitalLoss;

        uint256 total_Repayment = loanAmount.add(loanAmount.mul( loanInterest.div(100) ).div(10**18));
        emiAmount = total_Repayment.div( loanTenureInDays.div(paymentFrequencyInDays) );
        uint256 effectiveInterest = loanInterest.add(dygnifyConfig.getOverDueFee());
        dailyInterestRate = effectiveInterest.div(loanTenureInDays).div(86400);
    }

    function deposit(uint8 _subpoolId, uint256 amount)public nonReentrant whenNotPaused {
        require(_subpoolId <= uint8(Subpool.SeniorSubpool), "SubpoolID : out of range");
        require(amount > 0, "Amount Must be greater than zero");
        
        if(_subpoolId == uint8(Subpool.SeniorSubpool)){
            require(seniorSubpoolDetails.isLock == false , "Senior Subpool is locked");
            require(hasRole(SENIOR_POOL_ROLE, msg.sender), "You must have Senior pool role in order to deposit in senior subpool");
            uint256 totalAmountAfterDeposit = amount.add(seniorSubpoolDetails.depositedAmount);
            require(totalAmountAfterDeposit <= seniorSubpoolDetails.totalDepositable, "Amount exceeds the Total deposit limit of senior subpool");
            seniorSubpoolDetails.depositedAmount = seniorSubpoolDetails.depositedAmount.add(amount);
        }
        else if(_subpoolId ==  uint8(Subpool.JuniorSubpool)){
            require(juniorSubpoolDetails.isLock == false , "Junior Subpool is locked");
            uint256 totalAmountAfterDeposit = amount.add(juniorSubpoolDetails.depositedAmount);
            require(totalAmountAfterDeposit <= juniorSubpoolDetails.totalDepositable, "Amount exceeds the Total deposit limit of junior subpool");
            juniorSubpoolDetails.depositedAmount = juniorSubpoolDetails.depositedAmount.add(amount);
            stakingBalance[msg.sender] = stakingBalance[msg.sender].add(amount);
            isStaking[msg.sender] = true;
        }
        
        poolBalance = poolBalance.add(amount);
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, _subpoolId, amount);
    }

    function withdraw(uint8 _subpoolId, uint256 amount)public nonReentrant whenNotPaused{
        require(_subpoolId <= uint8(Subpool.SeniorSubpool), "SubpoolID : out of range");
        require(amount > 0, "Amount Must be greater than zero");
        
        if(_subpoolId == uint8(Subpool.SeniorSubpool)){
            
            require(seniorSubpoolDetails.isLock == false , "Senior Subpool is locked");
            require(hasRole(SENIOR_POOL_ROLE, msg.sender), "You must have Senior pool role in order to deposit in senior subpool");
            require(amount <= seniorSubpoolDetails.depositedAmount, "Amount exceeds the Total deposited amount of senior subpool");
            seniorSubpoolDetails.depositedAmount = seniorSubpoolDetails.depositedAmount.sub(amount);
        }
        else if(_subpoolId ==  uint8(Subpool.JuniorSubpool)){
            require(juniorSubpoolDetails.isLock == false , "Junior Subpool is locked");
            require(
                isStaking[msg.sender] = true &&
                stakingBalance[msg.sender] >= amount,
                "your withdraw amount is higher than deposited amount."
            );
            require(amount <= juniorSubpoolDetails.depositedAmount, "Amount exceeds the Total deposited amount of junior subpool");
            juniorSubpoolDetails.depositedAmount = juniorSubpoolDetails.depositedAmount.sub(amount);
            stakingBalance[msg.sender] = stakingBalance[msg.sender].sub(amount);
            if (stakingBalance[msg.sender] == 0) {
                isStaking[msg.sender] = false;
            }
        }

        poolBalance = poolBalance.sub(amount);
        usdcToken.safeTransferFrom(address(this), msg.sender, amount);
        emit Withdrew(msg.sender, _subpoolId, amount);
    }

    function drawdown()public nonReentrant whenNotPaused onlyBorrower{
        require(opportunityOrigination.isDrawdown(opportunityID) == false , "Funds in opportunity are already drawdown.");
        require(isDrawdownsPaused == false, "Drawdown is paused");
        require(poolBalance == loanAmount, "Total Deposited amount in opportunity pool must be equal to loan amount");
        uint256 amount = poolBalance;
        poolBalance = 0;
        juniorSubpoolDetails.depositedAmount = 0;
        seniorSubpoolDetails.depositedAmount = 0;
        repaymentStartTime = block.timestamp;
        opportunityOrigination.markDrawDown(opportunityID);
        usdcToken.safeTransferFrom(address(this), msg.sender, amount);
    }

    function repayment()public nonReentrant whenNotPaused onlyBorrower{
        require(opportunityOrigination.isDrawdown(opportunityID) == true , "Funds in opportunity haven't drawdown yet.");
        uint256 amount = emiAmount;
        uint256 currentTime = block.timestamp;
        uint256 currentRepaymentDue = nextRepaymentTime();
        uint256 overDueFee;
        if( currentTime <= currentRepaymentDue){
        }
        else{
            uint256 overDueSeconds = currentTime.sub(currentRepaymentDue);
            overDueFee = overDueSeconds.mul( dailyInterestRate.div(100) ).mul(emiAmount).div(10**18);
            amount = amount.add(overDueFee);
        }
        uint256 amountWithoutEMI = loanTenureInDays.div(paymentFrequencyInDays).mul(10**18);

        uint256 temp = amountWithoutEMI.div(dygnifyConfig.getLeverageRatio()+1);
        seniorSubpoolDetails.depositedAmount = temp.mul(dygnifyConfig.getLeverageRatio());
        juniorSubpoolDetails.depositedAmount = temp;

        //yield distribution (not finished yet)
        uint256 yield = amount - amountWithoutEMI;
        uint256 one = 10**18;
        uint256 juniorYieldPerecetage = loanInterest.div(100).mul( one.sub( dygnifyConfig.getDygnifyFee() ).sub( dygnifyConfig.getJuniorSubpoolFee() ) ).div(10**18);
        uint256 seniorYieldPerecetage = loanInterest.div(100).mul( one.sub( dygnifyConfig.getDygnifyFee() ).add(  dygnifyConfig.getJuniorSubpoolFee().mul(4) ) ).div(10**18);
        

        poolBalance = poolBalance.add(amount);
        repaymentCounter = repaymentCounter.add(1);
        usdcToken.safeTransferFrom(address(this), msg.sender, amount);
    }

    function nextRepaymentTime() public view returns(uint256){
        uint256 nextRepaymentDue = repaymentStartTime.add(repaymentCounter.mul(1 days * paymentFrequencyInDays));
        return nextRepaymentDue;
    }

    modifier onlyBorrower() {
        require(hasRole(BORROWER_ROLE, msg.sender), "Must have borrower role to perform this action");
        _;
    }

    modifier onlyPoolLocker() {
        require(hasRole(POOL_LOCKER_ROLE, msg.sender), "Must have borrower role to perform this action");
        _;
    }

    function lockPool(uint8 _subpoolId) public onlyPoolLocker{
        require(_subpoolId <= uint8(Subpool.SeniorSubpool), "SubpoolID : out of range");

        if(_subpoolId == uint8(Subpool.SeniorSubpool)){
            seniorSubpoolDetails.isLock = true;
        }
        else if(_subpoolId ==  uint8(Subpool.JuniorSubpool)){
            juniorSubpoolDetails.isLock = true;
        }
    }

    function unLockPool(uint8 _subpoolId) public onlyPoolLocker{
        require(_subpoolId <= uint8(Subpool.SeniorSubpool), "SubpoolID : out of range");
        
        if(_subpoolId == uint8(Subpool.SeniorSubpool)){
            seniorSubpoolDetails.isLock = false;
        }
        else if(_subpoolId ==  uint8(Subpool.JuniorSubpool)){
            juniorSubpoolDetails.isLock = false;
        }
    }

    function pauseDrawdown() public onlyAdmin {
        isDrawdownsPaused = true;
    }

    function unpauseDrawdown() public onlyAdmin {
        isDrawdownsPaused = false;
    }
}