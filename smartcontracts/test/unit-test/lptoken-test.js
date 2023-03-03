const { expect, assert, use } = require("chai");
const { ethers } = require("hardhat");

const USDCAMOUNT = "9999999999000000";
const AMOUNT = 10000000000;

const OVERFLOW =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

describe("LPToken", function () {
	let lpToken, dygnifyConfig, uSDCTestToken, accounts;

	beforeEach(async () => {
		accounts = await ethers.getSigners();

		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize(); // initialize dygnifyConfig

		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();
		l;

		const USDCTestToken = await ethers.getContractFactory("TestUSDCToken");
		uSDCTestToken = await USDCTestToken.deploy(USDCAMOUNT);
		await uSDCTestToken.deployed();

		await dygnifyConfig.setAddress(1, lpToken.address);
		await dygnifyConfig.setAddress(2, uSDCTestToken.address);

		await lpToken.initialize(accounts[0].address);
	});

	describe("mint", function () {
		describe("Positive cases", function () {
			it("1. should mint given amount and transfer it to given account", async function () {
				const amount = AMOUNT;
				const userAddress = accounts[3].address;
				await lpToken.mint(userAddress, amount);
				const totalSharesBefore = await lpToken.totalShares();
				const userBalanceBefore = await uSDCTestToken.balanceOf(userAddress);
				const totalSharesFromContract = await lpToken.totalShares();
				const userBlanceAfter = await uSDCTestToken.balanceOf(userAddress);
				const expectShares = totalSharesBefore.toNumber() + amount;

				const expectedBalanceOfUser = userBalanceBefore.toNumber() + amount;
				expect(totalSharesFromContract.toNumber(), expectShares);
				expect(expectedBalanceOfUser, userBlanceAfter.toNumber());
			});

			it("2. should mint given amount and transfer it to given account", async function () {
				const amount = 3 * AMOUNT;
				const userAddress = accounts[4].address;
				await lpToken.mint(userAddress, amount);
				const totalSharesBefore = await lpToken.totalShares();
				const userBalanceBefore = await uSDCTestToken.balanceOf(userAddress);
				const totalSharesFromContract = await lpToken.totalShares();
				const userBlanceAfter = await uSDCTestToken.balanceOf(userAddress);
				const expectShares = totalSharesBefore.toNumber() + amount;

				const expectedBalanceOfUser = userBalanceBefore.toNumber() + amount;
				expect(totalSharesFromContract.toNumber(), expectShares);
				expect(expectedBalanceOfUser, userBlanceAfter.toNumber());
			});

			it("3. should mint given amount and transfer it to given account", async function () {
				const amount = 6 * AMOUNT;
				const userAddress = accounts[6].address;
				await lpToken.mint(userAddress, amount);
				const totalSharesBefore = await lpToken.totalShares();
				const userBalanceBefore = await uSDCTestToken.balanceOf(userAddress);
				const totalSharesFromContract = await lpToken.totalShares();
				const userBlanceAfter = await uSDCTestToken.balanceOf(userAddress);
				const expectShares = totalSharesBefore.toNumber() + amount;

				const expectedBalanceOfUser = userBalanceBefore.toNumber() + amount;
				expect(totalSharesFromContract.toNumber(), expectShares);
				expect(expectedBalanceOfUser, userBlanceAfter.toNumber());
			});

			it("4. should mint given amount and transfer it to given account", async function () {
				const amount = 33 * AMOUNT;
				const userAddress = accounts[7].address;
				await lpToken.mint(userAddress, amount);
				const totalSharesBefore = await lpToken.totalShares();
				const userBalanceBefore = await uSDCTestToken.balanceOf(userAddress);
				const totalSharesFromContract = await lpToken.totalShares();
				const userBlanceAfter = await uSDCTestToken.balanceOf(userAddress);
				const expectShares = totalSharesBefore.toNumber() + amount;

				const expectedBalanceOfUser = userBalanceBefore.toNumber() + amount;
				expect(totalSharesFromContract.toNumber(), expectShares);
				expect(expectedBalanceOfUser, userBlanceAfter.toNumber());
			});
		});

		describe("Negative cases", function () {
			it("reverts when seniorPool contract is not msg.sender to call mint function", async function () {
				await expect(
					lpToken.connect(accounts[3]).mint(accounts[3].address, 10 * AMOUNT)
				).to.be.revertedWith("Caller is not a Owner");
			});

			it("reverts when seniorPool contract is not msg.sender to call mint function", async function () {
				await expect(
					lpToken.connect(accounts[2]).mint(accounts[2].address, AMOUNT)
				).to.be.revertedWith("Caller is not a Owner");
			});
		});

		describe("Border cases", function () {
			it("going to overflow for amount", async function () {
				await expect(lpToken.mint(accounts[3].address, 33 * OVERFLOW)).to.be
					.reverted;
			});

			it("going to overflow for amount", async function () {
				await expect(lpToken.mint(accounts[8].address, 2 * OVERFLOW)).to.be
					.reverted;
			});
		});
	});

	describe("burn", function () {
		describe("Positive cases", function () {
			it("1. should burn given amount and withdraw funds in user wallet", async function () {
				const mintAmount = AMOUNT;
				const burnAmount = AMOUNT;
				const userAddress = accounts[3].address;
				await lpToken.mint(userAddress, mintAmount);

				await lpToken.burn(userAddress, burnAmount);
				const totalSharesBefore = await lpToken.totalShares();
				const userBalanceBefore = await uSDCTestToken.balanceOf(userAddress);
				const totalSharesFromContract = await lpToken.totalShares();
				const userBlanceAfter = await uSDCTestToken.balanceOf(userAddress);
				const expectShares = totalSharesBefore.toNumber() - burnAmount;

				const expectedBalanceOfUser = userBalanceBefore.toNumber() - burnAmount;
				expect(totalSharesFromContract.toNumber(), expectShares);
				expect(expectedBalanceOfUser, userBlanceAfter.toNumber());
			});

			it("2. should burn given amount and withdraw funds in user wallet", async function () {
				const mintAmount = 3 * AMOUNT;
				const burnAmount = AMOUNT;
				const userAddress = accounts[8].address;
				await lpToken.mint(userAddress, mintAmount);

				await lpToken.burn(userAddress, burnAmount);
				const totalSharesBefore = await lpToken.totalShares();
				const userBalanceBefore = await uSDCTestToken.balanceOf(userAddress);
				const totalSharesFromContract = await lpToken.totalShares();
				const userBlanceAfter = await uSDCTestToken.balanceOf(userAddress);
				const expectShares = totalSharesBefore.toNumber() - burnAmount;

				const expectedBalanceOfUser = userBalanceBefore.toNumber() - burnAmount;
				expect(totalSharesFromContract.toNumber(), expectShares);
				expect(expectedBalanceOfUser, userBlanceAfter.toNumber());
			});

			it("3. should burn given amount and withdraw funds in user wallet", async function () {
				const mintAmount = 33 * AMOUNT;
				const burnAmount = AMOUNT;
				const userAddress = accounts[3].address;
				await lpToken.mint(userAddress, mintAmount);

				await lpToken.burn(userAddress, burnAmount);
				const totalSharesBefore = await lpToken.totalShares();
				const userBalanceBefore = await uSDCTestToken.balanceOf(userAddress);
				const totalSharesFromContract = await lpToken.totalShares();
				const userBlanceAfter = await uSDCTestToken.balanceOf(userAddress);
				const expectShares = totalSharesBefore.toNumber() - burnAmount;

				const expectedBalanceOfUser = userBalanceBefore.toNumber() - burnAmount;
				expect(totalSharesFromContract.toNumber(), expectShares);
				expect(expectedBalanceOfUser, userBlanceAfter.toNumber());
			});

			it("4. should burn given amount and withdraw funds in user wallet", async function () {
				const mintAmount = 23 * AMOUNT;
				const burnAmount = AMOUNT;
				const userAddress = accounts[3].address;
				await lpToken.mint(userAddress, mintAmount);

				await lpToken.burn(userAddress, burnAmount);
				const totalSharesBefore = await lpToken.totalShares();
				const userBalanceBefore = await uSDCTestToken.balanceOf(userAddress);
				const totalSharesFromContract = await lpToken.totalShares();
				const userBlanceAfter = await uSDCTestToken.balanceOf(userAddress);
				const expectShares = totalSharesBefore.toNumber() - burnAmount;

				const expectedBalanceOfUser = userBalanceBefore.toNumber() - burnAmount;
				expect(totalSharesFromContract.toNumber(), expectShares);
				expect(expectedBalanceOfUser, userBlanceAfter.toNumber());
			});
		});

		describe("Negative cases", function () {
			it("reverts when seniorPool contract is not msg.sender to call burn function", async function () {
				// await lpToken.mint(accounts[3].address, 2 * AMOUNT);
				await expect(
					lpToken.connect(accounts[3]).burn(accounts[3].address, AMOUNT)
				).to.be.revertedWith("Caller is not a Owner");
			});

			it("reverts when seniorPool contract is not msg.sender to call burn function", async function () {
				await expect(
					lpToken.connect(accounts[7]).burn(accounts[3].address, AMOUNT)
				).to.be.revertedWith("Caller is not a Owner");
			});
		});

		describe("Border cases", function () {
			it("going to overflow for amount", async function () {
				await expect(lpToken.burn(accounts[3].address, 33 * OVERFLOW)).to.be
					.reverted;
			});

			it("going to overflow for amount", async function () {
				await expect(lpToken.burn(accounts[3].address, 3 * OVERFLOW)).to.be
					.reverted;
			});
		});
	});
});
