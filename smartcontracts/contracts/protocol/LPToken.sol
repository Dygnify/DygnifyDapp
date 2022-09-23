// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interfaces/ILPToken.sol";
import "./Constants.sol";

contract LPToken is Initializable, AccessControlUpgradeable, ERC20Upgradeable, ILPToken {
    uint256 public override totalShares;

    function initialize(address _stakingContract) external override initializer {
        require(_stakingContract != address(0), "Invalid staking address");
        __ERC20_init("DygnifyX", "DX");
        _setupRole(Constants.getOwner(), _stakingContract);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function decimals() public virtual override view returns (uint8) {
        return 6;
    }

    function mint(address _to, uint256 amount) public override{
        require(hasRole(Constants.getOwner(), msg.sender), "Caller is not a Owner");
        totalShares = totalShares + amount;
        _mint(_to, amount);
    }

    function burn(address _to, uint256 amount) public override{
        require(hasRole(Constants.getOwner(), msg.sender), "Caller is not a Owner");
        totalShares = totalShares - amount;
        _burn(_to, amount);
    }
}
