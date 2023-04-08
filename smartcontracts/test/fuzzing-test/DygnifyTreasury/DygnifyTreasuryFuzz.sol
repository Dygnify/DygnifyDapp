// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/DygnifyTreasury.sol";

contract DygnifyTreasuryFuzz is DygnifyTreasury {
    //     function echidna_test_getTreasuryBalance() public returns (bool) {
    //         uint256 Amount = 50000000000000;

    //         address DygnifyTreasuryAddr = 0x34D402F14D58E001D8EfBe6585051BF9706AA064;
    //         DygnifyTreasury dygnifyTreasury = DygnifyTreasury(DygnifyTreasuryAddr);
    //         uint256 TreasuryBalance = dygnifyTreasury.getTreasuryBalance();
    //         return TreasuryBalance == Amount;
    //     }

    function echidna_test_withdraw() public returns (bool) {
        uint256 Amount = 100000000000000;
        address DygnifyTreasuryAddr = 0x8d61158a366019aC78Db4149D75FfF9DdA51160D;
        address UserAddr = 0xE834EC434DABA538cd1b9Fe1582052B880BD7e63;
        // uint256 UpdatedAmount = Amount - 50000000000000;
        uint256 WithdrawalAmount = 50000000000000;
        DygnifyTreasury dygnifyTreasury = DygnifyTreasury(DygnifyTreasuryAddr);

        dygnifyTreasury.withdraw(UserAddr, WithdrawalAmount);
        uint256 UpdatedTreasuryBalance = dygnifyTreasury.getTreasuryBalance();

        return UpdatedTreasuryBalance < Amount;
    }
}
