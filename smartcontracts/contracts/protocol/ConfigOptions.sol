// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

library ConfigOptions {
    // NEVER EVER CHANGE THE ORDER OF THESE!
    // You can rename or append. But NEVER change the order.
    enum Addresses {
        DygnifyAdmin,
        LPToken,
        USDCToken,
        SeniorPool,
        PoolImplAddress,
        CollateralToken,
        OpportunityOrigination,
        InvestorContract,
        DygnifyTreasury,
        DygnifyKeeper,
        IdentityToken,
        MultiSign
    }

    enum Numbers {
        LeverageRatio,
        DygnifyFee,
        OverDueFee,
        JuniorSubpoolFee,
        SeniorPoolFundLockinMonths,
        WriteOffDays,
        AdjustmentOffset
    }
}
