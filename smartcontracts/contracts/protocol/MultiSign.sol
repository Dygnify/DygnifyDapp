// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./DygnifyTreasury.sol";
import "./BaseUpgradeablePausable.sol";

contract MultiSign is BaseUpgradeablePausable {
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event ConfirmationsRequiredUpdated(uint256 numConfirmationsRequired);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
    }

    // mapping from tx index => owner => bool
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    modifier multisig(address _multisigAddress, bytes memory _data) {
        require(_multisigAddress != address(0), "invalid multisig address");
        if (msg.sender != _multisigAddress) {
            (bool success, bytes memory data) = _multisigAddress.call{value: 0}(
                abi.encodeWithSignature(
                    "submitTransaction(address,uint256,bytes)",
                    address(this),
                    0,
                    _data
                )
            );
            require(success, string(data));
        } else {
            _;
        }
    }

    function _MultiSign_init(
        address[] memory _owners,
        uint256 _numConfirmationsRequired
    ) external initializer {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );
        _BaseUpgradeablePausable_init(msg.sender);

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    function submitTransaction(
        address _to,
        uint256 _value,
        bytes memory _data
    ) external {
        require(_to != address(0), "invalid address");
        uint256 txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    function confirmTransaction(uint256 _txIndex)
        external
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);

        if (transaction.numConfirmations >= numConfirmationsRequired) {
            executeTransaction(_txIndex);
        }
    }

    function executeTransaction(uint256 _txIndex)
        private
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );

        transaction.executed = true;

        (bool success, bytes memory data) = transaction.to.call{
            value: transaction.value
        }(transaction.data);
        require(success, string(data));

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    function revokeConfirmation(uint256 _txIndex)
        external
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function addOwner(address owner) external onlyAdmin {
        require(owner != address(0), "invalid owner");
        require(!isOwner[owner], "owner not unique");
        isOwner[owner] = true;
        owners.push(owner);
        emit OwnerAdded(owner);
        numConfirmationsRequired += 1;
    }

    function removeOwner(address owner) external onlyAdmin {
        require(owner != address(0), "invalid owner");
        require(isOwner[owner], "owner does not exist");
        isOwner[owner] = false;
        for (uint256 i = 0; i < owners.length - 1; i++)
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        owners.pop();
        numConfirmationsRequired -= 1;
        emit OwnerRemoved(owner);
    }

    function updateNumConfirmationsRequired(uint256 _numConfirmationsRequired)
        external
        onlyAdmin
    {
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= owners.length,
            "invalid number of confirmations required"
        );
        numConfirmationsRequired = _numConfirmationsRequired;

        emit ConfirmationsRequiredUpdated(numConfirmationsRequired);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }
}
