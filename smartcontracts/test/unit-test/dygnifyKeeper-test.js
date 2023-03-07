const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");

const ID = ethers.utils.id("aadhar");

describe("DygnifyKeeper", function () {
	let dygnifyConfig, opportunityOrigination, dygnifyKeeper, opportunityPool;

	beforeEach(async () => {
		// deploy DygnifyConfig.sol
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize(); // initialize dygnifyConfig

		// deploy OpportunityOrigination.sol
		const poolContractFactory = await ethers.getContractFactory(
			"MockOpportunityPoolV1"
		);
		opportunityPool = await poolContractFactory.deploy();
		await opportunityPool.deployed();

		await dygnifyConfig.setAddress(4, opportunityPool.address);

		// deploy OpportunityOrigination.sol
		const OpportunityOrigination = await ethers.getContractFactory(
			"MockOpportunityOriginationV1"
		);
		opportunityOrigination = await OpportunityOrigination.deploy(
			opportunityPool.address
		);
		await opportunityOrigination.deployed();

		// deploy DygnifyKeeper.sol
		const DygnifyKeeper = await hre.ethers.getContractFactory("DygnifyKeeper");
		dygnifyKeeper = await DygnifyKeeper.deploy();
		await dygnifyKeeper.deployed();

		// set all the addresses
		await dygnifyConfig.setAddress(9, dygnifyKeeper.address);
		await dygnifyConfig.setAddress(6, opportunityOrigination.address);

		await dygnifyKeeper.initialize(dygnifyConfig.address);
	});

	describe("addOpportunityInKeeper", function () {
		describe("Positive cases", function () {
			it("add drawdowned opportunity in keeper", async function () {
				await expect(
					opportunityOrigination.markDrawDown(ID, dygnifyKeeper.address)
				)
					.to.emit(dygnifyKeeper, "OpportunityAddedInKeeper")
					.withArgs(ID);
			});
		});

		describe("Negative cases", function () {
			it("reverts when opportunity is not drawdown", async function () {
				await opportunityOrigination.setIsDrawdown(false);
				await expect(
					dygnifyKeeper.addOpportunityInKeeper(ID)
				).to.be.revertedWith("opportunity is not drawdown");
			});

			it("reverts when caller is not opportunityOrigination", async function () {
				await expect(
					dygnifyKeeper.addOpportunityInKeeper(ID)
				).to.be.revertedWith(
					"opportunityOrigination contract can add the opportunity in keeper"
				);
			});
		});

		describe("Border cases", function () {
			it("going to overflow for id", async function () {
				await expect(dygnifyKeeper.addOpportunityInKeeper(ID + "1232")).to.be
					.reverted;
			});
		});
	});

	describe("removeOpportunityInKeeper", function () {
		describe("Positive cases", function () {
			let ids;
			beforeEach(async () => {
				ids = [
					ethers.utils.id("aadhar1"),
					ethers.utils.id("aadhar2"),
					ethers.utils.id("aadhar3"),
					ethers.utils.id("aadhar4"),
				];

				for (let i = 0; i < ids.length; i++) {
					await opportunityOrigination.markDrawDown(
						ids[i],
						dygnifyKeeper.address
					);
				}
			});

			it("remove ids[0] opportunity form keeper and expect event to emit", async function () {
				await expect(
					opportunityOrigination.markRepaid(ids[0], dygnifyKeeper.address)
				)
					.to.emit(dygnifyKeeper, "OpportunityRemovedFromKeeper")
					.withArgs(ids[0]);
			});

			it("remove ids[1] opportunity form keeper and expect event to emit", async function () {
				await expect(
					opportunityOrigination.markRepaid(ids[1], dygnifyKeeper.address)
				)
					.to.emit(dygnifyKeeper, "OpportunityRemovedFromKeeper")
					.withArgs(ids[1]);
			});

			it("remove ids[2] opportunity form keeper and expect event to emit", async function () {
				await expect(
					opportunityOrigination.markRepaid(ids[2], dygnifyKeeper.address)
				)
					.to.emit(dygnifyKeeper, "OpportunityRemovedFromKeeper")
					.withArgs(ids[2]);
			});

			it("remove ids[3] opportunity form keeper and expect event to emit", async function () {
				await expect(
					opportunityOrigination.markRepaid(ids[3], dygnifyKeeper.address)
				)
					.to.emit(dygnifyKeeper, "OpportunityRemovedFromKeeper")
					.withArgs(ids[3]);
			});
		});

		describe("Negative cases", function () {
			it("reverts when caller is not opportunityOrigination", async function () {
				await expect(
					dygnifyKeeper.removeOpportunityInKeeper(ID)
				).to.be.revertedWith(
					"opportunityOrigination contract can add the opportunity in keeper"
				);
			});
		});

		describe("Border cases", function () {
			it("going to overflow for id", async function () {
				await expect(dygnifyKeeper.removeOpportunityInKeeper(ID + "123")).to.be
					.reverted;
			});
		});
	});

	describe("checkUpkeep", function () {
		beforeEach(async function () {
			await opportunityPool.setNextRepaymentTime(8640000);
		});
		describe("Positive cases", function () {
			it("returns upkeppNeeded as true when opportunity threshold is less than timePasses", async function () {
				await opportunityOrigination.markDrawDown(ID, dygnifyKeeper.address);
				await opportunityOrigination.setWriteOffDays(100);
				await network.provider.send("evm_increaseTime", [86400]);
				await network.provider.send("evm_mine", []);
				const upKeepNeeded = await dygnifyKeeper.callStatic.checkUpkeep("0x");

				assert(upKeepNeeded[0]);
			});
		});

		describe("Negative cases", function () {
			it("returns upkeppNeeded as false when opportunity threshold is greater than timePasses", async function () {
				await opportunityOrigination.markDrawDown(ID, dygnifyKeeper.address);

				await network.provider.send("evm_increaseTime", [86400]);
				await network.provider.send("evm_mine", []);
				await opportunityOrigination.setWriteOffDays(767678678);
				const upKeepNeeded = await dygnifyKeeper.callStatic.checkUpkeep("0x");
			});
		});
	});

	describe("performUpkeep", function () {
		describe("Positive cases", function () {
			it("returns upkeppNeeded as true when opportunity threshold is less than timePasses", async function () {
				await opportunityPool.setNextRepaymentTime(
					Math.floor(Date.now() / 1000) + 86400
				);

				await opportunityOrigination.markDrawDown(ID, dygnifyKeeper.address);
				await network.provider.send("evm_increaseTime", [86401]);
				await network.provider.send("evm_mine", []);

				await expect(dygnifyKeeper.performUpkeep("0x"))
					.to.emit(dygnifyKeeper, "OpportunityRemovedFromKeeper")
					.withArgs(ID);
			});
		});

		describe("Negative cases", function () {
			it("returns upkeppNeeded as false when opportunity threshold is greater than timePasses", async function () {
				await opportunityPool.setNextRepaymentTime(
					Math.floor(Date.now() / 1000) + 8640000
				);
				await opportunityOrigination.markDrawDown(ID, dygnifyKeeper.address);

				await expect(dygnifyKeeper.performUpkeep("0x")).not.to.emit(
					dygnifyKeeper,
					"OpportunityRemovedFromKeeper"
				);
			});
		});
	});
});
