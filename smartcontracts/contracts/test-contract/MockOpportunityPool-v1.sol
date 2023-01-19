// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/DygnifyConfig.sol";
import "./MockOpportunityOriginationForTestingOO.sol";
import "../protocol/SeniorPool.sol";
import "hardhat/console.sol";

contract MockOpportunityPoolV1 {
    function getYourAddress() external view returns (address) {
        return address(this);
    }

    function nextRepaymentTime() external pure returns (uint256) {
        return 8640000;
    }

    function getSeniorTotalDepositable() external pure returns (uint256) {
        return 1000000;
    }

    // for opportunity origination's testing
    function deposit(uint8 _subpoolId, uint256 amount) external {}

    function writeOffOpportunity() external {}

    function toCheckMarkDrawDown(bytes32 id, address oppoOAddress) external {
        MockOpportunityOriginationForTestingOO oo = MockOpportunityOriginationForTestingOO(
                oppoOAddress
            );

        oo.markDrawDown(id);
    }

    function toCheckMarkRepaid(bytes32 id, address oppoOAddress) external {
        MockOpportunityOriginationForTestingOO oo = MockOpportunityOriginationForTestingOO(
                oppoOAddress
            );

        oo.markRepaid(id);
    }

    function toCheckmarkWriteOff(
        bytes32 _id,
        address poolAddress,
        address oppoOAddress
    ) external {
        MockOpportunityOriginationForTestingOO oo = MockOpportunityOriginationForTestingOO(
                oppoOAddress
            );

        oo.markWriteOff(_id, poolAddress);
    }

    // for seniorPool contract's testing
    function toCheckwithDrawFromOpportunity(
        bool _isWriteOff,
        bytes32 opportunityId,
        uint256 _amount,
        address _seniorPoolAddress
    ) external {
        SeniorPool sp = SeniorPool(_seniorPoolAddress);
        sp.withDrawFromOpportunity(_isWriteOff, opportunityId, _amount);
    }

    function getSeniorPoolWithdrawableAmount() external pure returns (uint256) {
        return 10000000;
    }

    function getSeniorProfit() external pure returns (uint256) {
        return 9990000;
    }
}
