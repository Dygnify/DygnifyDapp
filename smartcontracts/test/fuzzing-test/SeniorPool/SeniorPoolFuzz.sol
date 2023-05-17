// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/SeniorPool.sol";
import "../../../contracts/protocol/old/TestUSDCToken.sol";
import "../../../contracts/protocol/LPToken.sol";

contract SeniorPoolFuzz {
    uint amount = 10000000000;

    function echidna_test_stake() public returns (bool) {
        address seniorPoolContractAddr = 0x871DD7C2B4b25E1Aa18728e9D5f2Af4C4e431f5c;
        address lptokenContractAddr = 0x25B8Fe1DE9dAf8BA351890744FF28cf7dFa8f5e3;
        address usdcTokenContractAddr = 0xcdB594a32B1CC3479d8746279712c39D18a07FC0;
        address userAddr = 0xA8dDa8d7F5310E4A9E24F8eBA77E091Ac264f872;

        SeniorPool seniorPool = SeniorPool(seniorPoolContractAddr);

        TestUSDCToken usdcToken = TestUSDCToken(usdcTokenContractAddr);

        LPToken lptoken = LPToken(lptokenContractAddr);

        bool isStaking = seniorPool.isStaking(userAddr);

        uint seniorPoolBalance = seniorPool.seniorPoolBal();
        uint contractBalance = usdcToken.balanceOf(address(seniorPool));
        uint userLPTokenBalance = lptoken.balanceOf(userAddr);
        uint userUsdcBalance = usdcToken.balanceOf(address(userAddr));

        return isStaking && seniorPoolBalance == amount;
        contractBalance == amount &&
            userLPTokenBalance == amount &&
            userLPTokenBalance == amount &&
            userUsdcBalance == 0;
    }

    function echidna_test_withdrawTo() public returns (bool) {
        address seniorPoolContractAddr = 0xE86bB98fcF9BFf3512C74589B78Fb168200CC546;
        address usdcTokenContractAddr = 0x7e3f4E1deB8D3A05d9d2DA87d9521268D0Ec3239;
        address userAddr = 0xA8dDa8d7F5310E4A9E24F8eBA77E091Ac264f872;

        SeniorPool seniorPool = SeniorPool(seniorPoolContractAddr);

        TestUSDCToken usdcToken = TestUSDCToken(usdcTokenContractAddr);

        uint seniorPoolBalance = seniorPool.seniorPoolBal();
        uint userUsdcBalance = usdcToken.balanceOf(address(userAddr));
        uint contractBalance = usdcToken.balanceOf(address(seniorPool));

        return
            userUsdcBalance == amount &&
            contractBalance == 0 &&
            seniorPoolBalance == 0;
    }

    function echidna_test_invest() public returns (bool) {
        address seniorPoolContractAddr = 0x038F9B392Fb9A9676DbAddF78EA5fdbf6C7d9710;
        uint updatedAmount = 5 * amount;
        uint seniorPoolDepositable = 100000;
        uint expectedSeniorPoolBalance = updatedAmount - seniorPoolDepositable;

        SeniorPool seniorPool = SeniorPool(seniorPoolContractAddr);

        uint seniorPoolBalance = seniorPool.seniorPoolBal();

        return seniorPoolBalance == expectedSeniorPoolBalance;
    }

    function echidna_test_withDrawFromOpportunity() public returns (bool) {
        address seniorPoolContractAddr = 0x2C530e4Ecc573F11bd72CF5Fdf580d134d25f15F;
        uint seniorPoolWithdrawableAmount = 100000;
        uint seniorPoolProfit = 9990000;

        SeniorPool seniorPool = SeniorPool(seniorPoolContractAddr);

        uint seniorPoolBalance = seniorPool.seniorPoolBal();
        uint sharePrice = seniorPool.sharePrice();

        return (seniorPoolBalance == 3 * amount) && (sharePrice > 0);
    }
}
