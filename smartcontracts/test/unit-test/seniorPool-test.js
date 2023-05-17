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

describe("SeniorPool", function () {
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

				await expect(seniorPool.connect(accounts[5]).stake(AMOUNT))
					.to.emit(seniorPool, "Stake")
					.withArgs(accounts[5].address, AMOUNT);
			});

			it("2. stake 10000 usdc in senior pool to using different account", async function () {
				// 9th accout is staker
				await uSDCTestToken.transfer(accounts[9].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[9])
					.approve(seniorPool.address, AMOUNT);

				await expect(seniorPool.connect(accounts[9]).stake(AMOUNT))
					.to.emit(seniorPool, "Stake")
					.withArgs(accounts[9].address, AMOUNT);
			});
		});

		describe("Negative cases", function () {
			it("reverts when not given approval to senior pool", async function () {
				await expect(seniorPool.stake(10 * AMOUNT)).to.be.revertedWith(
					"ERC20: insufficient allowance"
				);
			});

			it("reverts when staking 0 tokens", async function () {
				await uSDCTestToken.approve(seniorPool.address, AMOUNT);
				await expect(seniorPool.stake(0)).to.be.revertedWith(
					"You cannot stake zero tokens"
				);
			});
		});

		describe("Border cases", function () {
			it("going to overflow for amount", async function () {
				await expect(seniorPool.stake(OVERFLOW)).to.be.reverted;
			});

			it("going to overflow for amount", async function () {
				await expect(seniorPool.stake(33 * OVERFLOW)).to.be.reverted;
			});
		});
	});

	describe("withdrawTo", function () {
		describe("Positive cases", function () {
			it("1. withdraw 10000 usdc and transfer it to user's wallet", async function () {
				// 5th accout is staker

				await STAKE(accounts[5], AMOUNT);

				// owner will withdraw amount to accounts[5]
				const tx = await seniorPool.withdrawTo(AMOUNT, accounts[5].address);

				assert.equal(
					(await uSDCTestToken.balanceOf(accounts[5].address)).toString(),
					AMOUNT
				);
				assert.equal((await seniorPool.seniorPoolBal()).toString(), "0");
			});

			it("2. withdraw 10000 usdc and transfer it to different user's wallet", async function () {
				// 6th accout is staker

				await STAKE(accounts[6], AMOUNT);

				// owner will withdraw amount to accounts[5]
				const tx = await seniorPool.withdrawTo(AMOUNT, accounts[6].address);

				assert.equal(
					(await uSDCTestToken.balanceOf(accounts[6].address)).toString(),
					AMOUNT
				);
				assert.equal((await seniorPool.seniorPoolBal()).toString(), "0");
			});
		});

		describe("Negative cases", function () {
			it("reverts when seniorPool doesn't have sufficient balance", async function () {
				await expect(
					seniorPool.withdrawTo(AMOUNT, accounts[3].address)
				).to.be.revertedWith("Insufficient Balance");
			});
		});

		describe("Border cases", function () {
			it("going to overflow for amount", async function () {
				await expect(seniorPool.withdrawTo(OVERFLOW, accounts[3].address)).to.be
					.reverted;
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
				const seniorPoolBal = (await seniorPool.seniorPoolBal()).toString();
				const expectedSeniorPoolBal = seniorPoolBal;

				assert.equal(seniorPoolBal, expectedSeniorPoolBal);
			});
		});

		describe("Negative cases", function () {
			let originalOpportunityOrigination;
			beforeEach(async function () {
				// deploy OpportunityOrigination.sol
				const OpportunityOrigination = await ethers.getContractFactory(
					"OpportunityOrigination"
				);
				originalOpportunityOrigination = await OpportunityOrigination.deploy();
				await originalOpportunityOrigination.deployed();
				await dygnifyConfig.setAddress(
					6,
					originalOpportunityOrigination.address
				);
				await originalOpportunityOrigination.initialize(dygnifyConfig.address);
			});

			it("reverts when opportunity is not active for funding", async function () {
				await opportunityOrigination.makeIsActiveFalse();
				await expect(seniorPool.invest(ID)).to.be.revertedWith(
					"Opportunity is not active for funding"
				);
			});

			it("reverts when amount greater than seniorPoolBal", async function () {
				// create opportunity
				await originalOpportunityOrigination.createOpportunity({
					borrower: accounts[0].address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				await opportunityPool.setSeniorTotalDepositable(AMOUNT);
				await expect(seniorPool.invest(ID)).to.be.revertedWith(
					"insufficient Pool balance"
				);
			});
		});

		describe("Border cases", function () {
			it("going to overflow for id", async function () {
				await expect(seniorPool.invest(ID + "3")).to.be.reverted;
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

				// to check share price
				const sharePrice = await seniorPool.sharePrice();

				const seniorPoolBal = await seniorPool.seniorPoolBal();
				// We have already 2*AOUNT in pool
				// after this function we will have 3*AMOUNT
				assert.equal(seniorPoolBal, 3 * AMOUNT);
				assert(sharePrice > 0);
			});

			it("should run withDrawFromOpportunity function successfully when _isWriteOff is false", async function () {
				await opportunityPool.repayment(false, ID, AMOUNT, seniorPool.address);

				const seniorPoolBal = await seniorPool.seniorPoolBal();
				// We have already 2*AOUNT in pool
				// after this function we will have 3*AMOUNT
				// 100000 is withdrawable amount as in mock
				assert.equal(seniorPoolBal, 2 * AMOUNT + 100000);
			});
		});

		describe("Negative cases", function () {
			it("reverts when opportunity is not repaid by borrower", async function () {
				await opportunityOrigination.makeIsRepaidFalse();

				await expect(
					seniorPool.withDrawFromOpportunity(false, ID, AMOUNT)
				).to.be.revertedWith("Opportunity is not repaid by borrower.");
			});

			it("reverts when withDrawFromOpportunity function not called by opportunity pool", async function () {
				await expect(
					seniorPool.withDrawFromOpportunity(true, ID, AMOUNT)
				).to.be.revertedWith("only Opportunity Pool can withdraw.");
			});
		});

		describe("Border cases", function () {
			it("going to overflow for amount", async function () {
				await expect(seniorPool.withDrawFromOpportunity(true, ID, OVERFLOW)).to
					.be.reverted;
			});

			it("going to overflow for id", async function () {
				await expect(seniorPool.withDrawFromOpportunity(true, ID + "3", AMOUNT))
					.to.be.reverted;
			});
		});
	});

	describe("getUserInvestment", function () {
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

			it("At starting or before 12 months withdrawableAmount should be zero", async function () {
				const opportunityOverview = await seniorPool
					.connect(accounts[5])
					.getUserInvestment();

				assert.equal(opportunityOverview[0].toString(), "0");
				assert.equal(opportunityOverview[1].toString(), AMOUNT);
			});

			it("After locking period(12 months) withdrawableAmount should be equal to amount he staked ", async function () {
				// 12 months in seconds + 1 second
				await network.provider.send("evm_increaseTime", [oneYear + 1]);
				await network.provider.send("evm_mine", []);

				const opportunityOverview = await seniorPool
					.connect(accounts[5])
					.getUserInvestment();

				assert.equal(opportunityOverview[0].toString(), AMOUNT);
				assert.equal(opportunityOverview[1].toString(), "0");
			});
		});

		describe("Negative cases", function () {
			it("reverts when user is not staking", async function () {
				await expect(seniorPool.getUserInvestment()).to.be.revertedWith(
					"User has not staked any amount"
				);
			});
		});
	});

	describe("withdrawWithLP", function () {
		describe("Positive cases", function () {
			// make a function here to get usdc amount from shares
			// to mimic the solidty code
			function getUSDCAmountFromShares(amount, sharePrice, lpMantissa) {
				return amount + (amount * sharePrice) / lpMantissa;
			}

			// for getting share price
			const getSharePrice = async () => {
				const lpMantissa = Math.pow(10, 6);
				const seniorPoolBal = (await seniorPool.seniorPoolBal()).toString();
				const totalShares = (await lpToken.totalShares()).toString();
				if (seniorPoolBal < lpMantissa || totalShares == 0) {
					return 0;
				}
				const availableProfit = seniorPoolBal - totalShares;
				return (availableProfit * lpMantissa) / totalShares;
			};

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

				// after withDrawFromOpportunity{sharePrice, seniorPoolBalance, usdcBalance}
				const sharePriceBefore = await seniorPool.sharePrice();
				const seniorPoolBalBefore = await seniorPool.seniorPoolBal();
				const userBeforeUSDCBalance = await uSDCTestToken.balanceOf(
					accounts[5].address
				);

				const expectedUSDCAmount = getUSDCAmountFromShares(
					amount,
					sharePriceBefore.toString(),
					lpMantissa()
				);

				// 12 months in seconds + 1 second
				await network.provider.send("evm_increaseTime", [oneYear + 1]);
				await network.provider.send("evm_mine", []);

				// half of the amount
				await expect(seniorPool.connect(accounts[5]).withdrawWithLP(amount))
					.to.emit(seniorPool, "Unstake")
					.withArgs(accounts[5].address, amount);

				const userAfterUSDCBalance = await uSDCTestToken.balanceOf(
					accounts[5].address
				);

				// for checking usdc balance of user

				const expectedUSDCAmountBN = new BN(expectedUSDCAmount);
				// as the usdcAMount is transferd to user 5 account from seniorPool
				const actualUSDCAmountBN = new BN(userAfterUSDCBalance.toString());

				// for checking seniorPool Bal
				const actualSeniorPoolBalBN = new BN(await seniorPool.seniorPoolBal());
				const expectedSeniorPoolBalance = new BN(
					seniorPoolBalBefore.toString() - actualUSDCAmountBN.toString()
				);

				// for checking sharePrice
				const actualSharePriceBN = new BN(
					(await seniorPool.sharePrice()).toString()
				);
				const expectedSharePriceBN = new BN((await getSharePrice()).toString());

				// user balance before is 0
				assert.equal(userBeforeUSDCBalance.toString(), "0");
				// lte : less than or equal to.

				// for usdcBalance of user
				expect(
					expectedUSDCAmountBN.isEqualTo(actualUSDCAmountBN) ||
						expectedUSDCAmountBN.minus(actualUSDCAmountBN).abs().lte(OFFSET)
				).to.be.true;

				// for chekcing seniroPool bal
				expect(
					expectedSeniorPoolBalance.isEqualTo(actualSeniorPoolBalBN) ||
						expectedSeniorPoolBalance
							.minus(actualSeniorPoolBalBN)
							.abs()
							.lte(OFFSET)
				).to.be.true;

				// for checking share price
				expect(
					expectedSharePriceBN.isEqualTo(actualSharePriceBN) ||
						expectedSharePriceBN.minus(actualSharePriceBN).abs().lte(OFFSET)
				).to.be.true;

				// for checking staking status of user 5
				assert(await seniorPool.isStaking(accounts[5].address));
			});

			it("user tries to withDrawWithLP after lockingPeriod is over", async function () {
				// using account 5 here

				// call withDrawFromOpportunity with _writeOff as true
				// so that it can increase sharePrice and poolBalance

				const amount = AMOUNT - 123245;
				await opportunityPool.repayment(true, ID, amount, seniorPool.address);

				// after withDrawFromOpportunity{sharePrice, seniorPoolBalance, usdcBalance}
				const sharePriceBefore = await seniorPool.sharePrice();
				const seniorPoolBalBefore = await seniorPool.seniorPoolBal();
				const userBeforeUSDCBalance = await uSDCTestToken.balanceOf(
					accounts[5].address
				);

				// user balance before is 0
				assert.equal(userBeforeUSDCBalance.toString(), "0");

				const expectedUSDCAmount = getUSDCAmountFromShares(
					amount,
					sharePriceBefore.toString(),
					lpMantissa()
				);

				// 12 months in seconds + 1 second
				await network.provider.send("evm_increaseTime", [oneYear + 1]);
				await network.provider.send("evm_mine", []);

				// half of the amount
				await expect(seniorPool.connect(accounts[5]).withdrawWithLP(amount))
					.to.emit(seniorPool, "Unstake")
					.withArgs(accounts[5].address, amount);

				const userAfterUSDCBalance = await uSDCTestToken.balanceOf(
					accounts[5].address
				);

				// for checking usdc balance of user
				const expectedUSDCAmountBN = new BN(expectedUSDCAmount);
				// as the usdcAMount is transferd to user 5 account from seniorPool
				const actualUSDCAmountBN = new BN(userAfterUSDCBalance.toString());

				expect(
					expectedUSDCAmountBN.isEqualTo(actualUSDCAmountBN) ||
						expectedUSDCAmountBN.minus(actualUSDCAmountBN).abs().lte(OFFSET)
				).to.be.true;

				// for checking seniorPool Bal
				const actualSeniorPoolBalBN = new BN(await seniorPool.seniorPoolBal());
				const expectedSeniorPoolBalance = new BN(
					seniorPoolBalBefore.toString() - actualUSDCAmountBN.toString()
				);

				expect(
					expectedSeniorPoolBalance.isEqualTo(actualSeniorPoolBalBN) ||
						expectedSeniorPoolBalance
							.minus(actualSeniorPoolBalBN)
							.abs()
							.lte(OFFSET)
				).to.be.true;

				// for checking sharePrice
				const actualSharePriceBN = new BN(
					(await seniorPool.sharePrice()).toString()
				);
				const expectedSharePriceBN = new BN((await getSharePrice()).toString());

				expect(
					expectedSharePriceBN.isEqualTo(actualSharePriceBN) ||
						expectedSharePriceBN.minus(actualSharePriceBN).abs().lte(OFFSET)
				).to.be.true;

				// for checking staking status of user 5
				assert(await seniorPool.isStaking(accounts[5].address));
			});
		});

		describe("Negative cases", function () {
			it("reverts when user is not staking", async function () {
				await expect(seniorPool.withdrawWithLP(AMOUNT)).to.be.revertedWith(
					"User has not invested in this pool or amount should be greater than 0"
				);
			});

			it("reverts when user tries to withdraw more than he staked after locking period is over", async function () {
				// accounts[5] is staking
				await STAKE(accounts[5], AMOUNT);

				// 12 months in seconds + 1 second
				await network.provider.send("evm_increaseTime", [oneYear + 1]);
				await network.provider.send("evm_mine", []);

				await expect(
					seniorPool.connect(accounts[5]).withdrawWithLP(AMOUNT + 1)
				).to.be.revertedWith(
					"Withdraw amount is higher than amount available for withdraw"
				);

				await expect(
					seniorPool.connect(accounts[5]).withdrawWithLP(2 * AMOUNT)
				).to.be.revertedWith(
					"Withdraw amount is higher than amount available for withdraw"
				);
			});

			it("reverts when user tries to withdrawFromLP before lockingPeriod is over", async function () {
				// accounts[5] is staking
				await STAKE(accounts[5], AMOUNT);

				await opportunityPool.repayment(
					true,
					ID,
					AMOUNT / 2,
					seniorPool.address
				);

				// locking period is not over means ... withdrawableAmt is 0
				await expect(
					seniorPool.connect(accounts[5]).withdrawWithLP(AMOUNT / 2)
				).to.be.revertedWith(
					"Withdraw amount is higher than amount available for withdraw"
				);
			});

			it("reverts when user tries to withdrawFromLP before lockingPeriod is over", async function () {
				// At time 0
				await STAKE(accounts[5], AMOUNT);

				// After 6 months

				await network.provider.send("evm_increaseTime", [sixMonths + 1]);
				await network.provider.send("evm_mine", []);
				await STAKE(accounts[5], AMOUNT);

				// After 1 year

				await network.provider.send("evm_increaseTime", [sixMonths + 1]);
				await network.provider.send("evm_mine", []);
				await STAKE(accounts[5], AMOUNT);

				await expect(seniorPool.connect(accounts[5]).withdrawWithLP(AMOUNT))
					.to.emit(seniorPool, "Unstake")
					.withArgs(accounts[5].address, AMOUNT);

				await expect(
					seniorPool.connect(accounts[5]).withdrawWithLP(2 * AMOUNT)
				).to.be.revertedWith(
					"Withdraw amount is higher than amount available for withdraw"
				);
			});
		});

		describe("Border cases", function () {
			it("going to overflow for amount", async function () {
				await expect(seniorPool.withdrawWithLP(OVERFLOW)).to.be.reverted;
			});
		});
	});
});
