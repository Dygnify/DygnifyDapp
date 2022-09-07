// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface ILPToken {
    function initialize(address _stakingContract) external;

    function mint(address _to, uint256 amount) external;

    function burn(address _to, uint256 amount) external;
}
