const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("CollateralTokenFuzz", function () {
	let collateralToken, minter, tokenOwner, otherAccount;
	let count = 0;
	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		minter = accounts[0];
		tokenOwner = accounts[1];
		otherAccount = accounts[2];
		const CollateralToken = await ethers.getContractFactory("CollateralToken");
		collateralToken = await CollateralToken.deploy();
		await collateralToken.deployed();
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		const dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		const tx = await dygnifyConfig.initialize();
		await tx.wait();
		const tx2 = await collateralToken.initialize(
			dygnifyConfig.address,
			minter.address
		);
		await tx2.wait();

		if (count < 1) {
			for (let i = 0; i < 10; i++) {
				console.log(`Account ${i}`, accounts[i].address);
			}
			count += 1;
		}
		console.log("Collateral token contract : ", collateralToken.address);
	});

	describe("initialize", () => {
		it("initilizes the token Correctly.", async () => {
			const name = await collateralToken.name();
			const symbol = await collateralToken.symbol();
			assert.equal(name, "CollateralToken");
			assert.equal(symbol, "CT");
		});
	});

	describe("safeMint", function () {
		it("should able mint token", async function () {
			console.log("tokenOwner:", tokenOwner.address);
			await collateralToken.safeMint(tokenOwner.address, "abcd");
			assert.equal(await collateralToken.ownerOf(0), tokenOwner.address);
			const tokenUri = await collateralToken.tokenURI(0);
			assert.equal(tokenUri, "ipfs://abcd");

			const balance = await collateralToken.balanceOf(tokenOwner.address);
			assert.ok(balance > 0, "Token was not minted");
		});
	});

	describe("burn", function () {
		it("only token owner should be able to burn token", async function () {
			await collateralToken.safeMint(tokenOwner.address, "abcd");
			collateralToken = collateralToken.connect(tokenOwner);
			assert.equal(await collateralToken.ownerOf(0), tokenOwner.address);
			await collateralToken.burn(0);
		});
	});
});
