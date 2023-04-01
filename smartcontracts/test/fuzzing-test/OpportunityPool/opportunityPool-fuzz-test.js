const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("OpportunityPoolFuzz", function () {
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
		dygnifyTreasury;
	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		owner = accounts[0];
		borrower = accounts[1];
		dygnifyTreasury = accounts[2];
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

		console.log("opportunityPool", opportunityPool.address);

		// Deploy Mock OpportunityOrigination
		const OpportunityOrigination = await ethers.getContractFactory(
			"MockOpportunityOrigination"
		);
		opportunityOrigination = await OpportunityOrigination.deploy(
			borrower.address
		);
		await opportunityOrigination.deployed();

		//Deploy and initialize Investor
		const Investor = await ethers.getContractFactory("MockInvestor");
		investor = await Investor.deploy();
		await investor.deployed();

		// Deploy UsdcToken
		const UsdcToken = await ethers.getContractFactory("TestUSDCToken");
		usdcToken = await UsdcToken.deploy("100000000000000000");
		await usdcToken.deployed();

		console.log("Usdc", usdcToken.address);
		console.log("borrowerAddress", borrower.address);

		// Deploy lpToken
		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();

		// Deploy seniorPool
		const SeniorPool = await ethers.getContractFactory("MockSeniorPool");
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

			it("should deposit amount", async function () {
				await seniorPool.deposit(1, "8000000000000");
				assert.equal(await opportunityPool.poolBalance(), "8000000000000");
				assert.equal(
					await usdcToken.balanceOf(opportunityPool.address),
					"8000000000000"
				);
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

			it("should deposit amount", async function () {
				await opportunityPool.deposit(0, "2000000000000");
				assert.equal(await opportunityPool.poolBalance(), "2000000000000");
				assert.equal(
					await usdcToken.balanceOf(opportunityPool.address),
					"2000000000000"
				);
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
		it("should drawdown", async function () {
			await seniorPool.deposit(1, "8000000000000");
			await opportunityPool.connect(borrower).drawdown();
			assert.equal(await opportunityPool.poolBalance(), "0");
			assert.equal(await usdcToken.balanceOf(opportunityPool.address), "0");
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
			it("should repayment", async function () {
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
				const previousCounter = await opportunityPool.repaymentCounter();
				const yield = await accounting.getInterestDistribution(
					100000,
					200000,
					interest,
					4,
					10000000000000,
					(
						await opportunityPool.seniorSubpoolDetails()
					).totalDepositable
				);
				const beforeSeniorYield = (await opportunityPool.seniorSubpoolDetails())
					.yieldGenerated;
				const beforeJuniorYield = (await opportunityPool.juniorSubpoolDetails())
					.yieldGenerated;
				const beforeBorrowerUsdc = await usdcToken.balanceOf(borrower.address);
				const previousRepaymentTime = await opportunityPool.nextRepaymentTime();

				await opportunityPool.connect(borrower).repayment();

				const afterRepaymentTime = await opportunityPool.nextRepaymentTime();
				const afterBorrowerUsdc = await usdcToken.balanceOf(borrower.address);
				const afterJuniorYield = (await opportunityPool.juniorSubpoolDetails())
					.yieldGenerated;
				const afterSeniorYield = (await opportunityPool.seniorSubpoolDetails())
					.yieldGenerated;
				const afterCounter = await opportunityPool.repaymentCounter();
				const afterPrincipal =
					await opportunityPool.totalOutstandingPrincipal();
				console.log(
					`previous: ${previousPrincipal} - after: ${afterPrincipal} = remaining ${remainingPrincipal}`
				);
				assert.equal(previousPrincipal - afterPrincipal, remainingPrincipal);
				console.log(
					`afterCounter: ${afterCounter} - previousCounter: ${previousCounter}`
				);
				assert.equal(afterCounter - previousCounter, 1);
				console.log(
					`afterSeniorYield: ${afterSeniorYield} - beforeSeniorYield: ${beforeSeniorYield} =  yield[0] ${yield[0]}`
				);
				assert.equal(afterSeniorYield - beforeSeniorYield, yield[0]);
				console.log(
					`afterJuniorYield: ${afterJuniorYield} - beforeJuniorYield: ${beforeJuniorYield} =  yield[1] ${yield[1]}`
				);
				assert.equal(afterJuniorYield - beforeJuniorYield, yield[1]);
				console.log(
					`beforeBorrowerUsdc: ${beforeBorrowerUsdc} - afterBorrowerUsdc: ${afterBorrowerUsdc}`
				);
				assert.equal(
					beforeBorrowerUsdc.sub(afterBorrowerUsdc).toString(),
					await opportunityPool.getRepaymentAmount()
				);
				console.log(
					`afterRepaymentTime: ${afterRepaymentTime} - previousRepaymentTime: ${previousRepaymentTime}`
				);
				assert.isAbove(afterRepaymentTime.sub(previousRepaymentTime), 0);
				console.log("dygnifyTreasury", dygnifyTreasury.address);
				assert.equal(
					await usdcToken.balanceOf(dygnifyTreasury.address),
					8333333333
				);
			});
			it("should done all repayment for term loan", async function () {
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
				let juniorYield = (await opportunityPool.juniorSubpoolDetails())
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
					juniorYield = juniorYield.add(res[1]);
					await opportunityPool.connect(borrower).repayment();
				}
				assert.equal(
					(await opportunityPool.seniorSubpoolDetails()).depositedAmount,
					0
				);
				assert.isBelow(await opportunityPool.totalOutstandingPrincipal(), 500);
				assert.equal(
					(await opportunityPool.seniorSubpoolDetails()).yieldGenerated,
					0
				);
				console.log("juniorYield", juniorYield);
				assert.equal(
					(
						await opportunityPool.juniorSubpoolDetails()
					).yieldGenerated.toString(),
					juniorYield
				);
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

			it("should repayment", async function () {
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
				const previousCounter = await opportunityPool.repaymentCounter();
				const yield = await accounting.getInterestDistribution(
					100000,
					200000,
					await opportunityPool.emiAmount(),
					4,
					10000000000000,
					(
						await opportunityPool.seniorSubpoolDetails()
					).totalDepositable
				);
				const beforeSeniorYield = (await opportunityPool.seniorSubpoolDetails())
					.yieldGenerated;
				const beforeJuniorYield = (await opportunityPool.juniorSubpoolDetails())
					.yieldGenerated;
				const beforeBorrowerUsdc = await usdcToken.balanceOf(borrower.address);
				const previousRepaymentTime = await opportunityPool.nextRepaymentTime();

				await opportunityPool.connect(borrower).repayment();

				const afterRepaymentTime = await opportunityPool.nextRepaymentTime();
				const afterBorrowerUsdc = await usdcToken.balanceOf(borrower.address);
				const afterJuniorYield = (await opportunityPool.juniorSubpoolDetails())
					.yieldGenerated;
				const afterSeniorYield = (await opportunityPool.seniorSubpoolDetails())
					.yieldGenerated;
				const afterCounter = await opportunityPool.repaymentCounter();

				console.log(
					`afterCounter: ${afterCounter} - previousCounter: ${previousCounter}`
				);
				console.log(
					`afterSeniorYield: ${afterSeniorYield} - beforeSeniorYield: ${beforeSeniorYield} =  yield[0] ${yield[0]}`
				);
				console.log(
					`afterJuniorYield: ${afterJuniorYield} - beforeJuniorYield: ${beforeJuniorYield} =  yield[1] ${yield[1]}`
				);
				console.log(
					`beforeBorrowerUsdc: ${beforeBorrowerUsdc} - afterBorrowerUsdc: ${afterBorrowerUsdc}`
				);
				console.log(
					`afterRepaymentTime: ${afterRepaymentTime} - previousRepaymentTime: ${previousRepaymentTime}`
				);

				assert.equal(afterCounter - previousCounter, 1);
				assert.equal(afterSeniorYield - beforeSeniorYield, yield[0]);
				assert.equal(afterJuniorYield - beforeJuniorYield, yield[1]);
				assert.equal(
					beforeBorrowerUsdc.sub(afterBorrowerUsdc).toString(),
					await opportunityPool.getRepaymentAmount()
				);
				assert.isAbove(afterRepaymentTime.sub(previousRepaymentTime), 0);
				console.log("dygnifyTreasury", dygnifyTreasury.address);
				assert.equal(
					await usdcToken.balanceOf(dygnifyTreasury.address),
					8333333333
				);
			});
			it("should done all repayment for bullet loan", async function () {
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
				let juniorYield = (await opportunityPool.juniorSubpoolDetails())
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
					juniorYield = juniorYield.add(res[1]);
					await opportunityPool.connect(borrower).repayment();
				}
				assert.equal(
					(await opportunityPool.seniorSubpoolDetails()).depositedAmount,
					0
				);
				assert.equal(
					(await opportunityPool.seniorSubpoolDetails()).yieldGenerated,
					0
				);
				console.log(juniorYield);
				assert.equal(
					(
						await opportunityPool.juniorSubpoolDetails()
					).yieldGenerated.toString(),
					juniorYield
				);
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

		it("should withdraw", async function () {
			await seniorPool.withdrawAll(1);
			console.log("seniorPool", seniorPool.address);
			assert.equal(
				await usdcToken.balanceOf(seniorPool.address),
				"8000000000000"
			);
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

		it("should get user withdrawable amount", async function () {
			await opportunityPool.deposit(0, "2000000000000");
			assert.equal(
				await opportunityPool.getUserWithdrawableAmount(),
				2186968000000
			);
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

		it("should get user repayment amount", async function () {
			await opportunityOrigination.markDrawDown(
				ethers.utils.formatBytes32String("id1")
			);
			assert.equal(await opportunityPool.getRepaymentAmount(), "3234056244465");
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
			assert.equal(seniorOverDuePerecentage.toString(), "3695328");
			assert.equal(juniorOverDuePerecentage.toString(), "2243616");
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
			assert.equal(await opportunityPool.nextRepaymentTime(), 2592000);
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
			assert.equal(
				await opportunityPool.getSeniorTotalDepositable(),
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
			assert.equal(await opportunityPool.getSeniorProfit(), "46666666666");
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

		it("should lock pool", async function () {
			await opportunityPool.lockPool(0);
			assert.equal(
				(await opportunityPool.juniorSubpoolDetails()).isPoolLocked,
				true
			);
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

		it("should unlock pool", async function () {
			await opportunityPool.unLockPool(0);
			assert.equal(
				(await opportunityPool.juniorSubpoolDetails()).isPoolLocked,
				false
			);
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
			assert.equal(await seniorPool.getOpportunityName(), "Opportunity1");
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

		it("should get seniorPool withdrawable amount", async function () {
			assert.equal(
				await opportunityPool.getSeniorPoolWithdrawableAmount(),
				"8000000000000"
			);
		});
	});
});
