// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./DygnifyConfig.sol";
import "./BaseUpgradeablePausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./MultiSign.sol";

contract DygnifyTreasury is BaseUpgradeablePausable {
    DygnifyConfig public dygnifyConfig;
    using ConfigHelper for DygnifyConfig;
    IERC20 public usdcToken;
    using SafeERC20 for IERC20;
    address wallet;

    function setWallet(address _wallet) onlyAdmin public{
        wallet = _wallet;
    }

    function initialize(DygnifyConfig _dygnifyConfig) external initializer {
        require(
            address(_dygnifyConfig) != address(0),
            "Invalid config address"
        );
        dygnifyConfig = _dygnifyConfig;
        address owner = dygnifyConfig.dygnifyAdminAddress();
        require(owner != address(0), "Invalid Owner");
        _BaseUpgradeablePausable_init(owner);
        
        usdcToken = IERC20(dygnifyConfig.usdcAddress());
    }

    function getTreasuryBalance()public view returns(uint256){
        uint256 balance = usdcToken.balanceOf(address(this));
        return balance; 
    }

    // function withdraw(uint256 amount)public nonReentrant whenNotPaused onlyAdmin{
    //     require(amount > 0, "amount must be greater than zero");
    //     uint256 totalBalance = getTreasuryBalance();
    //     require(amount <= totalBalance, "amount exceeds the total treasury balance");

    //     usdcToken.safeTransferFrom(address(this), msg.sender, amount);
    // }


    function reqTx(address to,uint256 value)public{
        MultiSigWallet obj = MultiSigWallet(payable(wallet));
        obj.submitTransaction(to,value);
    }


    function withdraw(address to , uint256 amount)public nonReentrant whenNotPaused{
        require(amount > 0, "amount must be greater than zero");
        require(msg.sender == wallet,"not allowed outside tranction");
        uint256 totalBalance = getTreasuryBalance();
        require(amount <= totalBalance, "amount exceeds the total treasury balance");
        usdcToken.safeTransferFrom(address(this), to, amount);
    }

}
