// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import"./LPToken.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./DygnifyConfig.sol";
import "./BaseUpgradeablePausable.sol";
import "./OpportunityOrigination.sol";
import "./OpportunityPool.sol";

/// @title SeniorPool
/// @author DNyanesh Warade
/// @notice This contract creates a dygnify staking dApp that rewards users for
///         locking up their USDC stablecoin with Dygnify 

contract SeniorPool is BaseUpgradeablePausable, UUPSUpgradeable{
    using SafeMathUpgradeable for uint256;
    DygnifyConfig public dygnifyConfig;
    using ConfigHelper for DygnifyConfig;
    OpportunityOrigination public opportunityOrigination;

    // userAddress => stakingBalance
    mapping(address => uint256) public stakingBalance;
    // userAddress => isStaking boolean
    mapping(address => bool) public isStaking;
    // userAddress => timeStamp
    mapping(address => uint256) public startTime;
    // userAddress => yieldBalance
    mapping(address => uint256) public usdcYield;

    string public contractName = "Senior Pool";
    IERC20 public usdcToken;
    LPToken public lpToken;
    uint public APR;
    uint public seniorPoolBal;

    uint256 public sharePrice;

    struct KYC{
        bool isDoucument;
        bool isLiveliness;
        bool isAddress;
        bool isAML;
        bool imageHash;
        bool result;
    }

    mapping(address => KYC) public kycOf; 

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event YieldWithdraw(address indexed to, uint256 amount);

    function initialize(DygnifyConfig _dygnifyConfig, uint _APR) public initializer {
        dygnifyConfig = _dygnifyConfig;
        address owner = dygnifyConfig.dygnifyAdminAddress();
        require(owner != address(0), "Invalid Owner");
        opportunityOrigination = OpportunityOrigination(
            dygnifyConfig.getOpportunityOrigination()
        );

        _BaseUpgradeablePausable_init(owner);
        usdcToken = IERC20(dygnifyConfig.usdcAddress());
        lpToken = LPToken(dygnifyConfig.lpTokenAddress());

        APR = _APR;
        sharePrice = 10**18;
    }

    function _authorizeUpgrade(address newImplementation)internal override {}

    function changeAPR(uint _APR)  public onlyAdmin{
        APR = _APR;
    }

    /// @notice Locks the user's USDC within the contract
    /// @dev If the user already staked USDC, then calculate the previous yeild first
    /// @param amount Quantity of USDC the user wishes to lock in the contract
    function stake(uint256 amount) public {
        require(
            amount > 0 && usdcToken.balanceOf(msg.sender) >= amount,
            "You cannot stake zero tokens"
        );

        // if (isStaking[msg.sender] == true) {
        //     uint256 toTransfer = calculateYieldTotal(msg.sender);
        //     usdcYield[msg.sender] += toTransfer;
        // }
        
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        seniorPoolBal = seniorPoolBal + amount;
        usdcToken.transferFrom(msg.sender, address(this), amount);
        address minter = msg.sender;
        uint lpTokenAmount = getNumShares(amount); 
        lpToken.mint(minter, lpTokenAmount);
        emit Stake(msg.sender, amount);
    }

    function withdrawTo(uint256 amount, address _receiver)  public onlyAdmin {
        require(
                usdcToken.balanceOf(address(this)) >= amount,
                "Insufficient Balance"
        );
        seniorPoolBal = seniorPoolBal - amount;
        usdcToken.transfer( _receiver, amount);
    } 

    function invest(bytes32 opportunityId) public onlyAdmin{
        require(opportunityOrigination.isActive(opportunityId) == true, "Opportunity is not active for funding");
        // also need check whether Opportunity is already funded by senior pool.
        address poolAddress = opportunityOrigination.getOpportunityPoolAddress(opportunityId);
        OpportunityPool opportunityPool = OpportunityPool(poolAddress);
        uint256 amount = opportunityPool.getSeniorTotalDepositable();
        
        require(amount <= seniorPoolBal, "insufficient Pool balance");
        seniorPoolBal = seniorPoolBal - amount;

        opportunityPool.deposit(1, amount); //hardcoded val of 1 need to be converted into variable
    }

    function withDrawFromOpportunity(bytes32 opportunityId) public onlyAdmin{
        require(opportunityOrigination.isRepaid(opportunityId) == true, "Opportunity is not repaid by borrower.");
        address poolAddress = opportunityOrigination.getOpportunityPoolAddress(opportunityId);
        OpportunityPool opportunityPool = OpportunityPool(poolAddress);

        uint256 withdrawlAmount = opportunityPool.withdrawAll(1);  //hardcoded val of 1 need to be converted into variable

        seniorPoolBal = seniorPoolBal + withdrawlAmount;
        uint256 totalProfit = usdcToLp(opportunityPool.getSeniorProfit());

        uint256 _totalShares = lpToken.totalShares();
        uint256 delta = totalProfit.mul(10**18).div(_totalShares);

        sharePrice = sharePrice.add(delta);
    }

    function lPMantissa() internal pure returns (uint256) {
        return uint256(10)**uint256(18);
    }

    function usdcMantissa() internal pure returns (uint256) {
        return uint256(10)**uint256(6);
    }

    function usdcToLp(uint256 amount) internal pure returns (uint256) {
        return amount.mul(lPMantissa()).div(usdcMantissa());
    }

    function lpToUSDC(uint256 amount) internal pure returns (uint256) {
        return amount.div(lPMantissa().div(usdcMantissa()));
    }

    function getNumShares(uint256 amount) public view  returns (uint256) {
        return usdcToLp(amount).mul(lPMantissa()).div(sharePrice);
    }

    function approveUSDC(address user)public onlyAdmin{
        usdcToken.approve(user, 115792089237316195423570985008687907853269984665640564039457584007913129639935);
    }

}