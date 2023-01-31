// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./DygnifyConfig.sol";
import "./BaseUpgradeablePausable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./MultiSign.sol";

contract DygnifyTreasury is BaseUpgradeablePausable, MultiSign {
    DygnifyConfig public dygnifyConfig;
    using ConfigHelper for DygnifyConfig;
    IERC20Upgradeable public usdcToken;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    function initialize(DygnifyConfig _dygnifyConfig) external initializer {
        require(
            address(_dygnifyConfig) != address(0),
            "Invalid config address"
        );
        dygnifyConfig = _dygnifyConfig;
        address owner = dygnifyConfig.dygnifyAdminAddress();
        require(owner != address(0), "Invalid Owner");
        _BaseUpgradeablePausable_init(owner);

        usdcToken = IERC20Upgradeable(dygnifyConfig.usdcAddress());
    }

    function getTreasuryBalance() public view returns (uint256) {
        uint256 balance = usdcToken.balanceOf(address(this));
        return balance;
    }

    function withdraw(
        address to,
        uint256 amount
    )
        public
        nonReentrant
        whenNotPaused
        // onlyAdmin
        multisig(
            dygnifyConfig.multiSignAddress(),
            abi.encodeWithSignature("withdraw(address,uint256)", to, amount)
        )
    {
        require(amount > 0, "amount must be greater than zero");
        require(to != address(0), "invalid recepient address");
        uint256 totalBalance = getTreasuryBalance();
        require(
            amount <= totalBalance,
            "amount exceeds the total treasury balance"
        );

        usdcToken.transfer(to, amount);
    }
}
