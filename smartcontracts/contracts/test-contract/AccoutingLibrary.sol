// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../protocol/Accounting.sol";

contract AccoutingLibrary {
    function getTermLoanEMI(
        uint256 loanAmount,
        uint256 loanInterest,
        uint256 emiCount,
        uint256 paymentFrequency
    ) external pure returns (uint256) {
        uint256 result = Accounting.getTermLoanEMI(
            loanAmount,
            loanInterest,
            emiCount,
            paymentFrequency
        );
        return result;
    }

    function getBulletLoanEMI(
        uint256 loanAmount,
        uint256 loanInterest,
        uint256 paymentFrequencyInDays
    ) external pure returns (uint256) {
        uint256 result = Accounting.getBulletLoanEMI(
            loanAmount,
            loanInterest,
            paymentFrequencyInDays
        );
        return result;
    }

    function getTermLoanInterest(
        uint256 oustandingPrincipal,
        uint256 noOfDays,
        uint256 loanInterest
    ) external pure returns (uint256) {
        uint256 result = Accounting.getTermLoanInterest(
            oustandingPrincipal,
            noOfDays,
            loanInterest
        );
        return result;
    }

    function getYieldPercentage(
        uint256 dygnifyFees,
        uint256 underwriterFees,
        bool isTermLoan,
        uint256 emiAmount,
        uint256 loanAmount,
        uint256 totalRepayments,
        uint256 loanInterest,
        uint256 leverageRatio,
        uint256 loanTenureInDays
    ) external pure returns (uint256, uint256) {
        (uint256 result1, uint256 result2) = Accounting.getYieldPercentage(
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
        return (result1, result2);
    }

    function getInterestDistribution(
        uint256 dygnifyFees,
        uint256 underwriterFees,
        uint256 interestAmount,
        uint256 leverageRatio,
        uint256 loanAmount,
        uint256 seniorPoolInvestment
    ) external pure returns (uint256, uint256) {
        (uint256 result1, uint256 result2) = Accounting.getInterestDistribution(
            dygnifyFees,
            underwriterFees,
            interestAmount,
            leverageRatio,
            loanAmount,
            seniorPoolInvestment
        );
        return (result1, result2);
    }
}
