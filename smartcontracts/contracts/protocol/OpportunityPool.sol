// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LPToken.sol";
import "./DygnifyConfig.sol";
import "./BaseUpgradeablePausable.sol";

contract OpportunityPool is BaseUpgradeablePausable{
    DygnifyConfig public dygnifyConfig;
    using ConfigHelper for DygnifyConfig;

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

        _BaseUpgradeablePausable_init(owner);
        usdcToken = IERC20(dygnifyConfig.usdcAddress());
        lpToken = LPToken(dygnifyConfig.lpTokenAddress());

        opportunityID = _opportunityID;
        opportunityInfo = _opportunityInfo;
        loanType = _loanType;
        loanAmount = _loanAmount;
        loanTenureInDays = _loanTenureInDays;
        loanInterest = _loanInterest;
        paymentFrequencyInDays = _paymentFrequencyInDays;
        collateralDocument = _collateralDocument;
        capitalLoss = _capitalLoss;
    }
   
}