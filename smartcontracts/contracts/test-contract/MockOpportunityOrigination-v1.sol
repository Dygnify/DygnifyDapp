// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/DygnifyKeeper.sol";
import "../interfaces/IOpportunityPool.sol";
import "./MockOpportunityPool.sol";
import "hardhat/console.sol";

contract MockOpportunityOriginationV1 {
    bool isDrawdownBool = true;
    bool isUpkeepNeededBool = true;

    // put address of mock of opportunityPool
    // address add = 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6;
    //address add = 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9;
    address poolAddress;

    constructor(address _poolAddress) {
        poolAddress = _poolAddress;
    }

    function isDrawdown(bytes32 id) external view returns (bool) {
        if (isDrawdownBool) return true;
        else return false;
    }

    function isActive(bytes32 id) external pure returns (bool) {
        return true;
    }

    function getOpportunityPoolAddress(
        bytes32 id
    ) external view returns (address) {
        return poolAddress;
    }

    function writeOffDaysOf(bytes32 id) external view returns (uint256) {
        if (isUpkeepNeededBool) {
            return 100;
        }

        return 767678678;
    }

    function markWriteOff(bytes32 id, address add) external {}

    function toCheckAddOpportunityInKeeper(
        bytes32 _id,
        address keeperAddress,
        bool _isDrawdownBool
    ) external {
        isDrawdownBool = _isDrawdownBool;
        DygnifyKeeper keeper = DygnifyKeeper(keeperAddress);
        keeper.addOpportunityInKeeper(_id);
    }

    function toCheckRemoveOpportunityInKeeper(
        bytes32 _id,
        address keeperAddress
    ) external {
        DygnifyKeeper keeper = DygnifyKeeper(keeperAddress);
        keeper.removeOpportunityInKeeper(_id);
    }

    function toCheckCheckUpkeep(
        address keeperAddress,
        bool _isUpkeepNeededBool
    ) external returns (bool) {
        isUpkeepNeededBool = _isUpkeepNeededBool;
        DygnifyKeeper keeper = DygnifyKeeper(keeperAddress);
        (bool needed, ) = keeper.checkUpkeep("0x");

        return needed;
    }

    function toCheckperformUpkeep(address keeperAddress) external {
        DygnifyKeeper keeper = DygnifyKeeper(keeperAddress);
        keeper.performUpkeep("0x");
    }
}
