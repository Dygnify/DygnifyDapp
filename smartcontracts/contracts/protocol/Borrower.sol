// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./BaseUpgradeablePausable.sol";

contract Borrower is BaseUpgradeablePausable{

    // In future we can update the profile of borrwer when auditor reviews it.
    mapping(address => string) public borrowerProfile;

    function _borrower_init()external initializer{
    }

    function updateBorrowerProfile(string memory _cid)external {
        require(bytes(_cid).length != 0 , "Invalid CID");
        borrowerProfile[msg.sender] = _cid;
    }

}