const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("CongigHelper", function () {
	let dygnifyConfig,
		configHelper,
		seniorPool,
		lpToken,
		borrower,
		opportunityOrigination,
		collateralToken,
		opportunityPool,
		investor,
		dygnifyTreasury,
		multisign,
		dygnifyKeeper,
		identityToken,
		owner;
	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		owner = accounts[0];

		// Deploy and initilize dygnifyConfig
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize();

		const ConfigHelper = await ethers.getContractFactory("ConfigHelperLibrary");
		configHelper = await ConfigHelper.deploy();
		await configHelper.deployed();

		// Senior pool deployment
		const SeniorPool = await ethers.getContractFactory("SeniorPool");
		seniorPool = await SeniorPool.deploy();
		await seniorPool.deployed();

		// LP token deplyment
		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();

		// Deploy the borrower
		const Borrower = await ethers.getContractFactory("Borrower");
		borrower = await Borrower.deploy();
		await borrower.deployed();

		// Deploy Opportunity origination pool
		const OpportunityOrigination = await ethers.getContractFactory(
			"OpportunityOrigination"
		);
		opportunityOrigination = await OpportunityOrigination.deploy();
		await opportunityOrigination.deployed();

		// deploy collateral token
		const CollateralToken = await ethers.getContractFactory("CollateralToken");
		collateralToken = await CollateralToken.deploy();
		await collateralToken.deployed();

		// Opportunity pool deployment
		const OpportunityPool = await ethers.getContractFactory("OpportunityPool");
		opportunityPool = await OpportunityPool.deploy();
		await opportunityPool.deployed();

		// Investor pool deployment
		const Investor = await ethers.getContractFactory("Investor");
		investor = await Investor.deploy();
		await investor.deployed();

		// DygnifyTreasury
		const DygnifyTreasury = await ethers.getContractFactory("DygnifyTreasury");
		dygnifyTreasury = await DygnifyTreasury.deploy();
		await dygnifyTreasury.deployed();

		//MultiSign
		const MultiSign = await ethers.getContractFactory("MultiSign");
		multisign = await MultiSign.deploy();
		await multisign.deployed();

		// DygnifyKeeper
		const DygnifyKeeper = await ethers.getContractFactory("DygnifyKeeper");
		dygnifyKeeper = await DygnifyKeeper.deploy();
		await dygnifyKeeper.deployed();

		// IdentityToken
		const IdentityToken = await ethers.getContractFactory("IdentityToken");
		identityToken = await IdentityToken.deploy();
		await identityToken.deployed();
	});

	describe("dygnifyAdminAddress", function () {
		it("should return admin address", async function () {
			expect(
				await configHelper.dygnifyAdminAddress(dygnifyConfig.address)
			).to.equal(owner.address);
		});
	});

	describe("lpTokenAddress", function () {
		it("should return lpToken address", async function () {
			await dygnifyConfig.setAddress(1, lpToken.address);
			expect(await configHelper.lpTokenAddress(dygnifyConfig.address)).to.equal(
				lpToken.address
			);
		});
	});

	describe("usdcAddress", function () {
		it("should return usdc address", async function () {
			await dygnifyConfig.setAddress(
				2,
				"0x7c04fAcB6dFa76DccADd04A2d41841cbeD517cC0"
			);
			expect(await configHelper.usdcAddress(dygnifyConfig.address)).to.equal(
				"0x7c04fAcB6dFa76DccADd04A2d41841cbeD517cC0"
			);
		});
	});

	describe("seniorPoolAddress", function () {
		it("should return seniorPool address", async function () {
			await dygnifyConfig.setAddress(3, seniorPool.address);
			expect(
				await configHelper.seniorPoolAddress(dygnifyConfig.address)
			).to.equal(seniorPool.address);
		});
	});

	describe("poolImplAddress", function () {
		it("should return opportunityPool address", async function () {
			await dygnifyConfig.setAddress(4, opportunityPool.address);
			expect(
				await configHelper.poolImplAddress(dygnifyConfig.address)
			).to.equal(opportunityPool.address);
		});
	});

	describe("collateralTokenAddress", function () {
		it("should return collateralToken address", async function () {
			await dygnifyConfig.setAddress(5, collateralToken.address);
			expect(
				await configHelper.collateralTokenAddress(dygnifyConfig.address)
			).to.equal(collateralToken.address);
		});
	});

	describe("getOpportunityOrigination", function () {
		it("should return opportunityOrigination address", async function () {
			await dygnifyConfig.setAddress(6, opportunityOrigination.address);
			expect(
				await configHelper.getOpportunityOrigination(dygnifyConfig.address)
			).to.equal(opportunityOrigination.address);
		});
	});

	describe("investorContractAddress", function () {
		it("should return investorContract address", async function () {
			await dygnifyConfig.setAddress(7, investor.address);
			expect(
				await configHelper.investorContractAddress(dygnifyConfig.address)
			).to.equal(investor.address);
		});
	});

	describe("dygnifyTreasuryAddress", function () {
		it("should return dygnifyTreasury address", async function () {
			await dygnifyConfig.setAddress(8, dygnifyTreasury.address);
			expect(
				await configHelper.dygnifyTreasuryAddress(dygnifyConfig.address)
			).to.equal(dygnifyTreasury.address);
		});
	});

	describe("dygnifyKeeperAddress", function () {
		it("should return dygnifyKeeper address", async function () {
			await dygnifyConfig.setAddress(9, dygnifyKeeper.address);
			expect(
				await configHelper.dygnifyKeeperAddress(dygnifyConfig.address)
			).to.equal(dygnifyKeeper.address);
		});
	});

	describe("identityTokenAddress", function () {
		it("should return identityToken address", async function () {
			await dygnifyConfig.setAddress(10, identityToken.address);
			expect(
				await configHelper.identityTokenAddress(dygnifyConfig.address)
			).to.equal(identityToken.address);
		});
	});

	describe("getLeverageRatio", function () {
		it("should return leverageRatio", async function () {
			await dygnifyConfig.setNumber(0, 4);
			expect(
				await configHelper.getLeverageRatio(dygnifyConfig.address)
			).to.equal(4);
		});
	});

	describe("getDygnifyFee", function () {
		it("should return dygnifyFee", async function () {
			await dygnifyConfig.setNumber(1, 100000);
			expect(await configHelper.getDygnifyFee(dygnifyConfig.address)).to.equal(
				100000
			);
		});
	});

	describe("getOverDueFee", function () {
		it("should return overDueFee", async function () {
			await dygnifyConfig.setNumber(2, 5000000);
			expect(await configHelper.getOverDueFee(dygnifyConfig.address)).to.equal(
				5000000
			);
		});
	});

	describe("getJuniorSubpoolFee", function () {
		it("should return juniorSubpoolFee", async function () {
			await dygnifyConfig.setNumber(3, 200000);
			expect(
				await configHelper.getJuniorSubpoolFee(dygnifyConfig.address)
			).to.equal(200000);
		});
	});

	describe("getSeniorPoolLockinMonths", function () {
		it("should return seniorPool lock period in months", async function () {
			await dygnifyConfig.setNumber(4, 1);
			expect(
				await configHelper.getSeniorPoolLockinMonths(dygnifyConfig.address)
			).to.equal(1);
		});
	});

	describe("getWriteOffDays", function () {
		it("should return writeOffDays", async function () {
			await dygnifyConfig.setNumber(5, 90);
			expect(
				await configHelper.getWriteOffDays(dygnifyConfig.address)
			).to.equal(90);
		});
	});

	describe("getUnderwriterFee", function () {
		it("should return underwriterFee", async function () {
			await dygnifyConfig.setNumber(6, 100000);
			expect(
				await configHelper.getUnderwriterFee(dygnifyConfig.address)
			).to.equal(100000);
		});
	});
});
