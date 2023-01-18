// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/DygnifyConfig.sol";
import "./MockOpportunityOriginationForTestingOO.sol";
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


}
