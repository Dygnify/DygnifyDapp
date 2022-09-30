// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "../protocol/DygnifyConfig.sol";

interface ISeniorPool {

    function initialize(
        DygnifyConfig _dygnifyConfig
    ) external;

    function withDrawFromOpportunity(bytes32 opportunityId) external;
}


