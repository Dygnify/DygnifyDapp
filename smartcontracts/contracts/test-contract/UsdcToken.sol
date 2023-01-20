// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract UsdcToken is Initializable, ERC20Upgradeable {
    function initialize() public initializer {
        __ERC20_init("UsdcToken", "USDC");

        _mint(msg.sender, 100000000000 * 10 ** decimals());
    }
}
