// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/ConfigHelper.sol";

contract ConfigHelperLibrary {
    function dygnifyAdminAddress(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.dygnifyAdminAddress(config);
    }

    function usdcAddress(DygnifyConfig config) external view returns (address) {
        return ConfigHelper.usdcAddress(config);
    }

    function lpTokenAddress(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.lpTokenAddress(config);
    }

    function seniorPoolAddress(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.seniorPoolAddress(config);
    }

    function poolImplAddress(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.poolImplAddress(config);
    }

    function collateralTokenAddress(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.collateralTokenAddress(config);
    }

    function getLeverageRatio(
        DygnifyConfig config
    ) external view returns (uint256) {
        return ConfigHelper.getLeverageRatio(config);
    }

    function getOverDueFee(
        DygnifyConfig config
    ) external view returns (uint256) {
        return ConfigHelper.getOverDueFee(config);
    }

    function getSeniorPoolLockinMonths(
        DygnifyConfig config
    ) external view returns (uint256) {
        return ConfigHelper.getSeniorPoolLockinMonths(config);
    }

    function getOpportunityOrigination(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.getOpportunityOrigination(config);
    }

    function getDygnifyFee(
        DygnifyConfig config
    ) external view returns (uint256) {
        return ConfigHelper.getDygnifyFee(config);
    }

    function getJuniorSubpoolFee(
        DygnifyConfig config
    ) external view returns (uint256) {
        return ConfigHelper.getJuniorSubpoolFee(config);
    }

    function investorContractAddress(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.investorContractAddress(config);
    }

    function dygnifyTreasuryAddress(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.dygnifyTreasuryAddress(config);
    }

    function dygnifyKeeperAddress(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.dygnifyKeeperAddress(config);
    }

    function identityTokenAddress(
        DygnifyConfig config
    ) external view returns (address) {
        return ConfigHelper.identityTokenAddress(config);
    }

    function getWriteOffDays(
        DygnifyConfig config
    ) external view returns (uint256) {
        return ConfigHelper.getWriteOffDays(config);
    }

    function getUnderwriterFee(
        DygnifyConfig config
    ) external view returns (uint256) {
        return ConfigHelper.getUnderwriterFee(config);
    }
}
