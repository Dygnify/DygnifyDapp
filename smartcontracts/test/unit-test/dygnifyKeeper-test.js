const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");

const OVERFLOW =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";
const ID = ethers.utils.id("aadhar");

describe("DygnifyKeeper", function () {
	let dygnifyConfig, opportunityOrigination, dygnifyKeeper, opportunityPool;

	beforeEach(async () => {
		const owner = await ethers.getSigner();
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

		await dygnifyConfig.setAddress(6, opportunityOrigination.address);
		await dygnifyConfig.setAddress(9, dygnifyKeeper.address);
		await dygnifyKeeper.initialize(dygnifyConfig.address);
	});

	describe("addOpportunityInKeeper", function () {
		describe("Positive cases", function () {
			it("should add drawdown opportunities to drawdownOpportunites array successfully", async function () {
				const id = ethers.utils.id("aadhar");
				expect(
					await opportunityOrigination.toCheckAddOpportunityInKeeper(
						id,
						dygnifyKeeper.address,
						true
					)
				);
			});

			it("should add drawdown opportunities to drawdownOpportunites array successfully", async function () {
				const id = ethers.utils.id("pan card");
				expect(
					await opportunityOrigination.toCheckAddOpportunityInKeeper(
						id,
						dygnifyKeeper.address,
						true
					)
				);
			});

			it("should add drawdown opportunities to drawdownOpportunites array successfully", async function () {
				const id = ethers.utils.id("shrda niwas");
				expect(
					await opportunityOrigination.toCheckAddOpportunityInKeeper(
						id,
						dygnifyKeeper.address,
						true
					)
				);
			});

			it("should add drawdown opportunities to drawdownOpportunites array successfully", async function () {
				const id = ethers.utils.id(" a b c ");
				expect(
					await opportunityOrigination.toCheckAddOpportunityInKeeper(
						id,
						dygnifyKeeper.address,
						true
					)
				);
			});
		});

		describe("Negative cases", function () {
			it("reverts when opportunity is not drawdown", async function () {
				opportunityOrigination.isActive(ID);

				await expect(
					opportunityOrigination.toCheckAddOpportunityInKeeper(
						ID,
						dygnifyKeeper.address,
						false
					)
				).to.be.revertedWith("opportunity is not drawdown");
			});

			it("reverts when caller is not opportunityOrigination", async function () {
				await expect(
					opportunityOrigination.toCheckAddOpportunityInKeeper(
						ID,
						dygnifyKeeper.address,
						true
					)
				).to.be.revertedWith(
					"opportunityOrigination contract can add the opportunity in keeper"
				);
			});
		});

		describe("Border cases", function () {
			it("going to overflow for id", async function () {
				const id =
					"0x664effaae7bbb2eb34ccb3c136943afaa8fe7bcfb55aef38e6ed7788d7ff2e4478";

				await expect(
					opportunityOrigination.toCheckAddOpportunityInKeeper(
						id,
						dygnifyKeeper.address,
						true
					)
				).to.be.reverted;
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

				for (let i = 0; i < ids.legth; i++) {
					opportunityOrigination.toCheckAddOpportunityInKeeper(
						ids[i],
						dygnifyKeeper.address,
						true
					);
				}
			});

			it("should remove drawdown opportunity from drawdownOpportunites array successfully", async function () {
				expect(
					await opportunityOrigination.toCheckRemoveOpportunityInKeeper(
						ids[0],
						dygnifyKeeper.address
					)
				);
			});

			it("should remove drawdown opportunity from drawdownOpportunites array successfully", async function () {
				expect(
					await opportunityOrigination.toCheckRemoveOpportunityInKeeper(
						ids[1],
						dygnifyKeeper.address
					)
				);
			});

			it("should remove drawdown opportunity from drawdownOpportunites array successfully", async function () {
				expect(
					await opportunityOrigination.toCheckRemoveOpportunityInKeeper(
						ids[2],
						dygnifyKeeper.address
					)
				);
			});

			it("should remove drawdown opportunity from drawdownOpportunites array successfully", async function () {
				expect(
					await opportunityOrigination.toCheckRemoveOpportunityInKeeper(
						ids[3],
						dygnifyKeeper.address
					)
				);
			});
		});

		describe("Negative cases", function () {
			it("reverts when caller is not opportunityOrigination", async function () {
				await expect(
					opportunityOrigination.toCheckRemoveOpportunityInKeeper(
						ID,
						dygnifyKeeper.address
					)
				).to.be.revertedWith(
					"opportunityOrigination contract can add the opportunity in keeper"
				);
			});
		});

		describe("Border cases", function () {
			it("going to overflow for id", async function () {
				const id =
					"0x664effaae7bbb2eb34ccb3c136943afaa8fe7bcfb55aef38e6ed7788d7ff2e4478";

				await expect(
					opportunityOrigination.toCheckRemoveOpportunityInKeeper(
						id,
						dygnifyKeeper.address
					)
				).to.be.reverted;
			});
		});
	});

	describe("checkUpkeep", function () {
		beforeEach(async function () {
			await opportunityPool.setNextRepaymentTime(8640000);
		});
		describe("Positive cases", function () {
			it("returns upkeppNeeded as true when opportunity threshold is less than timePasses", async function () {
				const id = ethers.utils.id("aadhar");

				opportunityOrigination.toCheckAddOpportunityInKeeper(
					id,
					dygnifyKeeper.address,
					true
				);
				await opportunityOrigination.setWriteOffDays(100);
				await network.provider.send("evm_increaseTime", [86400]);
				await network.provider.send("evm_mine", []);
				const upKeepNeeded =
					await opportunityOrigination.callStatic.toCheckCheckUpkeep(
						dygnifyKeeper.address,
						true
					);

				assert(upKeepNeeded);
			});
		});

		describe("Negative cases", function () {
			it("returns upkeppNeeded as false when opportunity threshold is greater than timePasses", async function () {
				const id = ethers.utils.id("aadhar");
				opportunityOrigination.toCheckAddOpportunityInKeeper(
					id,
					dygnifyKeeper.address,
					true
				);

				await network.provider.send("evm_increaseTime", [86400]);
				await network.provider.send("evm_mine", []);
				await opportunityOrigination.setWriteOffDays(767678678);
				const upKeepNeeded =
					await opportunityOrigination.callStatic.toCheckCheckUpkeep(
						dygnifyKeeper.address,
						false
					);

				assert(!upKeepNeeded);
			});
		});
	});

	describe("performUpkeep", function () {
		beforeEach(async function () {
			await opportunityPool.setNextRepaymentTime(8640000);
		});
		describe("Positive cases", function () {
			it("returns upkeppNeeded as true when opportunity threshold is less than timePasses", async function () {
				const id = ethers.utils.id("aadhar");
				opportunityOrigination.toCheckAddOpportunityInKeeper(
					id,
					dygnifyKeeper.address,
					true
				);

				await network.provider.send("evm_increaseTime", [86400]);
				await network.provider.send("evm_mine", []);
				const tx = await opportunityOrigination.toCheckperformUpkeep(
					dygnifyKeeper.address
				);

				assert(tx);
			});
		});

		describe("Negative cases", function () {
			it("returns upkeppNeeded as false when opportunity threshold is greater than timePasses", async function () {
				const id = ethers.utils.id("aadhar");
				opportunityOrigination.toCheckAddOpportunityInKeeper(
					id,
					dygnifyKeeper.address,
					true
				);

				const tx = await opportunityOrigination.toCheckperformUpkeep(
					dygnifyKeeper.address
				);

				assert(tx);
			});
		});
	});
});
