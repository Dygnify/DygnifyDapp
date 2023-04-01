const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");
const BN = require("bignumber.js");

const USDCAMOUNT = "99999999990000000";
const AMOUNT = "10000000000";
const OFFSET = new BN(10);

const ID = ethers.utils.id("aadhar");

const OVERFLOW =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

const oneYear = 60 * 60 * 24 * 30 * 12;
const sixMonths = 60 * 60 * 24 * 30 * 6;
let count = 0;

describe("SeniorPoolFuzz", function () {
	let lpToken,
		dygnifyConfig,
		seniorPool,
		opportunityOrigination,
		uSDCTestToken,
		opportunityPool,
		accounts;

	beforeEach(async () => {
		accounts = await ethers.getSigners();
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
		const poolContractFactory = await ethers.getContractFactory(
			"MockOpportunityPool"
		);
		opportunityPool = await poolContractFactory.deploy();
		await opportunityPool.deployed();

		// deploy OpportunityOrigination.sol
		const OpportunityOrigination = await ethers.getContractFactory(
			"MockOpportunityOrigination"
		);
		opportunityOrigination = await OpportunityOrigination.deploy(
			opportunityPool.address
		);
		await opportunityOrigination.deployed();
		await opportunityOrigination.setPoolAddress(opportunityPool.address);

		// deploy LPToken.sol
		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();

		// deploy USDCTestToken.sol
		const USDCTestToken = await ethers.getContractFactory("TestUSDCToken");
		uSDCTestToken = await USDCTestToken.deploy(USDCAMOUNT);
		await uSDCTestToken.deployed();

		// set all the addresses
		await dygnifyConfig.setAddress(1, lpToken.address);
		await dygnifyConfig.setAddress(2, uSDCTestToken.address);
		await dygnifyConfig.setAddress(3, seniorPool.address);
		await dygnifyConfig.setAddress(4, opportunityPool.address);
		await dygnifyConfig.setAddress(6, opportunityOrigination.address);

		// making investment lock time to 12 months
		await dygnifyConfig.setNumber(4, 12);

		// initialize contracts
		await seniorPool.initialize(dygnifyConfig.address);
		await lpToken.initialize(seniorPool.address);

		if (count < 1) {
			for (let i = 0; i < 10; i++) {
				console.log(`Account ${i}`, accounts[i].address);
			}
			count += 1;
		}

		console.log("seniorPool : ", seniorPool.address);
		console.log("lptoken : ", lpToken.address);
		console.log("dygnifyConfig : ", dygnifyConfig.address);
		console.log("OpportunityOrigination : ", opportunityOrigination.address);
		console.log("usdcTestToken :", uSDCTestToken.address);
		console.log("opportunityPool : ", opportunityPool.address);
		console.log();
	});

	const STAKE = async (account, AMOUNT) => {
		await uSDCTestToken.transfer(account.address, AMOUNT);

		await uSDCTestToken.connect(account).approve(seniorPool.address, AMOUNT);
		await seniorPool.connect(account).stake(AMOUNT);
	};

	function lpMantissa() {
		return Math.pow(10, 6);
	}

	describe("stake", function () {
		describe("Positive cases", function () {
			it("1. stake 10000 usdc in senior pool", async function () {
				// 5th accout is staker
				await uSDCTestToken.transfer(accounts[5].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[5])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[5]).stake(AMOUNT);
			});
		});
	});

	describe("withdrawTo", function () {
		describe("Positive cases", function () {
			it("1. withdraw 10000 usdc and transfer it to user's wallet", async function () {
				// 5th accout is staker

				await STAKE(accounts[5], AMOUNT);

				// owner will withdraw amount to accounts[5]
				await seniorPool.withdrawTo(AMOUNT, accounts[5].address);
			});
		});
	});

	describe("invest", function () {
		describe("Positive cases", function () {
			beforeEach(async function () {
				await opportunityPool.setSeniorTotalDepositable(100000);
				await STAKE(accounts[5], 5 * AMOUNT);
			});

			it("should invest in given opportunity id", async function () {
				await seniorPool.invest(ID);
			});
		});
	});

	describe("withDrawFromOpportunity", function () {
		describe("Positive cases", function () {
			beforeEach(async function () {
				await opportunityPool.setSeniorPoolWithdrawableAmount(100000);
				await opportunityPool.setSeniorProfit(9990000);
				// accounts[5] is staking
				await STAKE(accounts[5], AMOUNT);

				// accounts[6] is staking
				await STAKE(accounts[6], AMOUNT);
			});

			it("should run withDrawFromOpportunity function successfully when _isWriteOff is true", async function () {
				await opportunityPool.repayment(true, ID, AMOUNT, seniorPool.address);
			});
		});
	});

	describe("withdrawWithLP", function () {
		describe("Positive cases", function () {
			beforeEach(async function () {
				/*
				 * 	Accounts 5, 6, and 9 are staking
				 *	LokingPeriod is of 12 months
				 */

				// accounts[5] is staking
				await STAKE(accounts[5], AMOUNT);

				// accounts[6] is staking
				await STAKE(accounts[6], AMOUNT);

				// accounts[9] is staking
				await STAKE(accounts[9], AMOUNT);
			});

			it("user tries to withDrawWithLP after lockingPeriod is over", async function () {
				// using account 5 here

				// call withDrawFromOpportunity with _writeOff as true
				// so that it can increase sharePrice and poolBalance

				const amount = AMOUNT / 2;
				await opportunityPool.repayment(true, ID, amount, seniorPool.address);

				// const provider = new ethers.providers.JsonRpcProvider(
				// 	"http://localhost:8545"
				// );

				// after withDrawFromOpportunity{sharePrice, seniorPoolBalance, usdcBalance}

				const seniorPoolBalBefore = await seniorPool.seniorPoolBal();

				// 12 months in seconds + 1 second
				await network.provider.send("evm_increaseTime", [oneYear + 1]);
				await network.provider.send("evm_mine", []);

				const before = await seniorPool.seniorPoolBal();

				// half of the amount
				await seniorPool.connect(accounts[5]).withdrawWithLP(amount);
				const after = await seniorPool.seniorPoolBal();

				console.log(before.toString(), after.toString());
				assert.ok(before.toString() > after.toString());
			});
		});
	});
});
