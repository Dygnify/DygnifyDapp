// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/ILPToken.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./DygnifyConfig.sol";
import "./BaseUpgradeablePausable.sol";
import "../interfaces/IOpportunityOrigination.sol";
import "../interfaces/IOpportunityPool.sol";
import "./ConfigOptions.sol";
import "./Constants.sol";
import "../interfaces/ISeniorPool.sol";

/// @title SeniorPool
/// @author DNyanesh Warade
/// @notice This contract creates a dygnify staking dApp that rewards users for
///         locking up their USDC stablecoin with Dygnify

contract SeniorPool is BaseUpgradeablePausable, ISeniorPool {
    using SafeMathUpgradeable for uint256;
    DygnifyConfig private dygnifyConfig;
    using ConfigHelper for DygnifyConfig;
    IOpportunityOrigination private opportunityOrigination;

    struct InvestmentTimestamp {
        uint256 timestamp;
        uint256 amount;
    }

    struct KYC {
        bool isDoucument;
        bool isLiveliness;
        bool isAddress;
        bool isAML;
        bool imageHash;
        bool result;
    }

    // userAddress => InvestmentTimestamp
    mapping(address => InvestmentTimestamp[]) private stackingAmount;
    // userAddress => amount available for Withdrawal
    mapping(address => uint256) private availableForWithdrawal;
    // userAddress => isStaking boolean
    mapping(address => bool) public isStaking;
    // userAddress => yieldBalance
    mapping(address => uint256) private usdcYield;
    mapping(address => KYC) public kycOf;

    string public contractName = "Senior Pool";
    IERC20 private usdcToken;
    ILPToken private lpToken;
    uint256 public investmentLockinInMonths;
    uint256 public seniorPoolBal;
    uint256 public sharePrice;

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event YieldWithdraw(address indexed to, uint256 amount);

    function initialize(DygnifyConfig _dygnifyConfig) public initializer {
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

        _BaseUpgradeablePausable_init(owner);
        usdcToken = IERC20(dygnifyConfig.usdcAddress());
        lpToken = ILPToken(dygnifyConfig.lpTokenAddress());
        investmentLockinInMonths = dygnifyConfig.getSeniorPoolLockinMonths();
        sharePrice = 0;
    }

    /// @notice Locks the user's USDC within the contract
    /// @dev If the user already staked USDC, then calculate the previous yeild first
    /// @param amount Quantity of USDC the user wishes to lock in the contract
    function stake(uint256 amount) external {
        require(
            amount > 0 && usdcToken.balanceOf(msg.sender) >= amount,
            "You cannot stake zero tokens"
        );

        stackingAmount[msg.sender].push(
            InvestmentTimestamp(block.timestamp, amount)
        );
        isStaking[msg.sender] = true;
        seniorPoolBal = seniorPoolBal + amount;
        usdcToken.transferFrom(msg.sender, address(this), amount);
        address minter = msg.sender;
        lpToken.mint(minter, amount);
        emit Stake(msg.sender, amount);
    }

    function withdrawTo(uint256 amount, address _receiver) public onlyAdmin {
        require(
            usdcToken.balanceOf(address(this)) >= amount,
            "Insufficient Balance"
        );
        seniorPoolBal = seniorPoolBal - amount;
        usdcToken.transfer(_receiver, amount);
    }

    function invest(bytes32 opportunityId) public onlyAdmin {
        require(
            opportunityOrigination.isActive(opportunityId) == true,
            "Opportunity is not active for funding"
        );
        // also need check whether Opportunity is already funded by senior pool.
        address poolAddress = opportunityOrigination.getOpportunityPoolAddress(
            opportunityId
        );
        IOpportunityPool opportunityPool = IOpportunityPool(poolAddress);
        uint256 amount = opportunityPool.getSeniorTotalDepositable();

        require(amount <= seniorPoolBal, "insufficient Pool balance");
        seniorPoolBal = seniorPoolBal - amount;

        opportunityPool.deposit(1, amount); //hardcoded val of 1 need to be converted into variable
    }

    function withDrawFromOpportunity(bool _isWriteOff, bytes32 opportunityId, uint256 _amount) public override{
        require(
            opportunityOrigination.isRepaid(opportunityId) == true || _isWriteOff == true,
            "Opportunity is not repaid by borrower."
        );
        address poolAddress = opportunityOrigination.getOpportunityPoolAddress(
            opportunityId
        );
        IOpportunityPool opportunityPool = IOpportunityPool(poolAddress);
        require(
            msg.sender == poolAddress, "only Opportunity Pool can withdraw." 
        );

        //calculate the shareprice
        uint256 totalProfit;
        if(_isWriteOff == true)totalProfit = _amount;
        else totalProfit = opportunityPool.getSeniorProfit();
        uint256 _totalShares = lpToken.totalShares();
        uint256 delta = totalProfit.mul(lpMantissa()).div(_totalShares);
        sharePrice = sharePrice.add(delta);

        if(_isWriteOff == false){
            uint256 withdrawlAmount = opportunityPool.withdrawAll(1); //hardcoded val of 1 need to be converted into variable
            seniorPoolBal = seniorPoolBal + withdrawlAmount;
        }
        else{
            seniorPoolBal = seniorPoolBal + _amount;
        }
    }

    function approveUSDC(address user) public onlyAdmin {
        usdcToken.approve(
            user,
            115792089237316195423570985008687907853269984665640564039457584007913129639935
        );
    }

    /// Get the investment overview of the user
    function getUserInvestment()
        external
        view
        returns (uint256 withdrawableAmt, uint256 stakingAmt)
    {
        require(
            isStaking[msg.sender] == true,
            "User has not staked any amount"
        );

        uint256 stakingAmount;
        uint256 withdrawableAmount;
        uint256 lockinTime = investmentLockinInMonths * Constants.oneMonth();
        InvestmentTimestamp[] memory arr = stackingAmount[msg.sender];
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i].timestamp + lockinTime <= block.timestamp) {
                withdrawableAmount += arr[i].amount;
            } else {
                stakingAmount += arr[i].amount;
            }
        }
        if (availableForWithdrawal[msg.sender] > 0) {
            withdrawableAmount += availableForWithdrawal[msg.sender];
        }

        return (withdrawableAmount, stakingAmount);
    }

    function getDefaultLockinMonths() external view returns (uint256) {
        return investmentLockinInMonths;
    }

    function getTotalStakingBal() internal view returns (uint256) {
        require(
            isStaking[msg.sender] == true,
            "User has not staked any amount"
        );
        uint256 amount;
        InvestmentTimestamp[] memory arr = stackingAmount[msg.sender];
        for (uint256 i = 0; i < arr.length; i++) {
            amount += arr[i].amount;
        }

        return amount;
    }

    // Withdraw of funds in user wallet
    function withdrawWithLP(uint256 amount) external {
        require(
            isStaking[msg.sender] == true && amount > 0,
            "User has not invested in this pool or amount should be greater than 0"
        );

        // calculate the amount available for investment first
        uint256 stakingAmount;
        uint256 lockinTime = investmentLockinInMonths * Constants.oneMonth();
        InvestmentTimestamp[] storage arr = stackingAmount[msg.sender];
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i].timestamp + lockinTime <= block.timestamp) {
                availableForWithdrawal[msg.sender] += arr[i].amount;
                delete arr[i];
            } else {
                stakingAmount += arr[i].amount;
            }
        }

        require(
            availableForWithdrawal[msg.sender] >= amount,
            "Withdraw amount is higher than amount available for withdraw"
        );

        availableForWithdrawal[msg.sender] -= amount;

        if (
            getTotalStakingBal() == 0 && availableForWithdrawal[msg.sender] == 0
        ) {
            isStaking[msg.sender] = false;
        }

        // burn the lp token equivalent to amount
        lpToken.burn(msg.sender, amount);

        // Calculate the total USDC based on shareprice
        uint256 usdcAmount = getUSDCAmountFromShares(amount);
        usdcToken.transfer(msg.sender, usdcAmount);
        emit Unstake(msg.sender, amount);
    }

    function totalShares() internal view returns (uint256) {
        require(
            address(lpToken) != address(0),
            "Senior Pool Contract not initialized properly"
        );
        return lpToken.totalShares();
    }

    function lpMantissa() internal pure returns (uint256) {
        return uint256(10)**uint256(6);
    }

    function getUSDCAmountFromShares(uint256 amount)
        internal
        view
        returns (uint256)
    {
        return amount.add(amount.mul(sharePrice).div(lpMantissa()));
    }
}
