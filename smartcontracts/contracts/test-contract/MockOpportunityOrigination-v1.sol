// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/DygnifyKeeper.sol";

contract MockOpportunityOriginationV1 {
    bool isDrawdownBool = true;
    bool isUpkeepNeededBool = true;
    bool isActiveBool = true;
    bool isRepaidBool = true;
    uint256 writeOffDays;

    address poolAddress;

    constructor(address _poolAddress) {
        poolAddress = _poolAddress;
    }

    function isDrawdown(bytes32 id) external view returns (bool) {
        if (isDrawdownBool) return true;
        else return false;
    }

    function isActive(bytes32 id) external view returns (bool) {
        if (isActiveBool) return true;
        return false;
    }

    function makeIsActiveFalse() external {
        isActiveBool = false;
    }

    function getOpportunityPoolAddress(
        bytes32 id
    ) external view returns (address) {
        return poolAddress;
    }

    function setWriteOffDays(uint _writeOffDays) external {
        writeOffDays = _writeOffDays;
    }

    function writeOffDaysOf(bytes32 id) external view returns (uint256) {
        return writeOffDays;
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

    // for SeniorPool contract's testing
    function isRepaid(bytes32 id) external view returns (bool) {
        if (isRepaidBool) return true;
        return false;
    }

    function makeIsRepaidFalse() external {
        isRepaidBool = false;
    }
}
