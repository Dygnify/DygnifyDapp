// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

const overflow =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

describe.only("DynifyTresury", function () {
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

		// Deploy and initialize UsdcToken
		const UsdcToken = await ethers.getContractFactory("UsdcToken");
		usdcToken = await UsdcToken.deploy();
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
		await usdcToken.initialize();

		// Transfer Usdc
		await usdcToken.transfer(dygnifyTreasury.address, "50000000000000");
	});
	describe("initialize", function () {
		describe("positive cases", function () {
			it("Should initialize correctly", async function () {
				expect(await dygnifyTreasury.initialize(dygnifyConfig.address));
			});
		});

		describe("negative cases", function () {
			it("Should reverts with the correct error message when config address is 0 ", async function () {
				await expect(
					dygnifyTreasury.initialize(
						"0x0000000000000000000000000000000000000000"
					)
				).to.be.revertedWith("Invalid config address");
			});

			it("Should revert if owner is 0 address", async function () {
				dygnifyConfig.setAddress(0, ethers.constants.AddressZero);
				await expect(
					dygnifyTreasury.initialize(dygnifyConfig.address)
				).to.be.revertedWith("Invalid Owner");
			});
		});

		describe("border cases", function () {
			it("Should revert for overflow config address", async function () {
				await expect(dygnifyTreasury.initialize(overflow)).to.be.reverted;
			});

			it("Should revert for underflow config address", async function () {
				await expect(dygnifyTreasury.initialize(-2)).to.be.reverted;
			});
		});
	});

	describe("getTreasuryBalance", function () {
		beforeEach(async () => {
			await dygnifyTreasury.initialize(dygnifyConfig.address);
		});

		describe("positive cases", function () {
			it("Should be able to get the treasury balance", async function () {
				expect(await dygnifyTreasury.getTreasuryBalance()).to.equal(
					"50000000000000"
				);
			});
		});
	});

	describe("withdraw", function () {
		beforeEach(async () => {
			await dygnifyTreasury.initialize(dygnifyConfig.address);
		});
		describe("positive cases", function () {
			it("should be able to withdraw funds from the treasury", async function () {
				// Fund the treasury with USDC
				await usdcToken.transfer(dygnifyTreasury.address, "50000000000000");

				// Get the initial treasury balance
				expect(await dygnifyTreasury.getTreasuryBalance()).to.equal(
					"100000000000000"
				);

				// Withdraw USDC
				await dygnifyTreasury.withdraw(user.address, "50000000000000");
				await multiSign.connect(owner1).confirmTransaction(0);
				await multiSign.connect(owner2).confirmTransaction(0);

				// Get the updated treasury balance
				expect(await dygnifyTreasury.getTreasuryBalance()).to.equal(
					"50000000000000"
				);
			});
		});

		describe("negative cases", function () {
			it("should not be able to withdraw funds simultaneously", async function () {
				dygnifyTreasury.withdraw(user.address, "5000000000000");
				await multiSign.connect(owner1).confirmTransaction(0);
				expect(multiSign.connect(owner2).confirmTransaction(0)).to.be.reverted;
			});

			it("should revert invalid recepient address", async function () {
				await expect(
					dygnifyTreasury.withdraw(
						"0x0000000000000000000000000000000000000000",
						"500000"
					)
				).to.be.revertedWith("invalid recepient address");
			});

			it("should not allow a withdrawal of zero", async function () {
				let amount = 0;
				await expect(
					dygnifyTreasury.withdraw(user.address, amount)
				).to.be.revertedWith("amount must be greater than zero");
			});

			it("should not allow withdraw with amount exceeding the total balance", async () => {
				let amount = 999999999999999;
				await dygnifyTreasury.withdraw(user.address, amount);
				await multiSign.connect(owner1).confirmTransaction(0);
				await expect(
					multiSign.connect(owner2).confirmTransaction(0)
				).to.be.revertedWith("amount exceeds the total treasury balance");
			});
		});

		describe("border cases", function () {
			it("Should revert for overflow recepient address", async function () {
				await expect(dygnifyTreasury.withdraw(overflow, "30000000")).to.be
					.reverted;
			});

			it("Should revert for underflow recepient address", async function () {
				await expect(dygnifyTreasury.withdraw(-2, "50000000")).to.be.reverted;
			});

			it("Should revert for underflow amount ", async function () {
				await expect(dygnifyTreasury.withdraw(user.address, -1)).to.be.reverted;
			});

			it("Should revert for overflow amount ", async function () {
				await expect(dygnifyTreasury.withdraw(user.address, overflow)).to.be
					.reverted;
			});
		});
	});
});
