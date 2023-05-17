const { expect, assert, use } = require("chai");
const { ethers } = require("hardhat");

const USDCAMOUNT = "9999999999000000";
const AMOUNT = 10000000000;

const OVERFLOW =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

let count = 0;

describe("LPTokenFuzz", function () {
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

		const USDCTestToken = await ethers.getContractFactory("TestUSDCToken");
		uSDCTestToken = await USDCTestToken.deploy(USDCAMOUNT);
		await uSDCTestToken.deployed();

		await dygnifyConfig.setAddress(1, lpToken.address);
		await dygnifyConfig.setAddress(2, uSDCTestToken.address);

		await lpToken.initialize(accounts[0].address);

		if (count < 1) {
			for (let i = 0; i < 10; i++) {
				console.log(`Account ${i}`, accounts[i].address);
			}
			count += 1;
		}

		console.log();
		console.log("lptoken : ", lpToken.address);
		console.log("usdcToken : ", uSDCTestToken.address);
		console.log();
	});

	describe("mint", function () {
		describe("Positive cases", function () {
			it("1. mint and transfer 10000 usdc", async function () {
				const amount = AMOUNT;
				const userAddress = accounts[3].address;
				await lpToken.mint(userAddress, amount);
			});
		});
	});

	describe("burn", function () {
		describe("Positive cases", function () {
			it("1. burn and withdraw 10000 usdc to user wallet", async function () {
				const mintAmount = AMOUNT;
				const burnAmount = AMOUNT;
				const userAddress = accounts[3].address;
				await lpToken.mint(userAddress, mintAmount);
				await lpToken.burn(userAddress, burnAmount);

				const totalShares = await lpToken.totalShares();

				assert.equal(totalShares.toString(), "0");
			});
		});
	});
});
