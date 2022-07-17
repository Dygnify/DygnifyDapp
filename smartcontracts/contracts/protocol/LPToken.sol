// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract LPToken is Initializable, AccessControlUpgradeable, ERC20Upgradeable  {
    bytes32 public constant OWNER = keccak256("OWNER");

    function initialize(address _stakingContract) external initializer {
        __ERC20_init("DygnifyX","DX");
        _setupRole(OWNER, _stakingContract);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address _to, uint256 amount)public {
        require(hasRole(OWNER, msg.sender), "Caller is not a Owner");
        _mint(_to,amount);
    }

    function burn(address _to, uint256 amount)public {
        require(hasRole(OWNER, msg.sender), "Caller is not a Owner");
        _burn(_to,amount);
    }
}