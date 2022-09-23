// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

library Constants{

    uint256 public constant _oneYearInDays = 365;
    uint256 public constant _sixDecimal = 10**6;
    uint256 public constant _oneDay = 60 * 60 * 24;
    uint256 public constant _oneMonth = 30 * _oneDay;
    bytes32 public constant ADMIN_ROLE  = keccak256("ADMIN_ROLE");
    bytes32 public constant SENIOR_POOL_ROLE = keccak256("SENIOR_POOL_ROLE");
    bytes32 public constant BORROWER_ROLE = keccak256("BORROWER_ROLE");
    bytes32 public constant POOL_LOCKER_ROLE = keccak256("POOL_LOCKER_ROLE");
    bytes32 public constant AUTHORIZE_USER_ROLE = keccak256("AUTHORIZE_USER");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant OWNER = keccak256("OWNER");




    function oneYearInDays() internal pure returns(uint256) {
        return _oneYearInDays;
    }

    function sixDecimal() internal pure returns (uint256) {
        return _sixDecimal;
    }


    function getSeniorPoolRole() internal pure returns (bytes32) {
        return SENIOR_POOL_ROLE;
    }

    function getBorrowerRole() internal pure returns (bytes32) {
        return BORROWER_ROLE;
    }

    function getPoolLockerRole() internal pure returns (bytes32) {
        return POOL_LOCKER_ROLE;
    }
    
    function getAdminRole() internal pure returns(bytes32) {
        return ADMIN_ROLE;
    }
    // AUTHORIZE_USER_ROLE
    function getAurthorizeUser() internal pure returns(bytes32) {
        return AUTHORIZE_USER_ROLE;
    }

    function pauserRole() internal pure returns(bytes32) {
        return PAUSER_ROLE;
    }
    
    function minterRole() internal pure returns(bytes32) {
        return MINTER_ROLE;
    }

    function upgraderRole() internal pure returns(bytes32) {
        return UPGRADER_ROLE;
    }

    function getOwner() internal pure returns(bytes32) {
        return OWNER;
    }

    function oneDay() internal pure returns(uint256){
        return _oneDay;
    }

    function oneMonth() internal pure returns(uint256){
        return _oneMonth;
    }

}
