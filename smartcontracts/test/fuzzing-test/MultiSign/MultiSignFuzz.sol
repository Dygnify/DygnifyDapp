// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../../../contracts/protocol/MultiSign.sol";

contract MultiSignFuzz {
    MultiSign multiSign;

    function echidna_test_submitTransaction() public returns (bool) {
        multiSign = MultiSign(0x871DD7C2B4b25E1Aa18728e9D5f2Af4C4e431f5c);
        (address to, , , bool executed, uint256 numConfirmations) = multiSign
            .getTransaction(0);

        return
            to == 0x48BaCB9266a570d521063EF5dD96e61686DbE788 &&
            executed == false &&
            numConfirmations == 0;
    }

    function echidna_test_confirmTransaction() public returns (bool) {
        multiSign = MultiSign(0xcFC18CEc799fBD1793B5C43E773C98D4d61Cc2dB);
        (, , , , uint256 numConfirmations) = multiSign.getTransaction(0);

        return numConfirmations == 1;
    }

    function echidna_test_revokeConfirmation() public returns (bool) {
        multiSign = MultiSign(0x7e3f4E1deB8D3A05d9d2DA87d9521268D0Ec3239);
        (, , , , uint256 numConfirmations) = multiSign.getTransaction(0);

        return numConfirmations == 0;
    }

    function echidna_test_executeTransaction() public returns (bool) {
        multiSign = MultiSign(0x74341e87b1c4dB7D5ED95F92b37509F2525A7A90);
        (, , , bool executed, ) = multiSign.getTransaction(0);

        return executed == true;
    }

    function echidna_test_addOwner() public returns (bool) {
        multiSign = MultiSign(0xF96b018E8dE3A229DbaCed8439DF9e3034e263c1);
        address[] memory owners = multiSign.getOwners();

        return owners[2] == 0xE834EC434DABA538cd1b9Fe1582052B880BD7e63;
    }

    function echidna_test_removeOwner() public returns (bool) {
        multiSign = MultiSign(0x2eBb94Cc79D7D0F1195300aAf191d118F53292a8);
        address[] memory owners = multiSign.getOwners();

        return owners.length == 1;
    }

    function echidna_test_updateNumConfirmationsRequired()
        public
        returns (bool)
    {
        multiSign = MultiSign(0x99356167eDba8FBdC36959E3F5D0C43d1BA9c6DB);

        return multiSign.numConfirmationsRequired() == 1;
    }

    function echidna_test_getOwners() public returns (bool) {
        multiSign = MultiSign(0x434f1EB003B78c0EAbe034313F1aFf47920e0860);
        address[] memory owners = multiSign.getOwners();

        return
            owners[0] == 0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb &&
            owners[1] == 0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84;
    }

    function echidna_test_getTransactionCount() public returns (bool) {
        multiSign = MultiSign(0x169fAc5b75C23FfD1807488C54056BacBb99D002);

        return multiSign.getTransactionCount() == 1;
    }

    function echidna_test_getTransaction() public returns (bool) {
        multiSign = MultiSign(0x997B07daEB6dA60f1fE3909755221D7F9242000C);
        (address to, , , bool executed, uint256 numConfirmations) = multiSign
            .getTransaction(0);

        return
            to == 0x6B2590b071E0672D164e3267dA81a45ED1ca7eeb &&
            executed == false &&
            numConfirmations == 0;
    }
}
