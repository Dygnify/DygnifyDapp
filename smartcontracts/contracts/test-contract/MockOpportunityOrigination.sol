// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/DygnifyKeeper.sol";
import "../protocol/OpportunityPool.sol";

contract MockOpportunityOrigination {
    address poolAddress;
    bool isDrawdownBool = false;
    bool isUpkeepNeededBool = true;
    bool isActiveBool = true;
    bool isRepaidBool = true;
    uint256 writeOffDays;

    address borrowerAddress;
    bool drawDown;

    constructor(address _borrowerAddress) {
        borrowerAddress = _borrowerAddress;
    }

    function setPoolAddress(address _poolAddress) external {
        poolAddress = _poolAddress;
    }

    function isDrawdown(bytes32 /* id */) public view returns (bool) {
        return drawDown;
    }

    function setIsDrawdown(bool val) external {
        drawDown = val;
    }

    function isActive(bytes32 /* id */) external view returns (bool) {
        if (isActiveBool) return true;
        return false;
    }

    function makeIsActiveFalse() external {
        isActiveBool = false;
    }

    function getOpportunityPoolAddress(
        bytes32 /* id */
    ) external view returns (address) {
        return poolAddress;
    }

    function setWriteOffDays(uint _writeOffDays) external {
        writeOffDays = _writeOffDays;
    }

    function writeOffDaysOf(bytes32 /* id */) external view returns (uint256) {
        return writeOffDays;
    }

    function markWriteOff(bytes32 id, address add) external {}

    function markdrawDown(bytes32 _id, address keeperAddress) external {
        IDygnifyKeeper(keeperAddress).addOpportunityInKeeper(_id);
    }

    function markDrawDown(bytes32 /* id */) external {
        drawDown = true;
    }

    function markrepaid(bytes32 _id, address keeperAddress) external {
        IDygnifyKeeper(keeperAddress).removeOpportunityInKeeper(_id);
    }

    function markRepaid(bytes32 /* id */) external {}

    function isRepaid(bytes32 /* id */) external view returns (bool) {
        if (isRepaidBool) return true;
        return false;
    }

    function makeIsRepaidFalse() external {
        isRepaidBool = false;
    }

    function getBorrower(bytes32 /* id */) external view returns (address) {
        return borrowerAddress;
    }

    function isWriteOff(bytes32 /* id */) external pure returns (bool) {
        return true;
    }

    function writeOffOpportunity(address _opportunityPool) external {
        OpportunityPool opportunityPool = OpportunityPool(_opportunityPool);
        opportunityPool.writeOffOpportunity();
    }
}
