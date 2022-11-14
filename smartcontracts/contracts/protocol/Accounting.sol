// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./DSMath.sol";
import "./Constants.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

library Accounting {
    using SafeMathUpgradeable for uint256;
    uint256 public constant currentDecimals = 6;

    // Calculate the loan interest using standard EMI calculation formula P x R x (1+R)^N / [(1+R)^N-1]
    function getTermLoanEMI(
        uint256 loanAmount,
        uint256 loanInterest,
        uint256 emiCount
    ) internal pure returns (uint256) {
        require(
            loanAmount > 0 && loanInterest > 0 && emiCount > 0,
            "Invalid paramters"
        );
        // Get the monthly interest
        uint256 interestPerMonth = DSMath.rdiv(
            DSMath.rdiv(
                DSMath.getInRay(loanInterest, currentDecimals),
                (12 * DSMath.RAY)
            ),
            (100 * DSMath.RAY)
        );

        // Calculate (1+R)^N / [(1+R)^N-1] part of the formula
        uint256 onePlusInterst = DSMath.RAY.add(interestPerMonth);
        uint256 onePlusIPMPowerTotalRepay = DSMath.rpow(
            onePlusInterst,
            emiCount
        );

        // Final math
        uint256 loanAmtInRay = DSMath.getInRay(loanAmount, currentDecimals);
        uint256 division = DSMath.rdiv(
            onePlusIPMPowerTotalRepay,
            (onePlusIPMPowerTotalRepay - DSMath.RAY)
        );
        uint256 emiAmountInRay = DSMath.rmul(
            DSMath.rmul(loanAmtInRay, interestPerMonth),
            division
        );

        // Current emi amount comes in 10^27 decimals, and finally we need it in 10^6
        return emiAmountInRay.div(10**21);
    }

    // Calculate the loan interest using standard EMI calculation formula P x R / T
    function getBulletLoanEMI(uint256 loanAmount, uint256 loanInterest)
        internal
        pure
        returns (uint256)
    {
        require(loanAmount > 0 && loanInterest > 0, "Invalid paramters");
        // Get the monthly interest
        uint256 interestPerMonth = DSMath.rdiv(
            DSMath.rdiv(
                DSMath.getInRay(loanInterest, currentDecimals),
                (12 * DSMath.RAY)
            ),
            (100 * DSMath.RAY)
        );
        uint256 loanAmtInRay = DSMath.getInRay(loanAmount, currentDecimals);
        uint256 emiAmountInRay = DSMath.rmul(loanAmtInRay, interestPerMonth);
        return emiAmountInRay.div(10**21);
    }

    function getTermLoanInterest(
        uint256 oustandingPrincipal,
        uint256 noOfDays,
        uint256 loanInterest
    ) internal pure returns (uint256) {
        require(
            oustandingPrincipal > 0 && noOfDays > 0 && loanInterest > 0,
            "Invalid paramters"
        );

        // Get the daily interest
        uint256 interestPerDay = DSMath.rdiv(
            DSMath.rdiv(
                DSMath.getInRay(loanInterest, currentDecimals),
                (Constants.oneYearInDays() * DSMath.RAY)
            ),
            (100 * DSMath.RAY)
        );
        uint256 totalInterest = DSMath.rmul(
            interestPerDay,
            (noOfDays * DSMath.RAY)
        );
        uint256 outstandingPrincipalInRay = DSMath.getInRay(
            oustandingPrincipal,
            currentDecimals
        );
        uint256 interest = DSMath.rmul(
            outstandingPrincipalInRay,
            totalInterest
        );
        return interest.div(10**21);
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
    ) internal pure returns (uint256, uint256) {
        require(
            dygnifyFees > 0 &&
                underwriterFees > 0 &&
                emiAmount > 0 &&
                loanAmount > 0 &&
                totalRepayments > 0 &&
                loanInterest > 0 &&
                leverageRatio > 0 &&
                loanTenureInDays > 0,
            "Invalid parameters"
        );
        uint256 dygnifyFeesInRay = DSMath.getInRay(
            dygnifyFees,
            currentDecimals
        );
        uint256 underwriterFeesInRay = DSMath.getInRay(
            underwriterFees,
            currentDecimals
        );
        uint256 totalInterestInRay;
        if (isTermLoan) {
            uint256 emiAmountInRay = DSMath.getInRay(
                emiAmount,
                Accounting.currentDecimals
            );
            uint256 totalRepaymentsInRay = totalRepayments * DSMath.RAY;
            uint256 loanAmountInRay = DSMath.getInRay(
                loanAmount,
                Accounting.currentDecimals
            );
            uint256 interestInRay = DSMath.sub(
                DSMath.rmul(emiAmountInRay, totalRepaymentsInRay),
                loanAmountInRay
            );
            totalInterestInRay = DSMath.rdiv(interestInRay, loanAmountInRay);
        } else {
            // Get the daily interest
            uint256 interestPerDay = DSMath.rdiv(
                DSMath.rdiv(
                    DSMath.getInRay(loanInterest, currentDecimals),
                    (Constants.oneYearInDays() * DSMath.RAY)
                ),
                (100 * DSMath.RAY)
            );
            totalInterestInRay = DSMath.rmul(
                interestPerDay,
                (loanTenureInDays * DSMath.RAY)
            );
        }

        require(totalInterestInRay > 0, "Invalid interest amount");
        uint256 _seniorYieldPerecentage = DSMath.rmul(
            totalInterestInRay,
            DSMath.sub(
                DSMath.sub(DSMath.RAY, dygnifyFeesInRay),
                underwriterFeesInRay
            )
        );

        uint256 _juniorYieldPerecentage = DSMath.rmul(
            totalInterestInRay,
            DSMath.add(
                DSMath.sub(DSMath.RAY, dygnifyFeesInRay),
                DSMath.rmul(underwriterFeesInRay, leverageRatio * DSMath.RAY)
            )
        );
        return (
            _seniorYieldPerecentage.div(10**21),
            _juniorYieldPerecentage.div(10**21)
        );
    }

    function getInterestDistribution(
        uint256 dygnifyFees,
        uint256 underwriterFees,
        uint256 interestAmount,
        uint256 leverageRatio,
        uint256 loanAmount,
        uint256 seniorPoolInvestment
    ) internal pure returns (uint256, uint256) {
        require(
            dygnifyFees > 0 &&
                underwriterFees > 0 &&
                interestAmount > 0 &&
                leverageRatio > 0 &&
                loanAmount > 0 &&
                seniorPoolInvestment > 0,
            "Invalid parameters"
        );
        uint256 dygnifyFeesInRay = DSMath.getInRay(
            dygnifyFees,
            currentDecimals
        );
        uint256 underwriterFeesInRay = DSMath.getInRay(
            underwriterFees,
            currentDecimals
        );
        uint256 interestInRay = DSMath.getInRay(
            interestAmount,
            currentDecimals
        );
        uint256 seniorPoolInvestmentInRay = DSMath.getInRay(
            seniorPoolInvestment,
            currentDecimals
        );
        uint256 loanAmountInRay = DSMath.getInRay(
            loanAmount,
            Accounting.currentDecimals
        );
        uint256 totalSeniorPoolInterest = DSMath.rdiv(
            DSMath.rmul(interestInRay, seniorPoolInvestmentInRay),
            loanAmountInRay
        );

        uint256 underwriterFeesOnInterest = DSMath.rmul(
            totalSeniorPoolInterest,
            underwriterFeesInRay
        );
        uint256 finalSeniorPoolInterest = DSMath.sub(
            DSMath.sub(
                totalSeniorPoolInterest,
                DSMath.rmul(totalSeniorPoolInterest, dygnifyFeesInRay)
            ),
            underwriterFeesOnInterest
        );

        uint256 totalJuniorPoolInterest = DSMath.rdiv(
            DSMath.rmul(
                interestInRay,
                DSMath.sub(loanAmountInRay, seniorPoolInvestmentInRay)
            ),
            loanAmountInRay
        );

        uint256 finalJuniorPoolInterest = DSMath.add(
            DSMath.sub(
                totalJuniorPoolInterest,
                DSMath.rmul(totalJuniorPoolInterest, dygnifyFeesInRay)
            ),
            underwriterFeesOnInterest
        );

        return (
            finalSeniorPoolInterest.div(10**21),
            finalJuniorPoolInterest.div(10**21)
        );
    }
}
