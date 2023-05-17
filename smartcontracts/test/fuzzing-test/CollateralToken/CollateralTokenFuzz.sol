// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/CollateralToken.sol";

contract CollateralTokenFuzz is CollateralToken {
    function echidna_test_initialize() public returns (bool) {
        address CollateralTokenAddr = 0x1dC4c1cEFEF38a777b15aA20260a54E584b16C48;
        CollateralToken collateralToken = CollateralToken(CollateralTokenAddr);

        return true;
    }

    function echidna_test_safeMint() public returns (bool) {
        address CollateralTokenAddr = 0x48BaCB9266a570d521063EF5dD96e61686DbE788;
        address TokenOwnerAddr = 0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb;

        CollateralToken collateralToken = CollateralToken(CollateralTokenAddr);

        address OwnerAddr = collateralToken.ownerOf(0);

        uint256 Balance = collateralToken.balanceOf(TokenOwnerAddr);
        return TokenOwnerAddr == OwnerAddr && Balance > 0;
    }

    function echidna_test_burn() public returns (bool) {
        address CollateralTokenAddr = 0xbe0037eAf2d64fe5529BCa93c18C9702D3930376;
        address TokenOwnerAddr = 0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb;
        CollateralToken collateralToken = CollateralToken(CollateralTokenAddr);

        return TokenOwnerAddr == address(0);
    }
}
