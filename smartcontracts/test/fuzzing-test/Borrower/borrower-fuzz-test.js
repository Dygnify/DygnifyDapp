const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("BorrowerFuzzTest", function () {
	let borrower, dygnifyConfig, user;
	beforeEach(async () => {
		// deploy Borrower.sol
		const Borrower = await ethers.getContractFactory("Borrower");
		borrower = await Borrower.deploy();
		await borrower.deployed();

		// Deploy dygnifyConfig
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();

		const accounts = await ethers.getSigners();
		user = accounts[0];

		// Initialize
		await dygnifyConfig.initialize();
		await borrower.initialize(dygnifyConfig.address);
	});

	describe("updateBorrowerProfile", function () {
		const updateBorrowerProfile = (cid) =>
			async function () {
				await borrower.updateBorrowerProfile(cid);
				const borrowerProfile = await borrower.borrowerProfile(user.address);
				console.log("borrower:", borrower.address);
				console.log("User:", user.address);
				assert.equal(borrowerProfile.toString(), cid);
			};
		it(
			"user updates borrowerProfile successfully",
			updateBorrowerProfile("123")
		);
	});
});
