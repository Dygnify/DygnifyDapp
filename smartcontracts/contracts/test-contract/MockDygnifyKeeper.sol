// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/OpportunityOrigination.sol";

contract MockDygnifyKeeper {
    function toCheckMarkWriteOff(
        address _opportunityOriginationAddress,
        bytes32 _id,
        address _pool
    ) external {
        OpportunityOrigination opportunityOrigination = OpportunityOrigination(
            _opportunityOriginationAddress
        );
        opportunityOrigination.markWriteOff(_id, _pool);
    }
}
