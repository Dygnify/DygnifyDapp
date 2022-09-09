// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface ILPToken {
    function totalShares() external view returns(uint256);

    function initialize(address _stakingContract) external;

    function mint(address _to, uint256 amount) external;

    function burn(address _to, uint256 amount) external;
}
