// Right click on the script name and hit "Run" to execute
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("MultisignFuzz", function () {
	let dygnifyConfig,
		multiSign,
		usdcToken,
		dygnifyTreasury,
		admin,
		owner1,
		owner2,
		user;
	beforeEach(async () => {
		accounts = await ethers.getSigners();
		admin = accounts[0];
		owner1 = accounts[1];
		owner2 = accounts[2];
		user = accounts[3];

		// Deploy and initialize DygnifyConfig
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize();

		// Deploy and initialize Multisign
		const MultiSign = await ethers.getContractFactory("MultiSign");
		multiSign = await MultiSign.deploy();
		await multiSign.deployed();

		console.log("multisign", multiSign.address);

		// Deploy UsdcToken
		const UsdcToken = await ethers.getContractFactory("TestUSDCToken");
		usdcToken = await UsdcToken.deploy("100000000000000000");
		await usdcToken.deployed();

		// Deploy and Initialize DygnifyTreasury
		const DygnifyTreasury = await ethers.getContractFactory("DygnifyTreasury");
		dygnifyTreasury = await DygnifyTreasury.deploy();
		await dygnifyTreasury.deployed();

		// Set Address in dygnifyConfig
		await dygnifyConfig.setAddress(11, multiSign.address);
		await dygnifyConfig.setAddress(2, usdcToken.address);
		await dygnifyConfig.setAddress(8, dygnifyTreasury.address);

		// Initialize
		await dygnifyTreasury.initialize(dygnifyConfig.address);

		console.log("dygnifyTreasury", dygnifyTreasury.address);

		// Transfer Usdc
		await usdcToken.transfer(dygnifyTreasury.address, "50000000000000");
		await multiSign._MultiSign_init([owner1.address, owner2.address], 2);

		console.log("admin", admin.address);
		console.log("owner1", owner1.address);
		console.log("owner2", owner2.address);
		console.log("user", user.address);
	});
	describe("submitTransaction", function () {
		it("should submit transaction", async function () {
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
			assert.equal(await multiSign.getTransactionCount(), 1);
			let tx = await multiSign.getTransaction(0);
			assert.equal(tx.to, dygnifyTreasury.address);
			assert.equal(
				tx.data,
				"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
			);
			assert.equal(tx.executed, false);
			assert.equal(tx.numConfirmations, 0);
		});
	});
	describe("confirmTransaction", function () {
		beforeEach(async () => {
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
		});
		it("should confirm transaction", async function () {
			await multiSign.connect(owner1).confirmTransaction(0);
			const tx = await multiSign.getTransaction(0);
			assert.equal(tx.numConfirmations, 1);
		});
	});
	describe("revokeConfirmation", function () {
		beforeEach(async () => {
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
			await multiSign.connect(owner1).confirmTransaction(0);
		});

		it("should revoke confirmation", async function () {
			await multiSign.connect(owner1).revokeConfirmation(0);
			const tx = await multiSign.getTransaction(0);
			assert.equal(tx.numConfirmations, 0);
		});
	});
	describe("executeTransaction", function () {
		beforeEach(async () => {
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
		});
		it("should execute transaction", async function () {
			await multiSign.connect(owner1).confirmTransaction(0);
			await multiSign.connect(owner2).confirmTransaction(0);
			const tx = await multiSign.getTransaction(0);
			assert.equal(tx.executed, true);
		});
	});
	describe("addOwner", function () {
		it("should add owner", async function () {
			await multiSign.connect(admin).addOwner(user.address);
			const owners = await multiSign.getOwners();
			assert.equal(owners.length, 3);
			assert.equal(owners[2], user.address);
		});
	});
	describe("removeOwner", function () {
		it("should remove owner", async function () {
			await multiSign.connect(admin).removeOwner(owner2.address);
			const owners = await multiSign.getOwners();
			assert.equal(owners.length, 1);
		});
	});
	describe("updateNumConfirmationsRequired", function () {
		it("should update number of confirmations required", async function () {
			await multiSign.connect(admin).updateNumConfirmationsRequired(1);
			const numConfirmationsRequired =
				await multiSign.numConfirmationsRequired();
			assert.equal(numConfirmationsRequired, 1);
		});
	});
	describe("getOwners", function () {
		it("should get owners", async function () {
			const owners = await multiSign.getOwners();
			assert.equal(owners.length, 2);
			assert.equal(owners[0], owner1.address);
			assert.equal(owners[1], owner2.address);
		});
	});
	describe("getTransactionCount", function () {
		it("should get transaction count", async function () {
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
			assert.equal(await multiSign.getTransactionCount(), 1);
		});
	});
	describe("getTransaction", function () {
		it("should get transaction", async function () {
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
			let tx = await multiSign.getTransaction(0);
			assert.equal(tx.to, dygnifyTreasury.address);
			assert.equal(
				tx.data,
				"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
			);
			assert.equal(tx.executed, false);
			assert.equal(tx.numConfirmations, 0);
		});
	});
});
