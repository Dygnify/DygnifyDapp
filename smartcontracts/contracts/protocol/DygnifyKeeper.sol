// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./BaseUpgradeablePausable.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./DygnifyConfig.sol";
import "../interfaces/IOpportunityOrigination.sol";
import "../interfaces/IOpportunityPool.sol";
import "../interfaces/IDygnifyKeeper.sol";

contract DygnifyKeeper is
    BaseUpgradeablePausable,
    KeeperCompatibleInterface,
    IDygnifyKeeper
{
    DygnifyConfig private dygnifyConfig;
    using ConfigHelper for DygnifyConfig;
    IOpportunityOrigination private opportunityOrigination;
    
    bytes32[] private drawdownOpportunites;
    bool private stopKeeper;

    // @notice initializes the contract
    // @param DygnifyConfig : dygnify config address
    function initialize(DygnifyConfig _dygnifyConfig)
        public
        initializer
    {
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
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        override
        view
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isUpkeepNeeded;
        for (uint256 i = 0; i < drawdownOpportunites.length; i++) {
            uint256 dueTime = IOpportunityPool(
                opportunityOrigination.getOpportunityPoolAddress(
                    drawdownOpportunites[i]
                )
            )
                .nextRepaymentTime();
            if (dueTime < block.timestamp) {
                uint opportunityThreshold = opportunityOrigination.writeOffDaysOf( 
                        drawdownOpportunites[i]
                ) * 86400;
                uint256 timePassed = block.timestamp - dueTime;
                if (timePassed > opportunityThreshold) {
                    isUpkeepNeeded = true;
                    break;
                }
            }
        }
        upkeepNeeded = stopKeeper == false && isUpkeepNeeded;
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override nonReentrant {
        stopKeeper = true;
        for (uint256 i = 0; i < drawdownOpportunites.length; i++) {
            uint256 dueTime = IOpportunityPool(
                opportunityOrigination.getOpportunityPoolAddress(
                    drawdownOpportunites[i]
                )
            )
                .nextRepaymentTime();
            if (dueTime < block.timestamp) {
                uint opportunityThreshold = opportunityOrigination.writeOffDaysOf( 
                        drawdownOpportunites[i]
                ) * 86400;
                uint256 timePassed = block.timestamp - dueTime;
                if (timePassed > opportunityThreshold) {
                    opportunityOrigination.markWriteOff(
                        drawdownOpportunites[i],
                        opportunityOrigination.getOpportunityPoolAddress(
                            drawdownOpportunites[i]
                        )
                    );
                    drawdownOpportunites[i] = drawdownOpportunites[drawdownOpportunites
                        .length - 1];
                    delete drawdownOpportunites[drawdownOpportunites.length -
                        1];
                }
            }
        }
        stopKeeper = false;
    }

    function addOpportunityInKeeper(bytes32 _id) external override {
        require(
            opportunityOrigination.isDrawdown(_id) == true,
            "opportunity is not drawdown"
        );
        require(
            msg.sender == dygnifyConfig.getOpportunityOrigination(),
            "opportunityOrigination contract can add the opportunity in keeper"
        );

        drawdownOpportunites.push(_id);
    }

    function removeOpportunityInKeeper(bytes32 _id) public override {
        require(
            msg.sender == dygnifyConfig.getOpportunityOrigination(),
            "opportunityOrigination contract can add the opportunity in keeper"
        );

        for (uint256 i = 0; i < drawdownOpportunites.length; i++) {
            if (drawdownOpportunites[i] == _id) {
                drawdownOpportunites[i] = drawdownOpportunites[drawdownOpportunites
                    .length - 1];
                delete drawdownOpportunites[drawdownOpportunites.length - 1];
            }
        }
    }
}
