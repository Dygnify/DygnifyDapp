// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/OpportunityPool.sol";

contract MockOpportunityOriginationForOpportunityPool {
    address borrowerAddress;
    bool drawDown;

    constructor(address _borrowerAddress) {
        borrowerAddress = _borrowerAddress;
    }

    function getBorrower(bytes32 /* id */) external view returns (address) {
        return borrowerAddress;
    }

    function isDrawdown(bytes32 /* id */) public view returns (bool) {
        return drawDown;
    }

    function markDrawDown(bytes32 /* id */) external {
        drawDown = true;
    }

    function markRepaid(bytes32 /* id */) external {}

    function isRepaid(bytes32 /* id */) external pure returns (bool) {
        return true;
    }

    function isWriteOff(bytes32 /* id */) external pure returns (bool) {
        return true;
    }

    function writeOffOpportunity(address _opportunityPool) external {
        OpportunityPool opportunityPool = OpportunityPool(_opportunityPool);
        opportunityPool.writeOffOpportunity();
    }
}
