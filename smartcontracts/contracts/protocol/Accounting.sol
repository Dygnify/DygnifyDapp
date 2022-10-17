// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./DSMath.sol";
import "./Constants.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

library Accounting {
    using SafeMathUpgradeable for uint256;
    uint256 constant currentDecimals = 6;

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
}
