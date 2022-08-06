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
        OpportunityOrigination
    }

    enum Numbers {
        LeverageRatio,
        DygnifyFee,
        overDueFee,
        JuniorSubpoolFee
    }
}
