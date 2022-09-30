// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "../protocol/DygnifyConfig.sol";

interface ISeniorPool {

    function withDrawFromOpportunity(bool _isWriteOff, bytes32 opportunityId, uint256 _amount) external;
}


