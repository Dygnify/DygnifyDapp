// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/ILPToken.sol";
import "./DygnifyConfig.sol";
import "./BaseUpgradeablePausable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "../interfaces/IOpportunityOrigination.sol";
import "../interfaces/IInvestor.sol";
import "../interfaces/IOpportunityPool.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./Constants.sol";
import "./Accounting.sol";
import "../interfaces/ISeniorPool.sol";

contract OpportunityPool is BaseUpgradeablePausable, IOpportunityPool {
    DygnifyConfig public dygnifyConfig;
    using ConfigHelper for DygnifyConfig;
    using SafeMathUpgradeable for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20Upgradeable for IERC20;
    IOpportunityOrigination public opportunityOrigination;
    IInvestor public investor;

    IERC20 public usdcToken;
    ILPToken public lpToken;

    bytes32 public opportunityID;
    uint8 public loanType;
    uint256 public loanAmount;
    uint256 public loanTenureInDays;
    uint256 public loanInterest;
    uint256 public paymentFrequencyInDays;
    uint256 public poolBalance;
    uint256 public repaymentStartTime;
    uint256 public repaymentCounter;
    uint256 public totalRepayments;
    uint256 public emiAmount;
    uint256 public dailyOverdueInterestRate;
    uint256 public totalRepaidAmount;
    uint256 public totalOutstandingPrincipal;
    uint256 public seniorYieldPerecentage;
    uint256 public juniorYieldPerecentage;
    uint256 public seniorOverduePerecentage;
    uint256 public juniorOverduePerecentage;
    uint256 constant offset = 10;
    bool public isDrawdownsPaused;

    // backer's Address => stakingBalance
    mapping(address => uint256) public stakingBalance;
    // backer's Address => isStaking (boolean)
    mapping(address => bool) public override isStaking;

    SubpoolDetails public seniorSubpoolDetails;
    SubpoolDetails public juniorSubpoolDetails;

    event Deposited(
        address indexed executor,
        uint8 indexed subpool,
        uint256 amount
    );
    event Withdrew(
        address indexed executor,
        uint8 indexed subpool,
        uint256 amount
    );

    function initialize(
        DygnifyConfig _dygnifyConfig,
        bytes32 _opportunityID,
        uint256 _loanAmount,
        uint256 _loanTenureInDays,
        uint256 _loanInterest,
        uint256 _paymentFrequencyInDays,
        uint8 _loanType
    ) external override initializer {
        require(
            address(_dygnifyConfig) != address(0),
            "Invalid config address"
        );
        dygnifyConfig = _dygnifyConfig;
        address owner = dygnifyConfig.dygnifyAdminAddress();
        require(owner != address(0), "Invalid Owner");
        opportunityOrigination = IOpportunityOrigination(
            dygnifyConfig.getOpportunityOrigination()
        );
        investor = IInvestor(dygnifyConfig.investorContractAddress());

        _BaseUpgradeablePausable_init(owner);
        usdcToken = IERC20(dygnifyConfig.usdcAddress());
        lpToken = ILPToken(dygnifyConfig.lpTokenAddress());
        _setRoleAdmin(Constants.getSeniorPoolRole(), Constants.getAdminRole());
        _setupRole(
            Constants.getSeniorPoolRole(),
            dygnifyConfig.seniorPoolAddress()
        );
        _setRoleAdmin(Constants.getBorrowerRole(), Constants.getAdminRole());
        _setRoleAdmin(Constants.getPoolLockerRole(), Constants.getAdminRole());
        _setupRole(Constants.getPoolLockerRole(), owner);
        address borrower = opportunityOrigination.getBorrower(_opportunityID);
        _setupRole(Constants.getBorrowerRole(), borrower);
        opportunityID = _opportunityID;
        loanAmount = _loanAmount;
        totalOutstandingPrincipal = _loanAmount;
        loanTenureInDays = _loanTenureInDays;
        loanInterest = _loanInterest;
        paymentFrequencyInDays = _paymentFrequencyInDays;
        repaymentCounter = 1;
        loanType = _loanType;

        if (dygnifyConfig.getFlag(_opportunityID) == false) {
            // follow 4x leverage ratio
            seniorSubpoolDetails.isPoolLocked = true;
            uint256 temp = loanAmount.div(dygnifyConfig.getLeverageRatio() + 1);
            seniorSubpoolDetails.totalDepositable = temp.mul(
                dygnifyConfig.getLeverageRatio()
            );
            juniorSubpoolDetails.totalDepositable =
                loanAmount -
                seniorSubpoolDetails.totalDepositable;
        } else {
            juniorSubpoolDetails.isPoolLocked = true;
            seniorSubpoolDetails.totalDepositable = loanAmount;
        }

        totalRepayments = loanTenureInDays.div(paymentFrequencyInDays);

        if (loanType == 1) {
            emiAmount = Accounting.getTermLoanEMI(
                loanAmount,
                loanInterest,
                totalRepayments
            );
        } else {
            emiAmount = Accounting.getBulletLoanEMI(
                loanAmount,
                loanInterest,
                paymentFrequencyInDays
            );
        }

        dailyOverdueInterestRate = dygnifyConfig.getOverDueFee().div(
            Constants.oneYearInDays()
        );

        (seniorYieldPerecentage, juniorYieldPerecentage) = Accounting
            .getYieldPercentage(
            dygnifyConfig.getDygnifyFee(),
            dygnifyConfig.getJuniorSubpoolFee(),
            loanType == 1,
            emiAmount,
            loanAmount,
            totalRepayments,
            loanInterest,
            dygnifyConfig.getLeverageRatio(),
            loanTenureInDays
        );

        (
            seniorOverduePerecentage,
            juniorOverduePerecentage
        ) = getOverDuePercentage();
        bool success = usdcToken.approve(address(this), 2**256 - 1);
        require(success, "Failed to approve USDC");
    }

    function deposit(uint8 _subpoolId, uint256 amount)
        external
        override
        nonReentrant
    {
        // require(
        //     IERC721Upgradeable(dygnifyConfig.identityTokenAddress()).balanceOf(
        //         msg.sender
        //     ) != 0,
        //     "KYC Of Investor is not done yet"
        // );

        require(
            _subpoolId <= uint8(Subpool.SeniorSubpool),
            "SubpoolID : out of range"
        );
        require(amount > 0, "Amount Must be greater than zero");

        if (_subpoolId == uint8(Subpool.SeniorSubpool)) {
            require(
                seniorSubpoolDetails.isPoolLocked == false,
                "Senior Subpool is locked"
            );
            require(
                hasRole(Constants.getSeniorPoolRole(), msg.sender),
                "You must have Senior pool role in order to deposit in senior subpool"
            );
            uint256 totalAmountAfterDeposit = amount.add(
                seniorSubpoolDetails.depositedAmount
            );
            require(
                totalAmountAfterDeposit <=
                    seniorSubpoolDetails.totalDepositable,
                "Amount exceeds the Total deposit limit of senior subpool"
            );
            seniorSubpoolDetails.depositedAmount = seniorSubpoolDetails
                .depositedAmount
                .add(amount);
        } else if (_subpoolId == uint8(Subpool.JuniorSubpool)) {
            require(
                juniorSubpoolDetails.isPoolLocked == false,
                "Junior Subpool is locked"
            );
            uint256 totalAmountAfterDeposit = amount.add(
                juniorSubpoolDetails.depositedAmount
            );
            require(
                totalAmountAfterDeposit <=
                    juniorSubpoolDetails.totalDepositable,
                "Amount exceeds the Total deposit limit of junior subpool"
            );
            juniorSubpoolDetails.depositedAmount = juniorSubpoolDetails
                .depositedAmount
                .add(amount);

            stakingBalance[msg.sender] = stakingBalance[msg.sender].add(amount);
            isStaking[msg.sender] = true;
            if (
                investor.isExistInInvestor(msg.sender, opportunityID) == false
            ) {
                investor.addOpportunity(msg.sender, opportunityID);
            }
            if (
                totalAmountAfterDeposit >= juniorSubpoolDetails.totalDepositable
            ) {
                seniorSubpoolDetails.isPoolLocked = false;
            }
        }

        poolBalance = poolBalance.add(amount);
        usdcToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, _subpoolId, amount);
    }

    function drawdown()
        public
        override
        nonReentrant
        whenNotPaused
        onlyBorrower
    {
        require(
            opportunityOrigination.isDrawdown(opportunityID) == false,
            "Funds in opportunity are already drawdown."
        );
        require(isDrawdownsPaused == false, "Drawdown is paused");
        require(
            poolBalance == loanAmount,
            "Total Deposited amount in opportunity pool must be equal to loan amount"
        );
        uint256 amount = poolBalance;
        poolBalance = 0;
        juniorSubpoolDetails.depositedAmount = 0;
        seniorSubpoolDetails.depositedAmount = 0;
        repaymentStartTime = block.timestamp;
        opportunityOrigination.markDrawDown(opportunityID);
        usdcToken.safeTransferFrom(address(this), msg.sender, amount);
    }

    function repayment() public override nonReentrant onlyBorrower {
        require(
            repaymentCounter <= totalRepayments,
            "Repayment Process is done"
        );
        require(
            opportunityOrigination.isDrawdown(opportunityID) == true,
            "Funds in opportunity haven't drawdown yet."
        );

        uint256 currentTime = block.timestamp;
        uint256 currentRepaymentDue = nextRepaymentTime();
        uint256 overDueFee;
        if (currentTime > currentRepaymentDue) {
            uint256 overDueSeconds = currentTime.sub(currentRepaymentDue).div(
                86400
            );
            overDueFee = overDueSeconds
                .mul(dailyOverdueInterestRate.div(100))
                .mul(emiAmount)
                .div(Constants.sixDecimal());
        }
        // This is a term loan calculation
        if (loanType == 1) {
            uint256 amount = emiAmount;
            totalRepaidAmount += emiAmount;

            // Calculate the interst from emi
            uint256 interest = Accounting.getTermLoanInterest(
                totalOutstandingPrincipal,
                paymentFrequencyInDays,
                loanInterest
            );
            uint256 principalReceived = emiAmount.sub(interest);
            totalOutstandingPrincipal = totalOutstandingPrincipal.sub(
                principalReceived.sub(offset)
            );

            uint256 juniorPoolPrincipalPortion = principalReceived.div(
                dygnifyConfig.getLeverageRatio().add(1)
            );

            uint256 seniorPoolPrincipalPortion = juniorPoolPrincipalPortion.mul(
                dygnifyConfig.getLeverageRatio()
            );
            seniorSubpoolDetails.depositedAmount = seniorSubpoolDetails
                .depositedAmount
                .add(seniorPoolPrincipalPortion);
            juniorSubpoolDetails.depositedAmount = juniorSubpoolDetails
                .depositedAmount
                .add(juniorPoolPrincipalPortion);

            //yield distribution
            uint256 seniorPoolInterst;
            uint256 juniorPoolInterst;
            (seniorPoolInterst, juniorPoolInterst) = Accounting
                .getInterestDistribution(
                dygnifyConfig.getDygnifyFee(),
                dygnifyConfig.getJuniorSubpoolFee(),
                interest,
                dygnifyConfig.getLeverageRatio(),
                loanAmount,
                seniorSubpoolDetails.totalDepositable
            );
            seniorSubpoolDetails.yieldGenerated = seniorSubpoolDetails
                .yieldGenerated
                .add(seniorPoolInterst);

            juniorSubpoolDetails.yieldGenerated = juniorSubpoolDetails
                .yieldGenerated
                .add(juniorPoolInterst);

            //overdue Amount distribution
            juniorSubpoolDetails.overdueGenerated = juniorSubpoolDetails
                .overdueGenerated
                .add(
                juniorOverduePerecentage.mul(overDueFee).div(
                    Constants.sixDecimal()
                )
            );
            seniorSubpoolDetails.overdueGenerated = seniorSubpoolDetails
                .overdueGenerated
                .add(
                seniorOverduePerecentage.mul(overDueFee).div(
                    Constants.sixDecimal()
                )
            );

            // sending fund in dygnifyTreasury
            uint256 dygnifyTreasury = interest
                .mul(dygnifyConfig.getDygnifyFee())
                .div(Constants.sixDecimal());
            dygnifyTreasury += overDueFee
                .mul(dygnifyConfig.getDygnifyFee())
                .div(Constants.sixDecimal());

            amount = amount.add(overDueFee);
            poolBalance = poolBalance.add(amount);

            usdcToken.safeTransferFrom(msg.sender, address(this), amount);

            // trasfering protocal fee to treasury.
            usdcToken.transfer(
                dygnifyConfig.dygnifyTreasuryAddress(),
                dygnifyTreasury
            );
        } else {
            uint256 amount = emiAmount;
            totalRepaidAmount += amount;

            //yield distribution
            uint256 seniorPoolInterst;
            uint256 juniorPoolInterst;
            (seniorPoolInterst, juniorPoolInterst) = Accounting
                .getInterestDistribution(
                dygnifyConfig.getDygnifyFee(),
                dygnifyConfig.getJuniorSubpoolFee(),
                amount,
                dygnifyConfig.getLeverageRatio(),
                loanAmount,
                seniorSubpoolDetails.totalDepositable
            );
            seniorSubpoolDetails.yieldGenerated = seniorSubpoolDetails
                .yieldGenerated
                .add(seniorPoolInterst);

            juniorSubpoolDetails.yieldGenerated = juniorSubpoolDetails
                .yieldGenerated
                .add(juniorPoolInterst);

            //overdue Amount distribution
            juniorSubpoolDetails.overdueGenerated = juniorSubpoolDetails
                .overdueGenerated
                .add(
                juniorOverduePerecentage.mul(overDueFee).div(
                    Constants.sixDecimal()
                )
            );
            seniorSubpoolDetails.overdueGenerated = seniorSubpoolDetails
                .overdueGenerated
                .add(
                seniorOverduePerecentage.mul(overDueFee).div(
                    Constants.sixDecimal()
                )
            );

            // sending fund in dygnifyTreasury
            uint256 dygnifyTreasury = amount
                .mul(dygnifyConfig.getDygnifyFee())
                .div(Constants.sixDecimal());
            dygnifyTreasury += (
                overDueFee.mul(dygnifyConfig.getDygnifyFee()).div(
                    Constants.sixDecimal()
                )
            );

            if (repaymentCounter == totalRepayments) {
                amount = amount.add(loanAmount);
                totalRepaidAmount = totalRepaidAmount.add(loanAmount);
                seniorSubpoolDetails.depositedAmount = seniorSubpoolDetails
                    .totalDepositable;
                juniorSubpoolDetails.depositedAmount = juniorSubpoolDetails
                    .totalDepositable;
            }

            amount = amount.add(overDueFee);
            poolBalance = poolBalance.add(amount);

            usdcToken.safeTransferFrom(msg.sender, address(this), amount);

            // trasfering protocal fee to treasury.
            usdcToken.transfer(
                dygnifyConfig.dygnifyTreasuryAddress(),
                dygnifyTreasury
            );
        }

        if (repaymentCounter == totalRepayments) {
            opportunityOrigination.markRepaid(opportunityID);
            ISeniorPool(dygnifyConfig.seniorPoolAddress())
                .withDrawFromOpportunity(false, opportunityID, 0);

            // auto sending all the funds to seniorpool as all the repayments are done.
            uint256 seniorAmount = seniorSubpoolDetails.depositedAmount.add(
                seniorSubpoolDetails.yieldGenerated
            );

            if (seniorSubpoolDetails.overdueGenerated > 0) {
                seniorAmount = seniorAmount.add(
                    seniorSubpoolDetails.overdueGenerated
                );
                seniorSubpoolDetails.overdueGenerated = 0;
            }
            seniorSubpoolDetails.depositedAmount = 0;
            seniorSubpoolDetails.yieldGenerated = 0;
            poolBalance = poolBalance.sub(seniorAmount);
            usdcToken.transfer(dygnifyConfig.seniorPoolAddress(), seniorAmount);
        } else {
            repaymentCounter = repaymentCounter.add(1);
        }
    }

    // this function will withdraw all the available amount of executor including yield and overdue profit
    function withdrawAll(uint8 _subpoolId)
        external
        override
        nonReentrant
        whenNotPaused
        returns (uint256)
    {
        require(
            _subpoolId <= uint8(Subpool.SeniorSubpool),
            "SubpoolID : out of range"
        );
        require(
            opportunityOrigination.isRepaid(opportunityID) == true,
            "Funds in opportunity haven't drawdown yet."
        );
        uint256 amount;

        if (_subpoolId == uint8(Subpool.SeniorSubpool)) {
            require(
                seniorSubpoolDetails.isPoolLocked == false,
                "Senior Subpool is locked"
            );
            require(
                hasRole(Constants.getSeniorPoolRole(), msg.sender),
                "You must have Senior pool role in order to deposit in senior subpool"
            );
            require(
                seniorSubpoolDetails.depositedAmount > 0,
                "balance of senior subpool is zero currently"
            );

            amount = seniorSubpoolDetails.depositedAmount.add(
                seniorSubpoolDetails.yieldGenerated
            );

            if (seniorSubpoolDetails.overdueGenerated > 0) {
                amount = amount.add(seniorSubpoolDetails.overdueGenerated);
                seniorSubpoolDetails.overdueGenerated = 0;
            }
            seniorSubpoolDetails.depositedAmount = 0;
            seniorSubpoolDetails.yieldGenerated = 0;
        } else if (_subpoolId == uint8(Subpool.JuniorSubpool)) {
            require(
                juniorSubpoolDetails.isPoolLocked == false,
                "Junior Subpool is locked"
            );
            require(
                isStaking[msg.sender] == true && stakingBalance[msg.sender] > 0,
                "zero amount to deposit."
            );
            require(
                stakingBalance[msg.sender] <=
                    juniorSubpoolDetails.depositedAmount.add(offset),
                "currently junior subpool don't have Liquidity"
            );
            uint256 yieldGatherd = juniorYieldPerecentage
                .mul(stakingBalance[msg.sender])
                .div(Constants.sixDecimal());
            yieldGatherd = yieldGatherd.sub(offset);
            require(
                yieldGatherd <= juniorSubpoolDetails.yieldGenerated,
                "currently junior subpool yield is less than what is generated"
            );
            uint256 userStakingBal = stakingBalance[msg.sender].sub(offset);
            juniorSubpoolDetails.depositedAmount = juniorSubpoolDetails
                .depositedAmount
                .sub(userStakingBal);
            juniorSubpoolDetails.yieldGenerated = juniorSubpoolDetails
                .yieldGenerated
                .sub(yieldGatherd);

            isStaking[msg.sender] = false;
            amount = userStakingBal.add(yieldGatherd);

            if (juniorSubpoolDetails.overdueGenerated > 0) {
                uint256 overdueGathered = (
                    juniorOverduePerecentage.mul(stakingBalance[msg.sender])
                )
                    .div(Constants.sixDecimal());
                amount = amount.add(overdueGathered);
                juniorSubpoolDetails.overdueGenerated = juniorSubpoolDetails
                    .overdueGenerated
                    .sub(overdueGathered);
            }
            investor.removeOpportunity(msg.sender, opportunityID);
            stakingBalance[msg.sender] = 0;
        }

        poolBalance = poolBalance.sub(amount);
        usdcToken.transfer(msg.sender, amount);
        return amount;
    }

    function getUserWithdrawableAmount()
        external
        override
        view
        returns (uint256)
    {
        require(
            isStaking[msg.sender] == true && stakingBalance[msg.sender] > 0,
            "zero amount to deposited."
        );
        uint256 amount = 0;
        if (opportunityOrigination.isRepaid(opportunityID) == true) {
            uint256 yieldGatherd = juniorYieldPerecentage
                .mul(stakingBalance[msg.sender])
                .div(Constants.sixDecimal());

            amount = stakingBalance[msg.sender].add(yieldGatherd);

            if (juniorSubpoolDetails.overdueGenerated > 0) {
                uint256 overdueGathered = (
                    juniorOverduePerecentage.mul(stakingBalance[msg.sender])
                )
                    .div(Constants.sixDecimal());
                amount = amount.add(overdueGathered);
            }
        }
        return amount;
    }

    function getRepaymentAmount() external override view returns (uint256) {
        require(
            repaymentCounter <= totalRepayments,
            "Repayment Process is done"
        );
        require(
            opportunityOrigination.isDrawdown(opportunityID) == true,
            "Funds in opportunity haven't drawdown yet."
        );
        uint256 amount;
        if (loanType == 1) {
            amount = emiAmount;
            uint256 currentTime = block.timestamp;
            uint256 currentRepaymentDue = nextRepaymentTime();
            uint256 overDueFee;
            if (currentTime > currentRepaymentDue) {
                uint256 overDueSeconds = currentTime
                    .sub(currentRepaymentDue)
                    .div(86400);
                overDueFee = overDueSeconds
                    .mul(dailyOverdueInterestRate.div(100))
                    .mul(emiAmount)
                    .div(Constants.sixDecimal());
            }

            amount = amount.add(overDueFee);
        } else {
            amount = emiAmount;
            uint256 currentTime = block.timestamp;
            uint256 currentRepaymentDue = nextRepaymentTime();
            uint256 overDueFee;
            if (currentTime > currentRepaymentDue) {
                uint256 overDueSeconds = currentTime
                    .sub(currentRepaymentDue)
                    .div(86400);
                overDueFee = overDueSeconds
                    .mul(dailyOverdueInterestRate.div(100))
                    .mul(amount)
                    .div(Constants.sixDecimal());
            }

            amount = amount.add(overDueFee);
            if (repaymentCounter == totalRepayments) {
                amount = amount.add(loanAmount);
            }
        }
        return amount;
    }

    function getOverDuePercentage()
        public
        override
        view
        returns (uint256, uint256)
    {
        uint256 yield = Accounting.getTermLoanInterest(
            totalOutstandingPrincipal,
            paymentFrequencyInDays,
            loanInterest
        );

        uint256 juniorInvestment = loanAmount.div(
            dygnifyConfig.getLeverageRatio() + 1
        );
        uint256 seniorInvestment = juniorInvestment.mul(
            dygnifyConfig.getLeverageRatio()
        );

        uint256 _seniorOverDuePerecentage = (
            seniorInvestment.mul(seniorYieldPerecentage)
        )
            .div(yield);
        uint256 _juniorOverDuePerecentage = (
            juniorInvestment.mul(juniorYieldPerecentage)
        )
            .div(yield);
        return (_seniorOverDuePerecentage, _juniorOverDuePerecentage);
    }

    function nextRepaymentTime() public override view returns (uint256) {
        require(
            repaymentCounter <= totalRepayments,
            "Repayment Process is done"
        );
        uint256 nextRepaymentDue = repaymentStartTime.add(
            repaymentCounter.mul(1 days * paymentFrequencyInDays)
        );
        return nextRepaymentDue;
    }

    function getSeniorTotalDepositable()
        external
        override
        view
        returns (uint256)
    {
        return seniorSubpoolDetails.totalDepositable;
    }

    function getSeniorProfit() external override view returns (uint256) {
        return
            seniorSubpoolDetails.yieldGenerated +
            seniorSubpoolDetails.overdueGenerated;
    }

    modifier onlyBorrower() {
        require(
            hasRole(Constants.getBorrowerRole(), msg.sender),
            "Must have borrower role to perform this action"
        );
        _;
    }

    modifier onlyPoolLocker() {
        require(
            hasRole(Constants.getPoolLockerRole(), msg.sender),
            "Must have borrower role to perform this action"
        );
        _;
    }

    function lockPool(uint8 _subpoolId) public onlyPoolLocker {
        require(
            _subpoolId <= uint8(Subpool.SeniorSubpool),
            "SubpoolID : out of range"
        );

        if (_subpoolId == uint8(Subpool.SeniorSubpool)) {
            seniorSubpoolDetails.isPoolLocked = true;
        } else if (_subpoolId == uint8(Subpool.JuniorSubpool)) {
            juniorSubpoolDetails.isPoolLocked = true;
        }
    }

    function unLockPool(uint8 _subpoolId) public onlyPoolLocker {
        require(
            _subpoolId <= uint8(Subpool.SeniorSubpool),
            "SubpoolID : out of range"
        );

        if (_subpoolId == uint8(Subpool.SeniorSubpool)) {
            seniorSubpoolDetails.isPoolLocked = false;
        } else if (_subpoolId == uint8(Subpool.JuniorSubpool)) {
            juniorSubpoolDetails.isPoolLocked = false;
        }
    }

    function pauseDrawdown() public onlyAdmin {
        isDrawdownsPaused = true;
    }

    function unpauseDrawdown() public onlyAdmin {
        isDrawdownsPaused = false;
    }

    function getOpportunityName()
        external
        override
        view
        returns (string memory)
    {
        return opportunityOrigination.getOpportunityNameOf(opportunityID);
    }

    function writeOffOpportunity() external override {
        require(
            opportunityOrigination.isWriteOff(opportunityID) == true,
            "Opportunity pool is haven't Writeoff yet."
        );
        require(
            msg.sender == dygnifyConfig.getOpportunityOrigination(),
            "Only OpportunityOrigination can execute writeoff"
        );

        uint256 temp = loanAmount.mul(totalRepayments).div(
            dygnifyConfig.getLeverageRatio().add(1)
        );

        uint256 tempSenior = temp.mul(dygnifyConfig.getLeverageRatio());
        uint256 estimatedSeniorYield = seniorYieldPerecentage
            .mul(tempSenior)
            .div(Constants.sixDecimal());

        uint256 remainingOverdue;
        if (loanType == 1) {
            uint256 currentTime = block.timestamp;
            uint256 currentRepaymentDue = nextRepaymentTime();
            uint256 overDueFee;
            if (currentTime > currentRepaymentDue) {
                uint256 overDueSeconds = currentTime
                    .sub(currentRepaymentDue)
                    .div(86400);
                overDueFee = overDueSeconds
                    .mul(dailyOverdueInterestRate.div(100))
                    .mul(emiAmount)
                    .div(Constants.sixDecimal());
            }

            remainingOverdue = overDueFee;
        } else {
            uint256 amount = emiAmount;
            uint256 currentTime = block.timestamp;
            uint256 currentRepaymentDue = nextRepaymentTime();
            uint256 overDueFee;
            if (currentTime > currentRepaymentDue) {
                uint256 overDueSeconds = currentTime
                    .sub(currentRepaymentDue)
                    .div(86400);
                overDueFee = overDueSeconds
                    .mul(dailyOverdueInterestRate.div(100))
                    .mul(amount)
                    .div(Constants.sixDecimal());
            }

            remainingOverdue = overDueFee;
        }
        remainingOverdue = seniorOverduePerecentage.mul(remainingOverdue).div(
            Constants.sixDecimal()
        );
        uint256 estimatedOverdue = remainingOverdue +
            seniorSubpoolDetails.overdueGenerated;

        uint256 estimatedSeniorPoolAmount = estimatedOverdue +
            estimatedSeniorYield +
            seniorSubpoolDetails.totalDepositable;

        if (poolBalance > estimatedSeniorPoolAmount) {
            // uint256 remainingAmount = poolBalance - estimatedSeniorPoolAmount;
            ISeniorPool(dygnifyConfig.seniorPoolAddress())
                .withDrawFromOpportunity(
                true,
                opportunityID,
                estimatedSeniorPoolAmount
            );

            seniorSubpoolDetails.overdueGenerated = 0;
            seniorSubpoolDetails.depositedAmount = 0;
            seniorSubpoolDetails.yieldGenerated = 0;
            //state updation of juniorsubpool
        } else {
            ISeniorPool(dygnifyConfig.seniorPoolAddress())
                .withDrawFromOpportunity(true, opportunityID, poolBalance);
            poolBalance = 0;
            seniorSubpoolDetails.overdueGenerated = 0;
            seniorSubpoolDetails.depositedAmount = 0;
            seniorSubpoolDetails.yieldGenerated = 0;
            juniorSubpoolDetails.overdueGenerated = 0;
            juniorSubpoolDetails.depositedAmount = 0;
            juniorSubpoolDetails.yieldGenerated = 0;
        }
    }

    function getSeniorPoolWithdrawableAmount()
        external
        override
        view
        returns (uint256 amount)
    {
        require(
            seniorSubpoolDetails.isPoolLocked == false,
            "Senior Subpool is locked"
        );

        amount = seniorSubpoolDetails.depositedAmount.add(
            seniorSubpoolDetails.yieldGenerated
        );

        amount = amount.add(seniorSubpoolDetails.overdueGenerated);

        return amount;
    }
}
