const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const overflow =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

describe.only("DygnifyTreasuryFuzz", function () {
	let dygnifyConfig,
		multiSign,
		usdcToken,
		dygnifyTreasury,
		owner1,
		owner2,
		user;
	beforeEach(async () => {
		const accounts = await ethers.getSigners();
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
		await multiSign._MultiSign_init([owner1.address, owner2.address], 2);

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
		console.log("owner1", owner1.address);
		console.log("owner2", owner2.address);
		console.log("user", user.address);
	});

	describe("getTreasuryBalance", function () {
		it("Should be able to get the treasury balance", async function () {
			const TreasuryBalance = await dygnifyTreasury.getTreasuryBalance();
			assert.equal(TreasuryBalance, "50000000000000");
		});
	});

	describe("withdraw", function () {
		it("should be able to withdraw funds from the treasury", async function () {
			// Fund the treasury with USDC
			await usdcToken.transfer(dygnifyTreasury.address, "50000000000000");

			// Get the initial treasury balance
			// const InitialTreasuryBalance = await dygnifyTreasury.getTreasuryBalance();
			// assert.equal(InitialTreasuryBalance, "100000000000000");

			// Withdraw USDC
			await dygnifyTreasury.withdraw(user.address, "50000000000000");
			await multiSign.connect(owner1).confirmTransaction(0);
			await multiSign.connect(owner2).confirmTransaction(0);

			// Get the updated User balance
			// const UserBalance = await usdcToken.balanceOf(user.address);
			// assert.equal(UserBalance.toString(), "50000000000000");

			// Get the updated treasury balance
			const UpdatedTreasuryBalance = await dygnifyTreasury.getTreasuryBalance();
			assert.equal(UpdatedTreasuryBalance, "50000000000000");
		});
	});
});
