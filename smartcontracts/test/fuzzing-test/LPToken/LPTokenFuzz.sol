// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/old/TestUSDCToken.sol";
import "../../../contracts/protocol/LPToken.sol";

contract LPTokenFuzz {
    uint amount = 10000000000;

    function echidna_test_mint() public returns (bool) {
        address lptokenContractAddr = 0x871DD7C2B4b25E1Aa18728e9D5f2Af4C4e431f5c;
        address usdcTokenContractAddr = 0x0B1ba0af832d7C05fD64161E0Db78E85978E8082;
        address userAddr = 0xE834EC434DABA538cd1b9Fe1582052B880BD7e63;

        LPToken lptoken = LPToken(lptokenContractAddr);

        uint currentShare = lptoken.totalShares();

        return currentShare == amount;
    }

    function echidna_test_burn() public returns (bool) {
        address lptokenContractAddr = 0x07f96Aa816C1F244CbC6ef114bB2b023Ba54a2EB;
        address usdcTokenContractAddr = 0x6A4A62E5A7eD13c361b176A5F62C2eE620Ac0DF8;
        address userAddr = 0xE834EC434DABA538cd1b9Fe1582052B880BD7e63;

        LPToken lptoken = LPToken(lptokenContractAddr);

        uint currentShare = lptoken.totalShares();

        return currentShare == 0;
    }
}
