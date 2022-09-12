// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./BaseUpgradeablePausable.sol";
import "./ConfigHelper.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./DygnifyConfig.sol";
import "../interfaces/IOpportunityOrigination.sol";
import "../interfaces/IOpportunityPool.sol";
import "../interfaces/IDygnifyKeeper.sol";

contract DygnifyKeeper is BaseUpgradeablePausable, KeeperCompatibleInterface, IDygnifyKeeper  {
    DygnifyConfig private dygnifyConfig;
    using ConfigHelper for DygnifyConfig;
    IOpportunityOrigination private opportunityOrigination;

    uint256 private threshold;
    bytes32[] private drawdownOpportunites;
    bool private stopKeeper; 

    // @notice initializes the contract
    // @param DygnifyConfig : dygnify config address 
    // @param _threshold : no. of allowable days for writeoff 
    function initialize(DygnifyConfig _dygnifyConfig, uint256 _threshold) public initializer {
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
        threshold = _threshold * 86400; //converting days in second
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        bool isUpkeepNeeded;
        for(uint i = 0 ; i < drawdownOpportunites.length ; i++){
            uint dueTime = IOpportunityPool(opportunityOrigination.getOpportunityPoolAddress(drawdownOpportunites[i])).nextRepaymentTime();
            if(dueTime < block.timestamp){
                uint timePassed = block.timestamp-dueTime;
                if(timePassed > threshold){
                    isUpkeepNeeded = true;
                    break;
                }
            }
        }
        upkeepNeeded = stopKeeper == false && isUpkeepNeeded;
    }

    function performUpkeep(bytes calldata /* performData */) external nonReentrant override {
        stopKeeper = true;
        for(uint i = 0 ; i < drawdownOpportunites.length ; i++){
            uint dueTime = IOpportunityPool(opportunityOrigination.getOpportunityPoolAddress(drawdownOpportunites[i])).nextRepaymentTime();
            if(dueTime < block.timestamp){
                uint timePassed = block.timestamp-dueTime;
                if(timePassed > threshold){
                    opportunityOrigination.markWriteOff(drawdownOpportunites[i], opportunityOrigination.getOpportunityPoolAddress(drawdownOpportunites[i]));
                    drawdownOpportunites[i] = drawdownOpportunites[drawdownOpportunites.length - 1];
                    delete drawdownOpportunites[drawdownOpportunites.length - 1];
                }
            }
        }
        stopKeeper = false;
    }

    function addOpportunityInKeeper(bytes32 _id) external override {
        require(opportunityOrigination.isDrawdown(_id) == true, "opportunity is not drawdown");
        require(msg.sender == dygnifyConfig.getOpportunityOrigination(), "opportunityOrigination contract can add the opportunity in keeper");

        drawdownOpportunites.push(_id);
    }

    function removeOpportunityInKeeper(bytes32 _id) public override {
        require(opportunityOrigination.isDrawdown(_id) == true, "opportunity doesn't exist");
        require(msg.sender == dygnifyConfig.getOpportunityOrigination(), "opportunityOrigination contract can add the opportunity in keeper");

        for(uint i = 0 ; i < drawdownOpportunites.length ; i++){
            if(drawdownOpportunites[i] == _id){
                drawdownOpportunites[i] = drawdownOpportunites[drawdownOpportunites.length - 1];
                delete drawdownOpportunites[drawdownOpportunites.length - 1];
            }
        }
    }
}
