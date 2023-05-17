// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/Accounting.sol";

contract AccountingFuzz {
    function echidna_test_getTermLoanEMI() public view returns (bool) {
        uint256 loanAmount = 105544e6;
        uint256 loanInterest = 10.8e6;
        uint256 emiCount = 6;
        uint256 paymentFrequency = 30;
        uint256 emiAmount = Accounting.getTermLoanEMI(
            loanAmount,
            loanInterest,
            emiCount,
            paymentFrequency
        );

        //Invariants
        return emiAmount > 0 && emiAmount <= loanAmount;
    }

    function echidna_test_getBulletLoanEMI() public view returns (bool) {
        uint256 loanAmount = 105544e6;
        uint256 loanInterest = 10.8e6;
        uint256 paymentFrequencyInDays = 30;
        uint256 emiAmountInRay = Accounting.getBulletLoanEMI(
            loanAmount,
            loanInterest,
            paymentFrequencyInDays
        );

        //Invariants
        return emiAmountInRay > 0 && emiAmountInRay < loanAmount;
    }

    function echidna_test_getYieldPercentage() public view returns (bool) {
        uint256 dygnifyFees = 100000;
        uint256 underwriterFees = 200000;
        bool isTermLoan = true;
        uint256 emiAmount = 219789718075;
        uint256 loanAmount = 2500000000000;
        uint256 totalRepayments = 12;
        uint256 loanInterest = 100000;
        uint256 leverageRatio = 4;
        uint256 loanTenureInDays = 360;
        (
            uint256 seniorYieldPercentage,
            uint256 juniorYieldPercentage
        ) = Accounting.getYieldPercentage(
                dygnifyFees,
                underwriterFees,
                isTermLoan,
                emiAmount,
                loanAmount,
                totalRepayments,
                loanInterest,
                leverageRatio,
                loanTenureInDays
            );

        //Invariants
        return seniorYieldPercentage >= 0 && juniorYieldPercentage >= 0;
        if (isTermLoan) {
            return totalRepayments >= loanAmount;
        }
        if (leverageRatio == 0) {
            return seniorYieldPercentage == juniorYieldPercentage;
        }
    }

    function echidna_test_getInterestDistribution() public view returns (bool) {
        uint256 dygnifyFees = 100000;
        uint256 underwriterFees = 200000;
        uint256 interestAmount = 137476616895;
        uint256 leverageRatio = 4;
        uint256 loanAmount = 2500000000000;
        uint256 seniorPoolInvestment = 2000000000000;
        (uint256 SeniorPoolInterest, uint256 JuniorPoolInterest) = Accounting
            .getInterestDistribution(
                dygnifyFees,
                underwriterFees,
                interestAmount,
                leverageRatio,
                loanAmount,
                seniorPoolInvestment
            );

        //Invariants
        return SeniorPoolInterest >= 0 && JuniorPoolInterest >= 0;
    }
}
