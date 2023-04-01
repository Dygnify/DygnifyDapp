// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/OpportunityPool.sol";
import "../../../contracts/protocol/old/TestUSDCToken.sol";

contract OpportunityPoolFuzz {
    OpportunityPool opportunityPool;
    TestUSDCToken usdcToken;

    function echidna_test_seniorpool_deposit() public returns (bool) {
        opportunityPool = OpportunityPool(
            0x0B1ba0af832d7C05fD64161E0Db78E85978E8082
        );
        usdcToken = TestUSDCToken(0x25B8Fe1DE9dAf8BA351890744FF28cf7dFa8f5e3);

        uint256 poolBalance = opportunityPool.poolBalance();
        uint256 usdcBalance = usdcToken.balanceOf(address(opportunityPool));
        return poolBalance == 8000000000000 && usdcBalance == 8000000000000;
    }

    function echidna_test_juniorpool_deposit() public returns (bool) {
        opportunityPool = OpportunityPool(
            0x6346e3A22D2EF8feE3B3c2171367490e52d81C52
        );
        usdcToken = TestUSDCToken(0xA31E64EA55B9B6Bbb9d6A676738e9A5b23149f84);

        uint256 poolBalance = opportunityPool.poolBalance();
        uint256 usdcBalance = usdcToken.balanceOf(address(opportunityPool));
        return poolBalance == 2000000000000 && usdcBalance == 2000000000000;
    }

    function echidna_test_drawdown() public returns (bool) {
        opportunityPool = OpportunityPool(
            0xe704967449b57b2382B7FA482718748c13C63190
        );
        usdcToken = TestUSDCToken(0x72D5A2213bfE46dF9FbDa08E22f536aC6Ca8907e);

        uint256 poolBalance = opportunityPool.poolBalance();
        uint256 usdcBalance = usdcToken.balanceOf(address(opportunityPool));
        return poolBalance == 0 && usdcBalance == 0;
    }

    function echidna_test_term_loan_repayment() public returns (bool) {
        opportunityPool = OpportunityPool(
            0x1a488d7B42C1Ec1539b78f772BF13eCCB723f5fa
        );
        usdcToken = TestUSDCToken(0xBDFcAAd0072d2976C9Eaee1a5c36BECC888738c8);

        uint256 previousOutstandingPrincipal = 10000000000000;
        uint256 previousRepaymentCounter = 1;
        uint256 beforeSeniorYield = 0;
        uint256 beforeJuniorYield = 0;
        uint256 beforeBorrowerUsdcBalance = 60000000000000;

        uint256 afterOutstandingPrincipal = opportunityPool
            .totalOutstandingPrincipal();
        uint256 afterRepaymentCounter = opportunityPool.repaymentCounter();
        (, , , , , uint256 afterSeniorYield, ) = opportunityPool
            .seniorSubpoolDetails();
        (, , , , , uint256 afterJuniorYield, ) = opportunityPool
            .juniorSubpoolDetails();
        uint256 afterBorrowerUsdcBalance = usdcToken.balanceOf(
            0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb
        );
        return
            previousOutstandingPrincipal - afterOutstandingPrincipal ==
            1632280608502 &&
            afterRepaymentCounter - previousRepaymentCounter == 1 &&
            afterSeniorYield - beforeSeniorYield == 46666666666 &&
            afterJuniorYield - beforeJuniorYield == 28333333333 &&
            beforeBorrowerUsdcBalance - afterBorrowerUsdcBalance ==
            opportunityPool.getRepaymentAmount() &&
            usdcToken.balanceOf(0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84) ==
            8333333333;
    }

    function echidna_test_term_loan_all_repayment() public returns (bool) {
        opportunityPool = OpportunityPool(
            0xB4B163AD1E3703D34cA1a428a10e680f302a5692
        );
        (, , uint256 totalDepositedAmount, , , , ) = opportunityPool
            .seniorSubpoolDetails();
        (, , , , , uint256 seniorYieldGenerated, ) = opportunityPool
            .seniorSubpoolDetails();
        (, , , , , uint256 juniorYieldGenerated, ) = opportunityPool
            .juniorSubpoolDetails();

        return
            totalDepositedAmount == 0 &&
            opportunityPool.totalOutstandingPrincipal() < 500 &&
            seniorYieldGenerated == 0 &&
            juniorYieldGenerated == 99852441383;
    }

    function echidna_test_bullet_loan_repayment() public returns (bool) {
        opportunityPool = OpportunityPool(
            0x126d89acF076aB33bc922902Dd772f80599D90bb
        );
        usdcToken = TestUSDCToken(0x1E28a5fB7B112291F088bBB8ab693D2214DB7895);

        uint256 previousRepaymentCounter = 1;
        uint256 beforeSeniorYield = 0;
        uint256 beforeJuniorYield = 0;
        uint256 beforeBorrowerUsdcBalance = 60000000000000;

        uint256 afterRepaymentCounter = opportunityPool.repaymentCounter();
        (, , , , , uint256 afterSeniorYield, ) = opportunityPool
            .seniorSubpoolDetails();
        (, , , , , uint256 afterJuniorYield, ) = opportunityPool
            .juniorSubpoolDetails();
        uint256 afterBorrowerUsdcBalance = usdcToken.balanceOf(
            0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb
        );
        return
            afterRepaymentCounter - previousRepaymentCounter == 1 &&
            afterSeniorYield - beforeSeniorYield == 46666666666 &&
            afterJuniorYield - beforeJuniorYield == 28333333333 &&
            beforeBorrowerUsdcBalance - afterBorrowerUsdcBalance ==
            opportunityPool.getRepaymentAmount() &&
            usdcToken.balanceOf(0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84) ==
            8333333333;
    }

    function echidna_test_bullet_loan_all_repayment() public returns (bool) {
        opportunityPool = OpportunityPool(
            0x8080C7e4B81ecf23aa6F877cfbfD9b0C228C6ffA
        );
        (, , uint256 totalDepositedAmount, , , , ) = opportunityPool
            .seniorSubpoolDetails();
        (, , , , , uint256 seniorYieldGenerated, ) = opportunityPool
            .seniorSubpoolDetails();
        (, , , , , uint256 juniorYieldGenerated, ) = opportunityPool
            .juniorSubpoolDetails();

        return
            totalDepositedAmount == 0 &&
            seniorYieldGenerated == 0 &&
            juniorYieldGenerated == 169999999998;
    }

    function echidna_test_withdrawAll() public returns (bool) {
        usdcToken = TestUSDCToken(0xE1790e95E4a863f8a3084eEd69E2E12747e78c29);

        return
            usdcToken.balanceOf(0x417b20AdC7ADD5736FB3DDEE6D793c430f9F043b) ==
            8000000000000;
    }

    function echidna_test_getRepaymentAmount() public returns (bool) {
        opportunityPool = OpportunityPool(
            0xc2ddDc17F70a0cba6f0fFbB80b4f434c1B12Dd84
        );

        uint256 repaymentAmount = opportunityPool.getRepaymentAmount();

        return opportunityPool.getRepaymentAmount() == repaymentAmount;
    }

    function echidna_test_getOverDuePercentage() public returns (bool) {
        opportunityPool = OpportunityPool(
            0xF5fa5b5fed2727A0E44ac67f6772e97977aa358B
        );

        (
            uint256 seniorOverDuePerecentage,
            uint256 juniorOverDuePerecentage
        ) = opportunityPool.getOverDuePercentage();

        return
            seniorOverDuePerecentage == 3695328 &&
            juniorOverDuePerecentage == 2243616;
    }

    function echidna_test_nextRepaymentTime() public returns (bool) {
        opportunityPool = OpportunityPool(
            0xdD16db2cFb5c091541212e1fE6391C3806B1B823
        );

        uint256 nextRepaymentTime = opportunityPool.nextRepaymentTime();

        return opportunityPool.nextRepaymentTime() == nextRepaymentTime;
    }

    function echidna_test_getSeniorTotalDepositable() public returns (bool) {
        opportunityPool = OpportunityPool(
            0xd8E320320557a6ea5e05Ac21Ca43a253e0b03162
        );

        return opportunityPool.getSeniorTotalDepositable() == 8000000000000;
    }

    function echidna_test_getSeniorProfit() public returns (bool) {
        opportunityPool = OpportunityPool(
            0x2EB0b0673aE70a4F20258fa48a719FfAba1A0F99
        );

        return opportunityPool.getSeniorProfit() == 46666666666;
    }

    function echidna_test_lockPool() public returns (bool) {
        opportunityPool = OpportunityPool(
            0x786fE8061fBd5ECDe5fdc5fa03b4672F217880e6
        );

        (, , , bool isPoolLocked, , , ) = opportunityPool
            .juniorSubpoolDetails();

        return isPoolLocked == true;
    }

    function echidna_test_unlockPool() public returns (bool) {
        opportunityPool = OpportunityPool(
            0x1675F7D234f5acc2a8af60361bdCC5c60BF0EE3f
        );

        (, , , bool isPoolLocked, , , ) = opportunityPool
            .juniorSubpoolDetails();

        return isPoolLocked == false;
    }

    function echidna_test_getSeniorPoolWithdrawableAmount()
        public
        returns (bool)
    {
        opportunityPool = OpportunityPool(
            0xf35FC417b332f4b0B12c10D5acB9082351b985bb
        );

        return
            opportunityPool.getSeniorPoolWithdrawableAmount() == 8000000000000;
    }
}
