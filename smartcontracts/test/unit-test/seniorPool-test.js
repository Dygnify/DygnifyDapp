const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");

const USDCAMOUNT = "99999999990000000";
const AMOUNT = "10000000";

const ID = ethers.utils.id("aadhar");

const OVERFLOW =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

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
			"MockOpportunityPoolV1"
		);
		opportunityPool = await poolContractFactory.deploy();
		await opportunityPool.deployed();

		// deploy OpportunityOrigination.sol
		const OpportunityOrigination = await ethers.getContractFactory(
			"MockOpportunityOriginationV1"
		);
		opportunityOrigination = await OpportunityOrigination.deploy(
			opportunityPool.address
		);
		await opportunityOrigination.deployed();

		// deploy LPToken.sol
		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();

		// deploy USDCTestToken.sol
		const USDCTestToken = await ethers.getContractFactory("USDCTestToken");
		uSDCTestToken = await USDCTestToken.deploy(USDCAMOUNT);
		await uSDCTestToken.deployed();

		// set all the addresses
		await dygnifyConfig.setAddress(1, lpToken.address);
		await dygnifyConfig.setAddress(2, uSDCTestToken.address);
		await dygnifyConfig.setAddress(3, seniorPool.address);
		await dygnifyConfig.setAddress(4, opportunityPool.address);
		await dygnifyConfig.setAddress(6, opportunityOrigination.address);

		// initialize contracts
		await seniorPool.initialize(dygnifyConfig.address);
		await lpToken.initialize(seniorPool.address);
	});

	describe("stake", function () {
		describe("Positive cases", function () {
			it("1. should stake given amount in senior pool", async function () {
				// 5th accout is staker
				await uSDCTestToken.transfer(accounts[5].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[5])
					.approve(seniorPool.address, AMOUNT);

				await expect(seniorPool.connect(accounts[5]).stake(AMOUNT))
					.to.emit(seniorPool, "Stake")
					.withArgs(accounts[5].address, AMOUNT);
			});

			it("2. should stake given amount in senior pool", async function () {
				// 9th accout is staker
				await uSDCTestToken.transfer(accounts[9].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[9])
					.approve(seniorPool.address, AMOUNT);

				await expect(seniorPool.connect(accounts[9]).stake(AMOUNT))
					.to.emit(seniorPool, "Stake")
					.withArgs(accounts[9].address, AMOUNT);
			});

			it("3. should stake given amount in senior pool", async function () {
				// 2nd accout is staker
				await uSDCTestToken.transfer(accounts[2].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[2])
					.approve(seniorPool.address, AMOUNT);

				await expect(seniorPool.connect(accounts[2]).stake(AMOUNT))
					.to.emit(seniorPool, "Stake")
					.withArgs(accounts[2].address, AMOUNT);
			});

			it("4. should stake given amount in senior pool", async function () {
				// 6th accout is staker
				await uSDCTestToken.transfer(accounts[6].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[6])
					.approve(seniorPool.address, AMOUNT);

				await expect(seniorPool.connect(accounts[6]).stake(AMOUNT))
					.to.emit(seniorPool, "Stake")
					.withArgs(accounts[6].address, AMOUNT);
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
			it("1. should withdraw funds from senior pool and transfer it to user's wallet", async function () {
				// 5th accout is staker

				await uSDCTestToken.transfer(accounts[5].address, AMOUNT);
				await uSDCTestToken
					.connect(accounts[5])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[5]).stake(AMOUNT);

				// owner will withdraw amount to accounts[5]
				const tx = await seniorPool.withdrawTo(AMOUNT, accounts[5].address);

				assert.equal(
					(await uSDCTestToken.balanceOf(accounts[5].address)).toString(),
					AMOUNT
				);
				assert.equal((await seniorPool.seniorPoolBal()).toString(), "0");
			});

			it("2. should withdraw funds from senior pool and transfer it to user's wallet", async function () {
				// 6th accout is staker

				await uSDCTestToken.transfer(accounts[6].address, AMOUNT);
				await uSDCTestToken
					.connect(accounts[6])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[6]).stake(AMOUNT);

				// owner will withdraw amount to accounts[5]
				const tx = await seniorPool.withdrawTo(AMOUNT, accounts[6].address);

				assert.equal(
					(await uSDCTestToken.balanceOf(accounts[6].address)).toString(),
					AMOUNT
				);
				assert.equal((await seniorPool.seniorPoolBal()).toString(), "0");
			});

			it("3. should withdraw funds from senior pool and transfer it to user's wallet", async function () {
				// 8th accout is staker

				await uSDCTestToken.transfer(accounts[8].address, AMOUNT);
				await uSDCTestToken
					.connect(accounts[8])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[8]).stake(AMOUNT);

				// owner will withdraw amount to accounts[5]
				const tx = await seniorPool.withdrawTo(AMOUNT, accounts[8].address);

				assert.equal(
					(await uSDCTestToken.balanceOf(accounts[8].address)).toString(),
					AMOUNT
				);
				assert.equal((await seniorPool.seniorPoolBal()).toString(), "0");
			});

			it("4. should withdraw funds from senior pool and transfer it to user's wallet", async function () {
				// 10th accout is staker

				await uSDCTestToken.transfer(accounts[10].address, AMOUNT);
				await uSDCTestToken
					.connect(accounts[10])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[10]).stake(AMOUNT);

				// owner will withdraw amount to accounts[5]
				const tx = await seniorPool.withdrawTo(AMOUNT, accounts[10].address);

				assert.equal(
					(await uSDCTestToken.balanceOf(accounts[10].address)).toString(),
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
				await uSDCTestToken.transfer(accounts[5].address, AMOUNT);
				await uSDCTestToken
					.connect(accounts[5])
					.approve(seniorPool.address, AMOUNT);
				await seniorPool.connect(accounts[5]).stake(AMOUNT);
			});
			it("should invest in given opportunity id", async function () {
				await seniorPool.invest(ID);
				assert.equal((await seniorPool.seniorPoolBal()).toString(), "9000000");
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
				// accounts[5] is staking
				await uSDCTestToken.transfer(accounts[5].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[5])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[5]).stake(AMOUNT);

				// accounts[6] is staking
				await uSDCTestToken.transfer(accounts[6].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[6])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[6]).stake(AMOUNT);
			});

			it("should run withDrawFromOpportunity function successfully when _isWriteOff is true", async function () {
				await opportunityPool.toCheckwithDrawFromOpportunity(
					true,
					ID,
					AMOUNT,
					seniorPool.address
				);

				const seniorPoolBal = await seniorPool.seniorPoolBal();
				// We have already 2*AOUNT in pool
				// after this function we will have 3*AMOUNT
				assert.equal(seniorPoolBal, 3 * AMOUNT);
			});

			it("should run withDrawFromOpportunity function successfully when _isWriteOff is false", async function () {
				await opportunityPool.toCheckwithDrawFromOpportunity(
					false,
					ID,
					AMOUNT,
					seniorPool.address
				);

				const seniorPoolBal = await seniorPool.seniorPoolBal();
				// We have already 2*AOUNT in pool
				// after this function we will have 3*AMOUNT
				assert.equal(seniorPoolBal, 3 * AMOUNT);
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
				).to.be.revertedWith("only Opportunity Pool can withdraw");
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
				// accounts[5] is staking
				await uSDCTestToken.transfer(accounts[5].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[5])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[5]).stake(AMOUNT);

				// accounts[6] is staking
				await uSDCTestToken.transfer(accounts[6].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[6])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[6]).stake(AMOUNT);
			});

			it("should return user investment", async function () {
				const tx = await seniorPool.connect(accounts[5]).getUserInvestment();
				assert(tx);
			});

			it("should return user investment", async function () {
				const tx = await seniorPool.connect(accounts[6]).getUserInvestment();
				assert(tx);
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
			beforeEach(async function () {
				// accounts[5] is staking
				await uSDCTestToken.transfer(accounts[5].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[5])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[5]).stake(AMOUNT);

				// accounts[6] is staking
				await uSDCTestToken.transfer(accounts[6].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[6])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[6]).stake(AMOUNT);
			});

			it("should withdraw funds in user wallet", async function () {
				const userBeforeBalance = await uSDCTestToken.balanceOf(
					accounts[5].address
				);

				await expect(seniorPool.connect(accounts[5]).withdrawWithLP(AMOUNT))
					.to.emit(seniorPool, "Unstake")
					.withArgs(accounts[5].address, AMOUNT);

				const userAfterBalance = await uSDCTestToken.balanceOf(
					accounts[5].address
				);

				const seniorPoolBal = await seniorPool.seniorPoolBal();

				// as staked 2*AMOUNT
				assert.equal(seniorPoolBal.toString(), AMOUNT);
				assert.equal(userBeforeBalance.toString(), "0");
				assert.equal(userAfterBalance.toString(), AMOUNT);
			});

			it("should withdraw funds in user wallet", async function () {
				const userBeforeBalance = await uSDCTestToken.balanceOf(
					accounts[6].address
				);

				await expect(seniorPool.connect(accounts[6]).withdrawWithLP(AMOUNT))
					.to.emit(seniorPool, "Unstake")
					.withArgs(accounts[6].address, AMOUNT);

				const userAfterBalance = await uSDCTestToken.balanceOf(
					accounts[6].address
				);

				const seniorPoolBal = await seniorPool.seniorPoolBal();

				assert.equal(seniorPoolBal.toString(), AMOUNT);
				assert.equal(userBeforeBalance.toString(), "0");
				assert.equal(userAfterBalance.toString(), AMOUNT);
			});
		});

		describe("Negative cases", function () {
			it("reverts when user is not staking", async function () {
				await expect(seniorPool.withdrawWithLP(AMOUNT)).to.be.revertedWith(
					"User has not invested in this pool or amount should be greater than 0"
				);
			});

			it("reverts when user tries to withdraw more than he staked", async function () {
				// accounts[5] is staking
				await uSDCTestToken.transfer(accounts[5].address, AMOUNT);

				await uSDCTestToken
					.connect(accounts[5])
					.approve(seniorPool.address, AMOUNT);

				await seniorPool.connect(accounts[5]).stake(AMOUNT);

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
