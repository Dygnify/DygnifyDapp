// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/Borrower.sol";

contract BorrowerFuzz {
    Borrower borrower = Borrower(0x1dC4c1cEFEF38a777b15aA20260a54E584b16C48);

    function echidna_test_borrower() public returns (bool) {
        return
            keccak256(
                abi.encodePacked(
                    borrower.borrowerProfile(
                        0x5409ED021D9299bf6814279A6A1411A7e866A631
                    )
                )
            ) == keccak256(abi.encodePacked("123"));
    }
}
