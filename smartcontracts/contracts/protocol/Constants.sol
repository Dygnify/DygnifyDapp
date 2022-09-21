// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

library Constants {
    uint256 public constant _oneYearInDays = 365;
    uint256 public constant _sixDecimal = 10**6;
    bytes32 public constant SENIOR_POOL_ROLE = keccak256("SENIOR_POOL_ROLE");
    bytes32 public constant BORROWER_ROLE = keccak256("BORROWER_ROLE");
    bytes32 public constant POOL_LOCKER_ROLE = keccak256("POOL_LOCKER_ROLE");

    function oneYearInDays() internal view returns (uint256) {
        return _oneYearInDays;
    }

    function sixDecimal() internal view returns (uint256) {
        return _sixDecimal;
    }

    function getSeniorPoolRole() internal view returns (bytes32) {
        return SENIOR_POOL_ROLE;
    }

    function getBorrowerRole() internal view returns (bytes32) {
        return BORROWER_ROLE;
    }

    function getPoolLockerRole() internal view returns (bytes32) {
        return POOL_LOCKER_ROLE;
    }
}
