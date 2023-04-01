const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const USDCAMOUNT = "9999999999000000";
const ID = ethers.utils.id("aadhar");
const AMOUNT = "100000000000";
let accounts;
let counter = 0;

describe("OpportunityOrigination", function () {
	let opportunityOrigination,
		dygnifyConfig,
		configHelper,
		collateralToken,
		opportunityPool,
		dygnifyKeeper,
		uSDCTestToken,
		seniorPool,
		lpToken,
		investor;

	beforeEach(async () => {
		accounts = await ethers.getSigners();
		// deploy DygnifyConfig.sol
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();

		// deploy OpportunityOrigination.sol
		const OpportunityOrigination = await ethers.getContractFactory(
			"OpportunityOrigination"
		);
		opportunityOrigination = await OpportunityOrigination.deploy();
		await opportunityOrigination.deployed();

		// deploy ConfigHelper.sol
		const ConfigHelper = await ethers.getContractFactory("ConfigHelper");
		configHelper = await ConfigHelper.deploy();
		await configHelper.deployed();

		// deploy DygnifyKeeper.sol
		const DygnifyKeeper = await hre.ethers.getContractFactory("DygnifyKeeper");
		dygnifyKeeper = await DygnifyKeeper.deploy();
		await dygnifyKeeper.deployed();

		// deploy CollateralToken.sol
		const CollateralToken = await ethers.getContractFactory("CollateralToken");
		collateralToken = await CollateralToken.deploy();
		await collateralToken.deployed();

		// deploy OpportunityPool.sol
		const OpportunityPool = await ethers.getContractFactory("OpportunityPool");
		opportunityPool = await OpportunityPool.deploy();
		await opportunityPool.deployed();

		// deploy USDCTestToken.sol

		const USDCTestToken = await ethers.getContractFactory("TestUSDCToken");
		uSDCTestToken = await USDCTestToken.deploy(USDCAMOUNT);
		await uSDCTestToken.deployed();

		// Senior pool deployment
		const SeniorPool = await hre.ethers.getContractFactory("SeniorPool");
		seniorPool = await SeniorPool.deploy();

		await seniorPool.deployed();

		// deploy LPToken.sol
		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();

		// Deploy Investor
		const Investor = await ethers.getContractFactory("Investor");
		investor = await Investor.deploy();
		await investor.deployed();

		// initialize dygnifyConfig and pass it to opportunityOrigination
		await dygnifyConfig.initialize();

		await dygnifyConfig.setAddress(1, lpToken.address);
		await dygnifyConfig.setAddress(2, uSDCTestToken.address);
		await dygnifyConfig.setAddress(3, seniorPool.address);
		await dygnifyConfig.setAddress(4, opportunityPool.address);
		await dygnifyConfig.setAddress(5, collateralToken.address);
		await dygnifyConfig.setAddress(7, investor.address);
		await dygnifyConfig.setAddress(6, opportunityOrigination.address);
		await dygnifyConfig.setAddress(9, dygnifyKeeper.address);

		await opportunityOrigination.initialize(dygnifyConfig.address);
		await seniorPool.initialize(dygnifyConfig.address);
		await lpToken.initialize(seniorPool.address);

		// Set all numbers
		// leverage ratio
		await dygnifyConfig.setNumber(0, 4);
		// Dygnify Fee
		await dygnifyConfig.setNumber(1, 100000);
		// OverDueFee
		await dygnifyConfig.setNumber(2, 5000000);
		// JuniorSubpoolFee
		await dygnifyConfig.setNumber(3, 200000);
		// second value should be the number of months for senior pool funds lockin for investor
		await dygnifyConfig.setNumber(4, 0);
		// WriteOffDays
		await dygnifyConfig.setNumber(5, 90);
		//AdjustmentOffset
		await dygnifyConfig.setNumber(6, 20);
		await dygnifyKeeper.initialize(dygnifyConfig.address);
		// initialize collateralToken
		await collateralToken.initialize(
			dygnifyConfig.address,
			opportunityOrigination.address
		);
		// Initialize the investor contract
		await investor.initialize(dygnifyConfig.address);

		console.log();
		console.log("opportunityOrigination : ", opportunityOrigination.address);
		console.log("opportunityPool : ", opportunityPool.address);
		console.log("uSDCTestToken : ", uSDCTestToken.address);
		console.log("seniorPool : ", seniorPool.address);
		console.log("lpToken : ", lpToken.address);
		console.log();

		if (counter < 1) {
			for (let i = 0; i < 10; i++) {
				console.log(`Account ${i}`, accounts[i].address);
			}
			counter += 1;
		}
	});

	describe("createOpportunity", function () {
		//	positive cases
		describe("Positive cases", function () {
			it("create opportunity given for term loan", async function () {
				const accounts = await ethers.getSigners();

				await opportunityOrigination.createOpportunity({
					borrower: accounts[2].address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: AMOUNT,
					loanTenureInDays: 360,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});
			});
		});
	});

	describe("assignUnderwriters", function () {
		describe("Positive cases", function () {
			it("given opportunityId assigns underwriter correctly", async function () {
				const accounts = await ethers.getSigners();

				await opportunityOrigination.createOpportunity({
					borrower: accounts[2].address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: AMOUNT,
					loanTenureInDays: 360,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					ID,
					accounts[0].address
				);
			});
		});
	});

	describe("voteOpportunity", function () {
		const voteOpportunity = (status, expected) =>
			async function () {
				const [borrower, underwriter] = await ethers.getSigners();

				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
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

				const id = ethers.utils.id("aadhar");
				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					id,
					underwriter.address
				);

				// call voteOpportunity function
				opportunityOrigination = opportunityOrigination.connect(underwriter);
				await opportunityOrigination.voteOpportunity(id, status);

				// check opportunityToId[id].opportunityStatus has current status
				const opportunityToIdFromContract =
					await opportunityOrigination.opportunityToId(id);

				assert.equal(opportunityToIdFromContract.opportunityStatus, expected);
			};

		describe("Positive cases", function () {
			it(
				"underwriter should reject opportunity successfully",
				voteOpportunity(1, 1)
			);

			it(
				"underwriter should approve opportunity and function should mint oppotunity and create opportunity pool successfully",
				voteOpportunity(2, 5)
			);

			it("underwriter is Unsure about opportunity", voteOpportunity(3, 3));
		});
	});

	describe("markDrawDown", function () {
		async function fun(borrower, underwriter, amount) {
			// create opportunity
			await opportunityOrigination.createOpportunity({
				borrower: borrower.address,
				opportunityName: "xyz",
				opportunityInfo: "for term loan",
				loanType: 1,
				loanAmount: amount,
				loanTenureInDays: 512,
				loanInterest: 10000000,
				paymentFrequencyInDays: 30,
				collateralDocument: "aadhar",
				capitalLoss: 10000000,
			});

			// call assignUnderwriters function
			await opportunityOrigination.assignUnderwriters(ID, underwriter.address);

			await opportunityOrigination.connect(underwriter).voteOpportunity(ID, 2);

			let opportunity = await opportunityOrigination.opportunityToId(ID);

			const poolAddress = opportunity.opportunityPoolAddress;

			opportunityPool = await ethers.getContractAt(
				"OpportunityPool",
				poolAddress
			);

			await uSDCTestToken.transfer(borrower.address, amount);
			await uSDCTestToken.connect(borrower).approve(seniorPool.address, amount);
			await seniorPool.connect(borrower).stake(amount);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(1);

			await seniorPool.approveUSDC(opportunityPool.address);
			await seniorPool.invest(ID);

			// deposit 20% of AMOUNT into junior Pool
			const amountToJunior = amount * 0.2;
			//	await uSDCTestToken.transfer(underwriter.address, 2 * amountToJunior);
			await uSDCTestToken.approve(opportunityPool.address, amountToJunior);
			await opportunityPool.deposit(0, amountToJunior);

			await opportunityPool.connect(borrower).drawdown();

			opportunity = await opportunityOrigination.opportunityToId(ID);

			assert(opportunity.opportunityStatus, 6);
		}

		describe("Positive cases", function () {
			it("should markdown opportunity for valid parameters", async function () {
				const accounts = await ethers.getSigners();
				fun(accounts[1], accounts[2], AMOUNT);
			});
		});
	});

	describe("markRepaid", function () {
		async function fun(borrower, underwriter, amount) {
			async function fun(borrower, underwriter, amount) {
				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: amount,
					loanTenureInDays: 360,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					ID,
					underwriter.address
				);

				await opportunityOrigination
					.connect(underwriter)
					.voteOpportunity(ID, 2);

				let opportunity = await opportunityOrigination.opportunityToId(ID);

				const poolAddress = opportunity.opportunityPoolAddress;

				opportunityPool = await ethers.getContractAt(
					"OpportunityPool",
					poolAddress
				);

				const seniorAmount = (amount * 0.8).toString();
				// deposit 20% of AMOUNT into junior Pool
				const amountToJunior = (amount - seniorAmount).toString();
				//	await usdcToken.transfer(underwriter.address, 2 * amountToJunior);
				await uSDCTestToken
					.connect(underwriter)
					.approve(opportunityPool.address, amountToJunior);

				await uSDCTestToken.transfer(underwriter.address, 2 * amountToJunior);
				await uSDCTestToken.transfer(borrower.address, 2 * seniorAmount);

				await uSDCTestToken
					.connect(borrower)
					.approve(seniorPool.address, seniorAmount);
				await opportunityPool.connect(underwriter).deposit(0, amountToJunior);
				// 80 %
				await uSDCTestToken.approve(seniorPool.address, seniorAmount);
				await seniorPool.connect(borrower).stake(seniorAmount);
				await opportunityPool.unLockPool(1);
				await seniorPool.approveUSDC(opportunityPool.address);
				await seniorPool.invest(ID);

				// Drawdown
				let beforeBalance = await uSDCTestToken.balanceOf(borrower.address);
				await opportunityPool.connect(borrower).drawdown();
				let afterBalance = await uSDCTestToken.balanceOf(borrower.address);
				// Opportunity status should marked as drawdown
				opportunity = await opportunityOrigination.opportunityToId(ID);
				expect(opportunity.opportunityStatus).to.equal(6);
				// Borrower should receive usdc
				expect(afterBalance.sub(beforeBalance)).to.equal(amount);

				//
				// Approve test usdc
				await uSDCTestToken
					.connect(borrower)
					.approve(opportunityPool.address, 100 * amount);
				const repaymentCount = await opportunityPool.totalRepayments();
				// Repayment
				for (let i = 0; i < repaymentCount; i++) {
					await opportunityPool.connect(borrower).repayment();
				}
				// Opportunity status should marked as repaid
				opportunity = await opportunityOrigination.opportunityToId(ID);
				expect(opportunity.opportunityStatus).to.equal(8);
			}
		}

		describe("Positive cases", function () {
			it("should markRepaid opportunity successfully for valid parameters", async function () {
				await fun(accounts[3], accounts[2], AMOUNT);
			});
		});
	});

	describe("markWriteOff", function () {
		async function fun(borrower, underwriter, amount) {
			// create opportunity
			await opportunityOrigination.createOpportunity({
				borrower: borrower.address,
				opportunityName: "xyz",
				opportunityInfo: "for term loan",
				loanType: 1,
				loanAmount: amount,
				loanTenureInDays: 360,
				loanInterest: 10000000,
				paymentFrequencyInDays: 30,
				collateralDocument: "aadhar",
				capitalLoss: 10000000,
			});

			// call assignUnderwriters function
			await opportunityOrigination.assignUnderwriters(ID, underwriter.address);

			await opportunityOrigination.connect(underwriter).voteOpportunity(ID, 2);

			let opportunity = await opportunityOrigination.opportunityToId(ID);

			const poolAddress = opportunity.opportunityPoolAddress;

			opportunityPool = await ethers.getContractAt(
				"OpportunityPool",
				poolAddress
			);

			const seniorAmount = (amount * 0.8).toString();
			// deposit 20% of AMOUNT into junior Pool
			const amountToJunior = (amount - seniorAmount).toString();
			//	await usdcToken.transfer(underwriter.address, 2 * amountToJunior);
			await uSDCTestToken
				.connect(underwriter)
				.approve(opportunityPool.address, amountToJunior);

			await uSDCTestToken.transfer(underwriter.address, 2 * amountToJunior);
			await uSDCTestToken.transfer(borrower.address, 2 * seniorAmount);

			await uSDCTestToken
				.connect(borrower)
				.approve(seniorPool.address, seniorAmount);
			await opportunityPool.connect(underwriter).deposit(0, amountToJunior);
			// 80 %
			await uSDCTestToken.approve(seniorPool.address, seniorAmount);
			await seniorPool.connect(borrower).stake(seniorAmount);
			await opportunityPool.unLockPool(1);
			await seniorPool.approveUSDC(opportunityPool.address);
			await seniorPool.invest(ID);

			// Drawdown
			let beforeBalance = await uSDCTestToken.balanceOf(borrower.address);
			await opportunityPool.connect(borrower).drawdown();
			let afterBalance = await uSDCTestToken.balanceOf(borrower.address);
			// Opportunity status should marked as drawdown
			opportunity = await opportunityOrigination.opportunityToId(ID);
			expect(opportunity.opportunityStatus).to.equal(6);
			// Borrower should receive usdc
			expect(afterBalance.sub(beforeBalance)).to.equal(amount);
		}
		describe("Positive cases", function () {
			it("markWriteOff opportunity", async function () {
				const accounts = await ethers.getSigners();
				await fun(accounts[1], accounts[3], AMOUNT);
			});
		});
	});
});
