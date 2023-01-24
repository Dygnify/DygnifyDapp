const { expect } = require("chai");
const { ethers } = require("hardhat");

const overflow =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

describe("DygnifyConfig", function () {
	let dygnifyConfig, configHelper, owner, other;
	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		owner = accounts[0];
		other = accounts[1];

		// Deploy and initilize dygnifyConfig
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize();

		const ConfigHelper = await ethers.getContractFactory("ConfigHelperLibrary");
		configHelper = await ConfigHelper.deploy();
		await configHelper.deployed();
	});

	describe("setAddress", function () {
		describe("positive cases", function () {
			it("should set address", async function () {
				await expect(dygnifyConfig.setAddress(1, owner.address)).not.to.be
					.reverted;
			});
		});

		describe("negative cases", function () {
			it("should revert for 0 address", async function () {
				await expect(
					dygnifyConfig.setAddress(
						1,
						"0x0000000000000000000000000000000000000000"
					)
				).to.be.revertedWith("Invalid Address");
			});

			it("should revert if not called by owner", async function () {
				await expect(
					dygnifyConfig.connect(other).setAddress(1, other.address)
				).to.be.revertedWith("Must have admin role to perform this action");
			});
		});

		describe("border cases", function () {
			it("its going to overflow for addressIndex", async function () {
				await expect(dygnifyConfig.setAddress(overflow, owner.address)).to.be
					.reverted;
			});

			it("its going to underflow for addressIndex", async function () {
				await expect(dygnifyConfig.setAddress(-1, owner.address)).to.be
					.reverted;
			});

			it("its going to overflow for newAddress", async function () {
				await expect(dygnifyConfig.setAddress(1, overflow)).to.be.reverted;
			});
		});
	});

	describe("getAddress", function () {
		describe("positive cases", function () {
			it("should get address", async function () {
				expect(await dygnifyConfig.getAddress(0)).to.equal(owner.address);
			});

			it("should match address", async function () {
				await dygnifyConfig.setAddress(1, owner.address);
				expect(await dygnifyConfig.getAddress(1)).to.equal(owner.address);
			});
		});

		describe("negative cases", function () {
			it("should return 0 address for not set addresses", async function () {
				expect(await dygnifyConfig.getAddress(1)).to.equal(
					"0x0000000000000000000000000000000000000000"
				);
			});
		});

		describe("border cases", function () {
			it("its going to overflow for addressIndex", async function () {
				await expect(dygnifyConfig.getAddress(overflow)).to.be.reverted;
			});
			it("its going to underflow for addressIndex", async function () {
				await expect(dygnifyConfig.getAddress(-1)).to.be.reverted;
			});
		});
	});

	describe("setNumber", function () {
		describe("positive cases", function () {
			it("should set number", async function () {
				await expect(dygnifyConfig.setNumber(1, 1)).not.to.be.reverted;
			});
		});

		describe("negative cases", function () {
			it("should revert if not called by owner", async function () {
				await expect(
					dygnifyConfig.connect(other).setNumber(1, 1)
				).to.be.revertedWith("Must have admin role to perform this action");
			});
		});

		describe("border cases", function () {
			it("its going to overflow for id", async function () {
				await expect(dygnifyConfig.setNumber(overflow, 1)).to.be.reverted;
			});

			it("its going to overflow for newNumber", async function () {
				await expect(dygnifyConfig.setNumber(1, overflow)).to.be.reverted;
			});

			it("its going to underflow for id", async function () {
				await expect(dygnifyConfig.setNumber(-1, 1)).to.be.reverted;
			});

			it("its going to underflow for newNumber", async function () {
				await expect(dygnifyConfig.setNumber(1, -1)).to.be.reverted;
			});
		});
	});

	describe("getNumber", function () {
		describe("positive cases", function () {
			it("should get number", async function () {
				expect(await dygnifyConfig.getNumber(1)).to.equal(0);
			});

			it("should match number", async function () {
				await dygnifyConfig.setNumber(1, 1);
				expect(await dygnifyConfig.getNumber(1)).to.equal(1);
			});
		});

		describe("negative cases", function () {
			it("should return 0 for not set number", async function () {
				expect(await dygnifyConfig.getNumber(2)).to.equal(0);
			});
		});

		describe("border cases", function () {
			it("its going to overflow for id", async function () {
				await expect(dygnifyConfig.getNumber(overflow)).to.be.reverted;
			});

			it("its going to underflow for id", async function () {
				await expect(dygnifyConfig.setAddress(-1)).to.be.reverted;
			});
		});
	});

	describe("setFlag", function () {
		describe("positive cases", function () {
			it("should set flag", async function () {
				await expect(
					dygnifyConfig.setFlag(ethers.utils.formatBytes32String("1"), true)
				).not.to.be.reverted;
			});
		});

		describe("negative cases", function () {
			it("should revert if not called by owner", async function () {
				await expect(
					dygnifyConfig
						.connect(other)
						.setFlag(ethers.utils.formatBytes32String("1"), true)
				).to.be.reverted;
			});
		});

		describe("border cases", function () {
			it("its going to overflow for id", async function () {
				await expect(dygnifyConfig.setFlag(overflow, true)).to.be.reverted;
			});

			it("its going to underflow for id", async function () {
				await expect(dygnifyConfig.setFlag(-1, 1)).to.be.reverted;
			});
		});
	});

	describe("getFlag", function () {
		describe("positive cases", function () {
			it("should get flag", async function () {
				await dygnifyConfig.setFlag(
					ethers.utils.formatBytes32String("1"),
					true
				);
				expect(
					await dygnifyConfig.getFlag(ethers.utils.formatBytes32String("1"))
				).to.equal(true);
			});
		});

		describe("negative cases", function () {
			it("should return false for not set id", async function () {
				expect(
					await dygnifyConfig.getFlag(ethers.utils.formatBytes32String("1"))
				).to.equal(false);
			});
		});

		describe("border cases", function () {
			it("its going to overflow for id", async function () {
				await expect(dygnifyConfig.getFlag(overflow)).to.be.reverted;
			});

			it("its going to underflow for id", async function () {
				await expect(dygnifyConfig.getFlag(-1)).to.be.reverted;
			});
		});
	});
});
