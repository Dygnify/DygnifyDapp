const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("InvestorFuzz", function () {
	let opportunityPool, opportunityOrigination, investor, owner;
	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		owner = accounts[0];

		// Deploy and initilize dygnifyConfig
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		const dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize();

		// Deploy Mock OpportunityPool
		// We have to call Investor from OpportunityPool
		// That's why we have created MockOpportunityPool
		const OpportunityPool = await ethers.getContractFactory(
			"MockOpportunityPool"
		);
		opportunityPool = await OpportunityPool.deploy();
		await opportunityPool.deployed();
		console.log("opportunityPool", opportunityPool.address);

		// Deploy Mock OpportunityOrigination
		const OpportunityOrigination = await ethers.getContractFactory(
			"MockOpportunityOrigination"
		);
		opportunityOrigination = await OpportunityOrigination.deploy(
			opportunityPool.address
		);
		await opportunityOrigination.deployed();
		await opportunityOrigination.setPoolAddress(opportunityPool.address);

		await dygnifyConfig.setAddress(6, opportunityOrigination.address);
		console.log("opportunityOrigination", opportunityOrigination.address);
		// Deploy Investor
		const Investor = await ethers.getContractFactory("Investor");
		investor = await Investor.deploy();
		await investor.deployed();
		console.log("Investor", investor.address);
		console.log("owner", owner.address);

		// Initialize Investor
		await investor.initialize(dygnifyConfig.address);
	});

	describe("addOpportunity", function () {
		it("should add single opportunity", async function () {
			await opportunityPool.addOpportunity(
				investor.address,
				owner.address,
				ethers.utils.id("id1")
			);
			console.log(await investor.getOpportunityOfInvestor(owner.address));
			assert.equal(
				(await investor.getOpportunityOfInvestor(owner.address))[0],
				ethers.utils.id("id1")
			);
		});
	});

	describe("removeOpportunity", function () {
		it("should remove single opportunity", async function () {
			await opportunityPool.addOpportunity(
				investor.address,
				owner.address,
				ethers.utils.id("id1")
			);

			await opportunityPool.removeOpportunity(
				investor.address,
				owner.address,
				ethers.utils.id("id1")
			);

			assert.equal(
				(await investor.getOpportunityOfInvestor(owner.address))[0],
				0
			);
		});
	});

	describe("getOpportunityOfInvestor", function () {
		it("should match for single opportunity", async function () {
			await opportunityPool.addOpportunity(
				investor.address,
				owner.address,
				ethers.utils.id("id1")
			);
			assert.equal(
				(await investor.getOpportunityOfInvestor(owner.address))[0],
				ethers.utils.id("id1")
			);
		});
	});

	describe("isExistInInvestor", function () {
		it("should return true if id found", async function () {
			await opportunityPool.addOpportunity(
				investor.address,
				owner.address,
				ethers.utils.id("id1")
			);
			assert.equal(
				await investor.isExistInInvestor(owner.address, ethers.utils.id("id1")),
				true
			);
		});
	});
});
