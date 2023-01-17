const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const USDCAMOUNT = "9999999999000000";
const AMOUNT = "10000000";

const OVERFLOW =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

describe("LPToken", function () {
	let lpToken,
		dygnifyConfig,
		seniorPool,
		opportunityOrigination,
		collateralToken,
		uSDCTestToken,
		mockSeniorPool;

	beforeEach(async () => {
		const owner = await ethers.getSigner();
		// deploy DygnifyConfig.sol
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize(); // initialize dygnifyConfig

		// deploy Senior pool
		const SeniorPool = await ethers.getContractFactory("SeniorPool");
		seniorPool = await SeniorPool.deploy();
		await seniorPool.deployed();

		// deploy OpportunityOrigination.sol
		const OpportunityOrigination = await ethers.getContractFactory(
			"OpportunityOrigination"
		);
		opportunityOrigination = await OpportunityOrigination.deploy();
		await opportunityOrigination.deployed();

		// deploy LPToken.sol
		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();

		// deploy CollateralToken.sol

		const CollateralToken = await ethers.getContractFactory("CollateralToken");
		collateralToken = await CollateralToken.deploy();
		await collateralToken.deployed();

		// deploy USDCTestToken.sol

		const USDCTestToken = await ethers.getContractFactory("USDCTestToken");
		uSDCTestToken = await USDCTestToken.deploy(USDCAMOUNT);
		await uSDCTestToken.deployed();

		// deploy MockSeniorPool.sol
		const MockSeniorPool = await ethers.getContractFactory("MockSeniorPool");
		mockSeniorPool = await MockSeniorPool.deploy(
			seniorPool.address,
			uSDCTestToken.address
		);
		await mockSeniorPool.deployed();

		// set all the addresses
		await dygnifyConfig.setAddress(1, lpToken.address);
		await dygnifyConfig.setAddress(2, uSDCTestToken.address);
		await dygnifyConfig.setAddress(3, seniorPool.address);
		await dygnifyConfig.setAddress(5, collateralToken.address);
		await dygnifyConfig.setAddress(6, opportunityOrigination.address);

		// initialize contracts
		await seniorPool.initialize(dygnifyConfig.address);
		await lpToken.initialize(seniorPool.address);
		await opportunityOrigination.initialize(dygnifyConfig.address);
		await collateralToken.initialize(
			dygnifyConfig.address,
			opportunityOrigination.address
		);
	});

	describe("mint", function () {
		describe("Positive cases", function () {
			it("1. should mint given amount and transfer it to given account", async function () {
				await uSDCTestToken.transfer(mockSeniorPool.address, AMOUNT);

				await expect(mockSeniorPool.stake(AMOUNT)).to.emit(seniorPool, "Stake");

				const totalShares = await lpToken.totalShares();
				assert.equal(totalShares.toString(), AMOUNT);
			});

			it("2. should mint given amount and transfer it to given account", async function () {
				await uSDCTestToken.transfer(mockSeniorPool.address, 2 * AMOUNT);

				await expect(mockSeniorPool.stake(2 * AMOUNT)).to.emit(
					seniorPool,
					"Stake"
				);

				const totalShares = await lpToken.totalShares();
				assert.equal(totalShares.toString(), 2 * AMOUNT);
			});

			it("3. should mint given amount and transfer it to given account", async function () {
				await uSDCTestToken.transfer(mockSeniorPool.address, 1.5 * AMOUNT);

				await expect(mockSeniorPool.stake(1.5 * AMOUNT)).to.emit(
					seniorPool,
					"Stake"
				);

				const totalShares = await lpToken.totalShares();
				assert.equal(totalShares.toString(), 1.5 * AMOUNT);
			});

			it("4. should mint given amount and transfer it to given account", async function () {
				await uSDCTestToken.transfer(mockSeniorPool.address, 10 * AMOUNT);

				await expect(mockSeniorPool.stake(10 * AMOUNT)).to.emit(
					seniorPool,
					"Stake"
				);

				const totalShares = await lpToken.totalShares();
				assert.equal(totalShares.toString(), 10 * AMOUNT);
			});
		});

		describe("Negative cases", function () {
			it("reverts when seniorPool contract is not msg.sender to call mint function", async function () {
				const accounts = await ethers.getSigners();
				await expect(
					lpToken.mint(accounts[3].address, 10 * AMOUNT)
				).to.be.revertedWith("Caller is not a Owner");
			});

			it("reverts when seniorPool contract is not msg.sender to call mint function", async function () {
				const accounts = await ethers.getSigners();
				await expect(
					lpToken.mint(accounts[2].address, AMOUNT)
				).to.be.revertedWith("Caller is not a Owner");
			});
		});

		describe("Border cases", function () {
			it("going to overflow for amount", async function () {
				await expect(mockSeniorPool.stake(OVERFLOW)).to.be.reverted;
			});

			it("going to overflow for amount", async function () {
				await expect(mockSeniorPool.stake(33 * OVERFLOW)).to.be.reverted;
			});
		});
	});

	describe("burn", function () {
		describe("Positive cases", function () {
			it("1. should burn given amount and withdraw funds in user wallet", async function () {
				const owner = await ethers.getSigner();
				await uSDCTestToken.transfer(mockSeniorPool.address, 2 * AMOUNT);
				await mockSeniorPool.stake(2 * AMOUNT);

				const balanceBefore = await uSDCTestToken.balanceOf(owner.address);

				await expect(mockSeniorPool.withdrawWithLP(2 * AMOUNT)).to.emit(
					seniorPool,
					"Unstake"
				);

				const balanceAfter = await uSDCTestToken.balanceOf(owner.address);

				assert.equal(balanceAfter.toString() - balanceBefore.toString(), 0);
				const totalShares = await lpToken.totalShares();
				assert.equal(totalShares.toString(), "0");
			});

			it("2. should burn given amount and withdraw funds in user wallet", async function () {
				const owner = await ethers.getSigner();
				await uSDCTestToken.transfer(mockSeniorPool.address, 3 * AMOUNT);
				await mockSeniorPool.stake(3 * AMOUNT);

				const balanceBefore = await uSDCTestToken.balanceOf(owner.address);

				await expect(mockSeniorPool.withdrawWithLP(3 * AMOUNT)).to.emit(
					seniorPool,
					"Unstake"
				);

				const balanceAfter = await uSDCTestToken.balanceOf(owner.address);

				assert.equal(balanceAfter.toString() - balanceBefore.toString(), 0);
				const totalShares = await lpToken.totalShares();
				assert.equal(totalShares.toString(), "0");
			});

			it("3. should burn given amount and withdraw funds in user wallet", async function () {
				const owner = await ethers.getSigner();
				await uSDCTestToken.transfer(mockSeniorPool.address, 1.5 * AMOUNT);
				await mockSeniorPool.stake(1.5 * AMOUNT);

				const balanceBefore = await uSDCTestToken.balanceOf(owner.address);

				await expect(mockSeniorPool.withdrawWithLP(1.5 * AMOUNT)).to.emit(
					seniorPool,
					"Unstake"
				);

				const balanceAfter = await uSDCTestToken.balanceOf(owner.address);

				assert.equal(balanceAfter.toString() - balanceBefore.toString(), 0);
				const totalShares = await lpToken.totalShares();
				assert.equal(totalShares.toString(), "0");
			});

			it("4. should burn given amount and withdraw funds in user wallet", async function () {
				const owner = await ethers.getSigner();
				await uSDCTestToken.transfer(mockSeniorPool.address, 33 * AMOUNT);
				await mockSeniorPool.stake(33 * AMOUNT);

				const balanceBefore = await uSDCTestToken.balanceOf(owner.address);

				await expect(mockSeniorPool.withdrawWithLP(33 * AMOUNT)).to.emit(
					seniorPool,
					"Unstake"
				);

				const balanceAfter = await uSDCTestToken.balanceOf(owner.address);

				assert.equal(balanceAfter.toString() - balanceBefore.toString(), 0);
				const totalShares = await lpToken.totalShares();
				assert.equal(totalShares.toString(), "0");
			});
		});

		describe("Negative cases", function () {
			it("reverts when seniorPool contract is not msg.sender to call burn function", async function () {
				const accounts = await ethers.getSigners();
				await expect(
					lpToken.burn(accounts[3].address, AMOUNT)
				).to.be.revertedWith("Caller is not a Owner");
			});

			it("reverts when seniorPool contract is not msg.sender to call burn function", async function () {
				const accounts = await ethers.getSigners();
				await expect(
					lpToken.burn(accounts[5].address, AMOUNT)
				).to.be.revertedWith("Caller is not a Owner");
			});
		});

		describe("Border cases", function () {
			it("going to overflow for amount", async function () {
				await expect(mockSeniorPool.withdrawWithLP(OVERFLOW)).to.be.reverted;
			});

			it("going to overflow for amount", async function () {
				await expect(mockSeniorPool.withdrawWithLP(33 * OVERFLOW)).to.be
					.reverted;
			});
		});
	});
});
