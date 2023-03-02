const { expect } = require("chai");
const { ethers } = require("hardhat");

const overflow =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

describe("OpportunityPool", function () {
	let opportunityPool,
		opportunityOrigination,
		dygnifyConfig,
		accounting,
		investor,
		usdcToken,
		lpToken,
		seniorPool,
		owner,
		borrower,
		other,
		dygnifyTreasury;
	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		owner = accounts[0];
		borrower = accounts[1];
		dygnifyTreasury = accounts[2];
		other = accounts[3];
		// Deploy and initilize dygnifyConfig
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize();

		// Deploy accounting
		const AccountingLibrary = await ethers.getContractFactory(
			"AccoutingLibrary"
		);
		accounting = await AccountingLibrary.deploy();
		await accounting.deployed();

		// Deploy OpportunityPool
		const OpportunityPool = await ethers.getContractFactory("OpportunityPool");
		opportunityPool = await OpportunityPool.deploy();
		await opportunityPool.deployed();

		// Deploy Mock OpportunityOrigination
		const OpportunityOrigination = await ethers.getContractFactory(
			"MockOpportunityOriginationForOpportunityPool"
		);
		opportunityOrigination = await OpportunityOrigination.deploy(
			borrower.address
		);
		await opportunityOrigination.deployed();

		//Deploy and initialize Investor
		const Investor = await ethers.getContractFactory("MockInvestor");
		investor = await Investor.deploy();
		await investor.deployed();

		// Deploy and initialize USDC token
		const UsdcToken = await ethers.getContractFactory("UsdcToken");
		usdcToken = await UsdcToken.deploy();
		await usdcToken.deployed();
		await usdcToken.initialize();

		// Deploy lpToken
		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();

		// Deploy seniorPool
		const SeniorPool = await ethers.getContractFactory(
			"MockSeniorPoolForOpportunityPool"
		);
		seniorPool = await SeniorPool.deploy(opportunityPool.address);
		await seniorPool.deployed();

		// Setup addresses
		await dygnifyConfig.setAddress(2, usdcToken.address);
		await dygnifyConfig.setAddress(3, seniorPool.address);
		await dygnifyConfig.setAddress(6, opportunityOrigination.address);
		await dygnifyConfig.setAddress(7, investor.address);
		await dygnifyConfig.setAddress(8, dygnifyTreasury.address);

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
	});

	describe("initialize", function () {
		describe("positive cases", function () {
			it("1. should initialize", async function () {
				expect(
					await opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						180,
						"10000000",
						30,
						1
					)
				);
			});
			it("2. should initialize", async function () {
				expect(
					await opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						30,
						1
					)
				);
			});
			it("3. should initialize", async function () {
				expect(
					await opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						60,
						1
					)
				);
			});
			it("4. should initialize", async function () {
				expect(
					await opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						720,
						"10000000",
						90,
						1
					)
				);
			});
		});
		describe("negative cases", function () {
			it("should revert if 0 address passes as dygnifyConfig", async function () {
				await expect(
					opportunityPool.initialize(
						ethers.constants.AddressZero,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						30,
						1
					)
				).to.be.revertedWith("Invalid config address");
			});
		});
		describe("border cases", function () {
			it("should revert for overflow dygnifyAddress", async function () {
				await expect(
					opportunityPool.initialize(
						overflow,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for overflow opportunityID", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						overflow,
						"10000000000000",
						360,
						"10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for overflow loanAmount", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						overflow,
						360,
						"10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for overflow loanTenureInDays", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						overflow,
						"10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for overflow loanInterest", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						overflow,
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for overflow paymentFrequencyInDays", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						overflow,
						1
					)
				).to.be.reverted;
			});
			it("should revert for overflow loanType", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						30,
						overflow
					)
				).to.be.reverted;
			});
			it("should revert for underflow dygnifyConfig", async function () {
				await expect(
					opportunityPool.initialize(
						-1 * dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for underflow dygnifyConfig", async function () {
				await expect(
					opportunityPool.initialize(
						-1000000000,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for underflow opportunityID", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						-1111,
						"10000000000000",
						360,
						"10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for underflow loanAmount", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"-10000000000000",
						360,
						"10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for underflow loanTenureInDays", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						-360,
						"10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for underflow loanInterest", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"-10000000",
						30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for underflow paymentFrequencyInDays", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						-30,
						1
					)
				).to.be.reverted;
			});
			it("should revert for underflow opportunityID", async function () {
				await expect(
					opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						30,
						-1
					)
				).to.be.reverted;
			});
		});
	});

	describe("deposit", function () {
		describe("for senior pool", function () {
			beforeEach(async () => {
				// Transfer usdc to seniorPool
				await usdcToken.transfer(seniorPool.address, "50000000000000");

				// set allowance
				await seniorPool.setAllowance(
					usdcToken.address,
					opportunityPool.address,
					"100000000000000000000"
				);

				// Initialize OpportunityPool through MockSeniorPool
				await seniorPool.initPool(
					dygnifyConfig.address,
					ethers.utils.formatBytes32String("id1"),
					"10000000000000",
					360,
					"10000000",
					30,
					1
				);

				// Unlock seniorPool
				await opportunityPool.unLockPool(1);
			});

			describe("positive cases", function () {
				it("should deposit amount", async function () {
					expect(await seniorPool.deposit(1, "8000000000000")).to.emit(
						"Deposited"
					);
					expect(await usdcToken.balanceOf(opportunityPool.address)).to.equal(
						"8000000000000"
					);
				});
			});

			describe("negative cases", function () {
				it("should revert for SubpoolID : out of range", async function () {
					await expect(
						seniorPool.deposit(5, "8000000000000")
					).to.be.revertedWith("SubpoolID : out of range");
				});
				it("should revert if amount is zero", async function () {
					await expect(seniorPool.deposit(1, 0)).to.be.revertedWith(
						"Amount Must be greater than zero"
					);
				});
				it("should revert if senior subpool is locked", async function () {
					await opportunityPool.lockPool(1);
					await expect(
						opportunityPool.deposit(1, "8000000000000")
					).to.be.revertedWith("Senior Subpool is locked");
				});
				it("should revert if function executor is other than SeniorPool", async function () {
					await expect(
						opportunityPool.deposit(1, "8000000000000")
					).to.be.revertedWith(
						"You must have Senior pool role in order to deposit in senior subpool"
					);
				});
				it("should revert if amount exceeds the Total deposit limit of senior subpool", async function () {
					await expect(
						seniorPool.deposit(1, "1000000000000000")
					).to.be.revertedWith(
						"Amount exceeds the Total deposit limit of senior subpool"
					);
				});
			});

			describe("border cases", function () {
				it("should revert for overflow amount", async function () {
					await expect(seniorPool.deposit(1, overflow)).to.be.reverted;
				});
				it("should revert for overflow subpoolId", async function () {
					await expect(seniorPool.deposit(overflow, "8000000000000")).to.be
						.reverted;
				});
				it("should revert for underflow amount", async function () {
					await expect(seniorPool.deposit(1, "-8000000000000")).to.be.reverted;
				});
				it("should revert for underflow subpoolId", async function () {
					await expect(seniorPool.deposit(-1, "8000000000000")).to.be.reverted;
				});
			});
		});

		describe("for junior pool", function () {
			beforeEach(async () => {
				// set allowance
				await usdcToken.approve(
					opportunityPool.address,
					"100000000000000000000"
				);

				// Initialize OpportunityPool
				await opportunityPool.initialize(
					dygnifyConfig.address,
					ethers.utils.formatBytes32String("id1"),
					"10000000000000",
					360,
					"10000000",
					30,
					1
				);

				// Unlock juniorPool
				await opportunityPool.unLockPool(0);
			});

			describe("positive cases", function () {
				it("should deposit amount", async function () {
					expect(await opportunityPool.deposit(0, "2000000000000")).to.emit(
						"Deposited"
					);
					expect(await usdcToken.balanceOf(opportunityPool.address)).to.equal(
						"2000000000000"
					);
				});
			});

			describe("negative cases", function () {
				it("should revert for SubpoolID : out of range", async function () {
					await expect(
						opportunityPool.deposit(5, "2000000000000")
					).to.be.revertedWith("SubpoolID : out of range");
				});
				it("should revert if amount is zero", async function () {
					await expect(opportunityPool.deposit(0, 0)).to.be.revertedWith(
						"Amount Must be greater than zero"
					);
				});
				it("should revert if junior subpool is locked", async function () {
					await opportunityPool.lockPool(0);
					await expect(
						opportunityPool.deposit(0, "2000000000000")
					).to.be.revertedWith("Junior Subpool is locked");
				});
				it("should revert if amount exceeds the Total deposit limit of junior subpool", async function () {
					await expect(
						opportunityPool.deposit(0, "1000000000000000")
					).to.be.revertedWith(
						"Amount exceeds the Total deposit limit of junior subpool"
					);
				});
			});

			describe("border cases", function () {
				it("should revert for overflow amount", async function () {
					await expect(opportunityPool.deposit(0, overflow)).to.be.reverted;
				});
				it("should revert for overflow subpoolId", async function () {
					await expect(opportunityPool.deposit(overflow, "2000000000000")).to.be
						.reverted;
				});
				it("should revert for underflow amount", async function () {
					await expect(opportunityPool.deposit(0, "-2000000000000")).to.be
						.reverted;
				});
				it("should revert for underflow subpoolId", async function () {
					await expect(opportunityPool.deposit(-1, "2000000000000")).to.be
						.reverted;
				});
			});
		});
	});

	describe("drawdown", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "50000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");

			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			// set allowance
			await usdcToken.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(0);
			await opportunityPool.unLockPool(1);

			// Deposit
			await opportunityPool.deposit(0, "2000000000000");
		});
		describe("positive cases", function () {
			it("should drawdown", async function () {
				await seniorPool.deposit(1, "8000000000000");
				expect(await opportunityPool.connect(borrower).drawdown());
				expect(await usdcToken.balanceOf(opportunityPool.address)).to.equal(0);
			});
		});

		describe("negative cases", function () {
			it("should revert if function executor other than borrower", async function () {
				await seniorPool.deposit(1, "8000000000000");
				await expect(opportunityPool.drawdown()).to.be.revertedWith(
					"Must have borrower role to perform this action"
				);
			});
			it("should revert if funds in opportunity are already drawdown", async function () {
				await seniorPool.deposit(1, "8000000000000");
				await opportunityOrigination.markDrawDown(
					ethers.utils.formatBytes32String("id1")
				);
				await expect(
					opportunityPool.connect(borrower).drawdown()
				).to.be.revertedWith("Funds in opportunity are already drawdown.");
			});
			it("should revert if total deposited amount in opportunity pool not equal to loan amount", async function () {
				await seniorPool.deposit(1, "5000000000000");
				await expect(
					opportunityPool.connect(borrower).drawdown()
				).to.be.revertedWith(
					"Total Deposited amount in opportunity pool must be equal to loan amount"
				);
			});
		});
	});

	describe("repayment", function () {
		describe("for term loan", function () {
			beforeEach(async () => {
				// Transfer usdc to seniorPool
				await usdcToken.transfer(seniorPool.address, "8000000000000");
				// Transfer usdc to borrower
				await usdcToken.transfer(borrower.address, "50000000000000");
				// set allowance
				await seniorPool.setAllowance(
					usdcToken.address,
					opportunityPool.address,
					"100000000000000000000"
				);
				await usdcToken
					.connect(borrower)
					.approve(opportunityPool.address, "100000000000000000000");
				await usdcToken
					.connect(owner)
					.approve(opportunityPool.address, "100000000000000000000");
			});

			async function initPool({
				dygnifyConfig,
				opportunityID,
				loanAmount,
				loanTenureInDays,
				loanInterest,
				paymentFrequencyInDays,
				loanType,
			}) {
				// Initialize OpportunityPool
				await opportunityPool.initialize(
					dygnifyConfig,
					opportunityID,
					loanAmount,
					loanTenureInDays,
					loanInterest,
					paymentFrequencyInDays,
					loanType
				);

				// Unlock juniorPool and seniorPool
				await opportunityPool.unLockPool(0);
				await opportunityPool.unLockPool(1);

				// Deposit
				await opportunityPool.deposit(0, "2000000000000");
				await seniorPool.deposit(1, "8000000000000");
			}

			describe("positive cases", function () {
				it("1. should repayment", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
				});
				it("2. should repayment", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
				});
				it("3. should repayment", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
				});
				it("4. should repayment", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
				});
				it("1. after repayment, totalOutstandingPrincipal should decrease", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const amount = await opportunityPool.getRepaymentAmount();
					const previousPrincipal =
						await opportunityPool.totalOutstandingPrincipal();
					const interest = await accounting.getTermLoanInterest(
						previousPrincipal,
						30,
						10000000
					);
					const remainingPrincipal = amount - interest - 20;
					await opportunityPool.connect(borrower).repayment();
					const afterPrincipal =
						await opportunityPool.totalOutstandingPrincipal();
					expect(previousPrincipal - afterPrincipal).to.equal(
						remainingPrincipal
					);
				});
				it("2. after repayment, totalOutstandingPrincipal should decrease", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const amount = await opportunityPool.getRepaymentAmount();
					const previousPrincipal =
						await opportunityPool.totalOutstandingPrincipal();
					const interest = await accounting.getTermLoanInterest(
						previousPrincipal,
						30,
						10000000
					);
					const remainingPrincipal = amount - interest - 20;
					await opportunityPool.connect(borrower).repayment();
					const afterPrincipal =
						await opportunityPool.totalOutstandingPrincipal();
					expect(previousPrincipal - afterPrincipal).to.equal(
						remainingPrincipal
					);
				});
				it("3. after repayment, totalOutstandingPrincipal should decrease", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const amount = await opportunityPool.getRepaymentAmount();
					const previousPrincipal =
						await opportunityPool.totalOutstandingPrincipal();
					const interest = await accounting.getTermLoanInterest(
						previousPrincipal,
						60,
						10000000
					);
					const remainingPrincipal = amount - interest - 20;
					await opportunityPool.connect(borrower).repayment();
					const afterPrincipal =
						await opportunityPool.totalOutstandingPrincipal();
					expect(previousPrincipal - afterPrincipal).to.equal(
						remainingPrincipal
					);
				});
				it("4. after repayment, totalOutstandingPrincipal should decrease", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const amount = await opportunityPool.getRepaymentAmount();
					const previousPrincipal =
						await opportunityPool.totalOutstandingPrincipal();
					const interest = await accounting.getTermLoanInterest(
						previousPrincipal,
						90,
						10000000
					);
					const remainingPrincipal = amount - interest - 20;
					await opportunityPool.connect(borrower).repayment();
					const afterPrincipal =
						await opportunityPool.totalOutstandingPrincipal();
					expect(previousPrincipal - afterPrincipal).to.equal(
						remainingPrincipal
					);
				});
				it("after repayment, repayment counter should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const previousCounter = await opportunityPool.repaymentCounter();
					await opportunityPool.connect(borrower).repayment();
					const afterCounter = await opportunityPool.repaymentCounter();
					expect(afterCounter - previousCounter).to.equal(1);
				});
				it("1. after repayment, senior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const interest = await accounting.getTermLoanInterest(
						await opportunityPool.totalOutstandingPrincipal(),
						30,
						10000000
					);
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						interest,
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[0]);
				});
				it("2. after repayment, senior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const interest = await accounting.getTermLoanInterest(
						await opportunityPool.totalOutstandingPrincipal(),
						30,
						10000000
					);
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						interest,
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[0]);
				});
				it("3. after repayment, senior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const interest = await accounting.getTermLoanInterest(
						await opportunityPool.totalOutstandingPrincipal(),
						60,
						10000000
					);
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						interest,
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[0]);
				});
				it("4. after repayment, senior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const interest = await accounting.getTermLoanInterest(
						await opportunityPool.totalOutstandingPrincipal(),
						90,
						10000000
					);
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						interest,
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[0]);
				});
				it("1. after repayment, junior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const interest = await accounting.getTermLoanInterest(
						await opportunityPool.totalOutstandingPrincipal(),
						30,
						10000000
					);
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						interest,
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[1]);
				});
				it("2. after repayment, junior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const interest = await accounting.getTermLoanInterest(
						await opportunityPool.totalOutstandingPrincipal(),
						30,
						10000000
					);
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						interest,
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[1]);
				});
				it("3. after repayment, junior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const interest = await accounting.getTermLoanInterest(
						await opportunityPool.totalOutstandingPrincipal(),
						60,
						10000000
					);
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						interest,
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[1]);
				});
				it("4. after repayment, junior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const interest = await accounting.getTermLoanInterest(
						await opportunityPool.totalOutstandingPrincipal(),
						90,
						10000000
					);
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						interest,
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[1]);
				});
				it("after repayment borrower balance should decrease", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const before = await usdcToken.balanceOf(borrower.address);
					await opportunityPool.connect(borrower).repayment();
					const after = await usdcToken.balanceOf(borrower.address);
					expect(before.sub(after)).to.equal(
						await opportunityPool.getRepaymentAmount()
					);
				});
				it("after repayment, next repayment time should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					const previousRepaymentTime =
						await opportunityPool.nextRepaymentTime();
					await opportunityPool.connect(borrower).repayment();
					const afterRepaymentTime = await opportunityPool.nextRepaymentTime();
					expect(afterRepaymentTime.sub(previousRepaymentTime)).to.be.above(0);
				});
				it("treasury should receive fee", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
					expect(await usdcToken.balanceOf(dygnifyTreasury.address)).to.equal(
						8333333333
					);
				});
				it("1. after all repayment, senior deposited amount should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(
						(await opportunityPool.seniorSubpoolDetails()).depositedAmount
					).to.equal(0);
				});
				it("2. after all repayment, senior deposited amount should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 12; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(
						(await opportunityPool.seniorSubpoolDetails()).depositedAmount
					).to.equal(0);
				});
				it("3. after all repayment, senior deposited amount should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(
						(await opportunityPool.seniorSubpoolDetails()).depositedAmount
					).to.equal(0);
				});
				it("4. after all repayment, senior deposited amount should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 8; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(
						(await opportunityPool.seniorSubpoolDetails()).depositedAmount
					).to.equal(0);
				});
				it("1. after all repayment outstanding principal should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(await opportunityPool.totalOutstandingPrincipal()).to.be.below(
						500
					);
				});
				it("2. after all repayment outstanding principal should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 12; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(await opportunityPool.totalOutstandingPrincipal()).to.be.below(
						500
					);
				});
				it("3. after all repayment outstanding principal should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(await opportunityPool.totalOutstandingPrincipal()).to.be.below(
						500
					);
				});
				it("4. after all repayment outstanding principal should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 8; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(await opportunityPool.totalOutstandingPrincipal()).to.be.below(
						500
					);
				});
				it("1. after all repayment, senior yield should set 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(0);
				});
				it("2. after all repayment, senior yield should set 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 12; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(0);
				});
				it("3. after all repayment, senior yield should set 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(0);
				});
				it("4. after all repayment, senior yield should set 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 8; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(0);
				});
				it("1. after all repayment, junior yield should match", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					let yield = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					for (let i = 0; i < 6; i++) {
						let interest = await accounting.getTermLoanInterest(
							await opportunityPool.totalOutstandingPrincipal(),
							30,
							10000000
						);
						let res = await accounting.getInterestDistribution(
							100000,
							200000,
							interest,
							4,
							10000000000000,
							(
								await opportunityPool.seniorSubpoolDetails()
							).totalDepositable
						);
						yield = yield.add(res[1]);
						await opportunityPool.connect(borrower).repayment();
					}
					let after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(yield);
				});
				it("2. after all repayment, junior yield should match", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					let yield = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					for (let i = 0; i < 12; i++) {
						let interest = await accounting.getTermLoanInterest(
							await opportunityPool.totalOutstandingPrincipal(),
							30,
							10000000
						);
						let res = await accounting.getInterestDistribution(
							100000,
							200000,
							interest,
							4,
							10000000000000,
							(
								await opportunityPool.seniorSubpoolDetails()
							).totalDepositable
						);
						yield = yield.add(res[1]);
						await opportunityPool.connect(borrower).repayment();
					}
					let after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(yield);
				});
				it("3. after all repayment, junior yield should match", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					let yield = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					for (let i = 0; i < 6; i++) {
						let interest = await accounting.getTermLoanInterest(
							await opportunityPool.totalOutstandingPrincipal(),
							60,
							10000000
						);
						let res = await accounting.getInterestDistribution(
							100000,
							200000,
							interest,
							4,
							10000000000000,
							(
								await opportunityPool.seniorSubpoolDetails()
							).totalDepositable
						);
						yield = yield.add(res[1]);
						await opportunityPool.connect(borrower).repayment();
					}
					let after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(yield);
				});
				it("4. after all repayment, junior yield should match", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					let yield = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					for (let i = 0; i < 8; i++) {
						let interest = await accounting.getTermLoanInterest(
							await opportunityPool.totalOutstandingPrincipal(),
							90,
							10000000
						);
						let res = await accounting.getInterestDistribution(
							100000,
							200000,
							interest,
							4,
							10000000000000,
							(
								await opportunityPool.seniorSubpoolDetails()
							).totalDepositable
						);
						yield = yield.add(res[1]);
						await opportunityPool.connect(borrower).repayment();
					}
					let after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(yield);
				});
				it("after all repayment seniorPool should receive seniorAmount", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 12; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(await usdcToken.balanceOf(seniorPool.address)).to.equal(
						"8307947621828"
					);
				});
			});

			describe("negative cases", function () {
				beforeEach(async () => {
					// Initialize OpportunityPool
					await opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						30,
						1
					);

					// Unlock juniorPool and seniorPool
					await opportunityPool.unLockPool(0);
					await opportunityPool.unLockPool(1);

					// Deposit
					await opportunityPool.deposit(0, "2000000000000");
					await seniorPool.deposit(1, "8000000000000");
				});
				it("should revert if function executor other than borrower", async function () {
					await opportunityPool.connect(borrower).drawdown();
					await expect(
						opportunityPool.connect(owner).repayment()
					).to.be.revertedWith(
						"Must have borrower role to perform this action"
					);
				});
				it("should revert if replayment is done", async function () {
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 12; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					await expect(
						opportunityPool.connect(borrower).repayment()
					).to.be.revertedWith("Repayment Process is done");
				});
				it("should revert if funds in opportunity haven't drawdown", async function () {
					await expect(
						opportunityPool.connect(borrower).repayment()
					).to.be.revertedWith("Funds in opportunity haven't drawdown yet.");
				});
			});
		});

		describe("for bullet loan", function () {
			beforeEach(async () => {
				// Transfer usdc to seniorPool
				await usdcToken.transfer(seniorPool.address, "8000000000000");
				// Transfer usdc to borrower
				await usdcToken.transfer(borrower.address, "50000000000000");
				// set allowance
				await seniorPool.setAllowance(
					usdcToken.address,
					opportunityPool.address,
					"100000000000000000000"
				);
				await usdcToken
					.connect(borrower)
					.approve(opportunityPool.address, "100000000000000000000");
				await usdcToken
					.connect(owner)
					.approve(opportunityPool.address, "100000000000000000000");
			});

			async function initPool({
				dygnifyConfig,
				opportunityID,
				loanAmount,
				loanTenureInDays,
				loanInterest,
				paymentFrequencyInDays,
				loanType,
			}) {
				// Initialize OpportunityPool
				await opportunityPool.initialize(
					dygnifyConfig,
					opportunityID,
					loanAmount,
					loanTenureInDays,
					loanInterest,
					paymentFrequencyInDays,
					loanType
				);

				// Unlock juniorPool and seniorPool
				await opportunityPool.unLockPool(0);
				await opportunityPool.unLockPool(1);

				// Deposit
				await opportunityPool.deposit(0, "2000000000000");
				await seniorPool.deposit(1, "8000000000000");
			}

			describe("positive cases", function () {
				it("1. should repayment", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
				});
				it("2. should repayment", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
				});
				it("3. should repayment", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
				});
				it("4. should repayment", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
				});
				it("after repayment, repayment counter should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const previousCounter = await opportunityPool.repaymentCounter();
					await opportunityPool.connect(borrower).repayment();
					const afterCounter = await opportunityPool.repaymentCounter();
					expect(afterCounter - previousCounter).to.equal(1);
				});
				it("1. after repayment, senior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						await opportunityPool.emiAmount(),
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[0]);
				});
				it("2. after repayment, senior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						await opportunityPool.emiAmount(),
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[0]);
				});
				it("3. after repayment, senior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						await opportunityPool.emiAmount(),
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[0]);
				});
				it("4. after repayment, senior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						await opportunityPool.emiAmount(),
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[0]);
				});
				it("1. after repayment, junior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						await opportunityPool.emiAmount(),
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[1]);
				});
				it("2. after repayment, junior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						await opportunityPool.emiAmount(),
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[1]);
				});
				it("3. after repayment, junior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						await opportunityPool.emiAmount(),
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[1]);
				});
				it("4. after repayment, junior yield should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const res = await accounting.getInterestDistribution(
						100000,
						200000,
						await opportunityPool.emiAmount(),
						4,
						10000000000000,
						(
							await opportunityPool.seniorSubpoolDetails()
						).totalDepositable
					);
					const before = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(await opportunityPool.connect(borrower).repayment());
					const after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after - before).to.equal(res[1]);
				});
				it("after repayment borrower balance should decrease", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const before = await usdcToken.balanceOf(borrower.address);
					await opportunityPool.connect(borrower).repayment();
					const after = await usdcToken.balanceOf(borrower.address);
					expect(before.sub(after)).to.equal(
						await opportunityPool.getRepaymentAmount()
					);
				});
				it("after repayment, next repayment time should increase", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					const previousRepaymentTime =
						await opportunityPool.nextRepaymentTime();
					await opportunityPool.connect(borrower).repayment();
					const afterRepaymentTime = await opportunityPool.nextRepaymentTime();
					expect(afterRepaymentTime.sub(previousRepaymentTime)).to.be.above(0);
				});
				it("treasury should receive fee", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					expect(await opportunityPool.connect(borrower).repayment());
					expect(await usdcToken.balanceOf(dygnifyTreasury.address)).to.equal(
						8333333333
					);
				});
				it("1. after all repayment, senior deposited amount should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(
						(await opportunityPool.seniorSubpoolDetails()).depositedAmount
					).to.equal(0);
				});
				it("2. after all repayment, senior deposited amount should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 12; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(
						(await opportunityPool.seniorSubpoolDetails()).depositedAmount
					).to.equal(0);
				});
				it("3. after all repayment, senior deposited amount should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(
						(await opportunityPool.seniorSubpoolDetails()).depositedAmount
					).to.equal(0);
				});
				it("4. after all repayment, senior deposited amount should 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 1,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 8; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(
						(await opportunityPool.seniorSubpoolDetails()).depositedAmount
					).to.equal(0);
				});
				it("1. after all repayment, senior yield should set 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(0);
				});
				it("2. after all repayment, senior yield should set 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 12; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(0);
				});
				it("3. after all repayment, senior yield should set 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 6; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(0);
				});
				it("4. after all repayment, senior yield should set 0", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 8; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					const after = (await opportunityPool.seniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(0);
				});
				it("1. after all repayment, junior yield should match", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 180,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					let yield = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					for (let i = 0; i < 6; i++) {
						let res = await accounting.getInterestDistribution(
							100000,
							200000,
							await opportunityPool.emiAmount(),
							4,
							10000000000000,
							(
								await opportunityPool.seniorSubpoolDetails()
							).totalDepositable
						);
						yield = yield.add(res[1]);
						await opportunityPool.connect(borrower).repayment();
					}
					let after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(yield);
				});
				it("2. after all repayment, junior yield should match", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					let yield = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					for (let i = 0; i < 12; i++) {
						let res = await accounting.getInterestDistribution(
							100000,
							200000,
							await opportunityPool.emiAmount(),
							4,
							10000000000000,
							(
								await opportunityPool.seniorSubpoolDetails()
							).totalDepositable
						);
						yield = yield.add(res[1]);
						await opportunityPool.connect(borrower).repayment();
					}
					let after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(yield);
				});
				it("3. after all repayment, junior yield should match", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 60,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					let yield = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					for (let i = 0; i < 6; i++) {
						let res = await accounting.getInterestDistribution(
							100000,
							200000,
							await opportunityPool.emiAmount(),
							4,
							10000000000000,
							(
								await opportunityPool.seniorSubpoolDetails()
							).totalDepositable
						);
						yield = yield.add(res[1]);
						await opportunityPool.connect(borrower).repayment();
					}
					let after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(yield);
				});
				it("4. after all repayment, junior yield should match", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 720,
						loanInterest: "10000000",
						paymentFrequencyInDays: 90,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					let yield = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					for (let i = 0; i < 8; i++) {
						let res = await accounting.getInterestDistribution(
							100000,
							200000,
							await opportunityPool.emiAmount(),
							4,
							10000000000000,
							(
								await opportunityPool.seniorSubpoolDetails()
							).totalDepositable
						);
						yield = yield.add(res[1]);
						await opportunityPool.connect(borrower).repayment();
					}
					let after = (await opportunityPool.juniorSubpoolDetails())
						.yieldGenerated;
					expect(after).to.equal(yield);
				});
				it("after all repayment seniorPool should receive seniorAmount", async function () {
					await initPool({
						dygnifyConfig: dygnifyConfig.address,
						opportunityID: ethers.utils.formatBytes32String("id1"),
						loanAmount: "10000000000000",
						loanTenureInDays: 360,
						loanInterest: "10000000",
						paymentFrequencyInDays: 30,
						loanType: 0,
					});
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 12; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					expect(await usdcToken.balanceOf(seniorPool.address)).to.equal(
						"8559999999992"
					);
				});
			});

			describe("negative cases", function () {
				beforeEach(async () => {
					// Initialize OpportunityPool
					await opportunityPool.initialize(
						dygnifyConfig.address,
						ethers.utils.formatBytes32String("id1"),
						"10000000000000",
						360,
						"10000000",
						30,
						0
					);

					// Unlock juniorPool and seniorPool
					await opportunityPool.unLockPool(0);
					await opportunityPool.unLockPool(1);

					// Deposit
					await opportunityPool.deposit(0, "2000000000000");
					await seniorPool.deposit(1, "8000000000000");
				});
				it("should revert if function executor other than borrower", async function () {
					await opportunityPool.connect(borrower).drawdown();
					await expect(
						opportunityPool.connect(owner).repayment()
					).to.be.revertedWith(
						"Must have borrower role to perform this action"
					);
				});
				it("should revert if replayment is done", async function () {
					await opportunityPool.connect(borrower).drawdown();
					for (let i = 0; i < 12; i++) {
						await opportunityPool.connect(borrower).repayment();
					}
					await expect(
						opportunityPool.connect(borrower).repayment()
					).to.be.revertedWith("Repayment Process is done");
				});
				it("should revert if funds in opportunity haven't drawdown", async function () {
					await expect(
						opportunityPool.connect(borrower).repayment()
					).to.be.revertedWith("Funds in opportunity haven't drawdown yet.");
				});
			});
		});
	});

	describe("withdrawAll", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "8000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");
			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			await usdcToken
				.connect(borrower)
				.approve(opportunityPool.address, "100000000000000000000");
			await usdcToken
				.connect(owner)
				.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(0);
			await opportunityPool.unLockPool(1);

			// Deposit
			await opportunityPool.deposit(0, "2000000000000");
			await seniorPool.deposit(1, "8000000000000");
		});

		describe("positive cases", function () {
			it("should withdraw for seniorPool", async function () {
				expect(await seniorPool.withdrawAll(1));
				expect(await usdcToken.balanceOf(seniorPool.address)).to.equal(
					"8000000000000"
				);
			});
			it("should withdraw for juniorPool", async function () {
				await opportunityPool.connect(borrower).drawdown();
				for (let i = 0; i < 12; i++) {
					await opportunityPool.connect(borrower).repayment();
				}
				expect(await opportunityPool.withdrawAll(0));
			});
		});

		describe("negative cases", function () {
			it("should revert for invalid subpoolId", async function () {
				await expect(seniorPool.withdrawAll(5)).to.be.revertedWith(
					"SubpoolID : out of range"
				);
			});
			it("should revert if senior subpool is locked", async function () {
				await opportunityPool.lockPool(1);
				await expect(seniorPool.withdrawAll(1)).to.be.revertedWith(
					"Senior Subpool is locked"
				);
			});
			it("should revert if junior subpool is locked", async function () {
				await opportunityPool.lockPool(0);
				await expect(opportunityPool.withdrawAll(0)).to.be.revertedWith(
					"Junior Subpool is locked"
				);
			});
			it("should revert for senior subpool if function executer is SeniorPool", async function () {
				await expect(opportunityPool.withdrawAll(1)).to.be.revertedWith(
					"You must have Senior pool role in order to deposit in senior subpool"
				);
			});
			it("should revert if junior pool have zero amount deposited", async function () {
				await expect(seniorPool.withdrawAll(0)).to.be.revertedWith(
					"zero amount to deposit."
				);
			});
			it("should revert if junior pool don't have Liquidity", async function () {
				await opportunityPool.connect(borrower).drawdown();
				await opportunityPool.connect(borrower).repayment();
				await expect(opportunityPool.withdrawAll(0)).to.be.revertedWith(
					"currently junior subpool don't have Liquidity"
				);
			});
		});
	});

	describe("getUserWithdrawableAmount", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "8000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");
			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			await usdcToken
				.connect(borrower)
				.approve(opportunityPool.address, "100000000000000000000");
			await usdcToken
				.connect(owner)
				.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(0);
			await opportunityPool.unLockPool(1);

			// Deposit
			await seniorPool.deposit(1, "8000000000000");
		});

		describe("positive cases", function () {
			it("should get user withdrawable amount", async function () {
				await opportunityPool.deposit(0, "2000000000000");
				expect(await opportunityPool.getUserWithdrawableAmount()).to.equal(
					2186968000000
				);
			});
		});

		describe("negative cases", function () {
			it("should revert if zero amount deposited", async function () {
				await expect(
					opportunityPool.getUserWithdrawableAmount()
				).to.be.revertedWith("zero amount to deposited.");
			});
		});
	});

	describe("getRepaymentAmount", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "8000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");
			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			await usdcToken
				.connect(borrower)
				.approve(opportunityPool.address, "100000000000000000000");
			await usdcToken
				.connect(owner)
				.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(0);
			await opportunityPool.unLockPool(1);

			// Deposit
			await opportunityPool.deposit(0, "2000000000000");
			await seniorPool.deposit(1, "8000000000000");
		});

		describe("positive cases", function () {
			it("should get user repayment amount", async function () {
				await opportunityOrigination.markDrawDown(
					ethers.utils.formatBytes32String("id1")
				);
				expect(await opportunityPool.getRepaymentAmount());
			});
		});

		describe("negative cases", function () {
			it("should revert if repayment is done", async function () {
				await expect(opportunityPool.getRepaymentAmount()).to.be.revertedWith(
					"Funds in opportunity haven't drawdown yet."
				);
			});
		});
	});

	describe("getOverDuePercentage", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "8000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");
			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			await usdcToken
				.connect(borrower)
				.approve(opportunityPool.address, "100000000000000000000");
			await usdcToken
				.connect(owner)
				.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(0);
			await opportunityPool.unLockPool(1);

			// Deposit
			await opportunityPool.deposit(0, "2000000000000");
			await seniorPool.deposit(1, "8000000000000");
		});

		it("should get overdue percentage", async function () {
			const [seniorOverDuePerecentage, juniorOverDuePerecentage] =
				await opportunityPool.getOverDuePercentage();
			expect(seniorOverDuePerecentage.toString()).to.equal("3695328");
			expect(juniorOverDuePerecentage.toString()).to.equal("2243616");
		});
	});

	describe("nextRepaymentTime", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "8000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");
			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			await usdcToken
				.connect(borrower)
				.approve(opportunityPool.address, "100000000000000000000");
			await usdcToken
				.connect(owner)
				.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(0);
			await opportunityPool.unLockPool(1);

			// Deposit
			await opportunityPool.deposit(0, "2000000000000");
			await seniorPool.deposit(1, "8000000000000");
		});

		it("should get next repayment time", async function () {
			expect(await opportunityPool.nextRepaymentTime()).to.equal(2592000);
		});
	});

	describe("getSeniorTotalDepositable", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "8000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");
			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			await usdcToken
				.connect(borrower)
				.approve(opportunityPool.address, "100000000000000000000");
			await usdcToken
				.connect(owner)
				.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(0);
			await opportunityPool.unLockPool(1);

			// Deposit
			await opportunityPool.deposit(0, "2000000000000");
			await seniorPool.deposit(1, "8000000000000");
		});

		it("should get senior pool depositable", async function () {
			expect(await opportunityPool.getSeniorTotalDepositable()).to.equal(
				"8000000000000"
			);
		});
	});

	describe("getSeniorProfit", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "8000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");
			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			await usdcToken
				.connect(borrower)
				.approve(opportunityPool.address, "100000000000000000000");
			await usdcToken
				.connect(owner)
				.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(0);
			await opportunityPool.unLockPool(1);

			// Deposit
			await opportunityPool.deposit(0, "2000000000000");
			await seniorPool.deposit(1, "8000000000000");
		});

		it("should get senior pool profit", async function () {
			await opportunityPool.connect(borrower).drawdown();
			await opportunityPool.connect(borrower).repayment();
			expect(await opportunityPool.getSeniorProfit()).to.equal("46666666666");
		});
	});

	describe("lockPool", function () {
		beforeEach(async () => {
			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool
			await opportunityPool.unLockPool(0);
		});

		describe("positive cases", function () {
			it("should lock pool", async function () {
				expect(await opportunityPool.lockPool(0));
			});
		});

		describe("negative cases", function () {
			it("should revert if function executor not poolLocker", async function () {
				await expect(
					opportunityPool.connect(other).lockPool(0)
				).to.be.revertedWith("Must have borrower role to perform this action");
			});
		});
	});

	describe("unLockPool", function () {
		beforeEach(async () => {
			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);
		});

		describe("positive cases", function () {
			it("should unlock pool", async function () {
				expect(await opportunityPool.unLockPool(0));
			});
		});

		describe("negative cases", function () {
			it("should revert if function executor not poolLocker", async function () {
				await expect(
					opportunityPool.connect(other).unLockPool(0)
				).to.be.revertedWith("Must have borrower role to perform this action");
			});
		});
	});

	describe("getOpportunityName", function () {
		beforeEach(async () => {
			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);
		});

		it("should get opportunity name", async function () {
			expect(await seniorPool.getOpportunityName()).to.equal("Opportunity1");
		});
	});

	describe("writeOffOpportunity", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "8000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");
			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			await usdcToken
				.connect(borrower)
				.approve(opportunityPool.address, "100000000000000000000");
			await usdcToken
				.connect(owner)
				.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(0);
			await opportunityPool.unLockPool(1);

			// Deposit
			await opportunityPool.deposit(0, "2000000000000");
			await seniorPool.deposit(1, "8000000000000");
		});

		describe("positive cases", function () {
			it("should writeoff opportunity", async function () {
				expect(
					await opportunityOrigination.writeOffOpportunity(
						opportunityPool.address
					)
				);
			});
		});

		describe("negative cases", function () {
			it("should revert if function executor is not OpportunityOrigination", async function () {
				await expect(opportunityPool.writeOffOpportunity()).to.be.revertedWith(
					"Only OpportunityOrigination can execute writeoff"
				);
			});
		});
	});

	describe("getSeniorPoolWithdrawableAmount", function () {
		beforeEach(async () => {
			// Transfer usdc to seniorPool
			await usdcToken.transfer(seniorPool.address, "8000000000000");
			// Transfer usdc to borrower
			await usdcToken.transfer(borrower.address, "50000000000000");
			// set allowance
			await seniorPool.setAllowance(
				usdcToken.address,
				opportunityPool.address,
				"100000000000000000000"
			);
			await usdcToken
				.connect(borrower)
				.approve(opportunityPool.address, "100000000000000000000");
			await usdcToken
				.connect(owner)
				.approve(opportunityPool.address, "100000000000000000000");

			// Initialize OpportunityPool
			await opportunityPool.initialize(
				dygnifyConfig.address,
				ethers.utils.formatBytes32String("id1"),
				"10000000000000",
				360,
				"10000000",
				30,
				1
			);

			// Unlock seniorPool
			await opportunityPool.unLockPool(1);

			// Deposit
			await opportunityPool.deposit(0, "2000000000000");
			await seniorPool.deposit(1, "8000000000000");
		});

		describe("positive cases", function () {
			it("should get seniorPool withdrawable amount", async function () {
				expect(
					await opportunityPool.getSeniorPoolWithdrawableAmount()
				).to.equal("8000000000000");
			});
		});

		describe("negative cases", function () {
			it("should revert if senior pool is locked", async function () {
				await opportunityPool.lockPool(1);
				await expect(
					opportunityPool.getSeniorPoolWithdrawableAmount()
				).to.be.revertedWith("Senior Subpool is locked");
			});
		});
	});
});
