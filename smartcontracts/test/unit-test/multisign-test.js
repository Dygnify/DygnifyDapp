// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

const overflow =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

describe("Multisign", function () {
	let dygnifyConfig,
		multiSign,
		usdcToken,
		dygnifyTreasury,
		admin,
		owner1,
		owner2,
		user;
	beforeEach(async () => {
		accounts = await ethers.getSigners();
		admin = accounts[0];
		owner1 = accounts[1];
		owner2 = accounts[2];
		user = accounts[3];

		// Deploy and initialize DygnifyConfig
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize();

		// Deploy and initialize Multisign
		const MultiSign = await ethers.getContractFactory("MultiSign");
		multiSign = await MultiSign.deploy();
		await multiSign.deployed();

		// Deploy UsdcToken
		const UsdcToken = await ethers.getContractFactory("TestUSDCToken");
		usdcToken = await UsdcToken.deploy("100000000000000000");
		await usdcToken.deployed();

		// Deploy and Initialize DygnifyTreasury
		const DygnifyTreasury = await ethers.getContractFactory("DygnifyTreasury");
		dygnifyTreasury = await DygnifyTreasury.deploy();
		await dygnifyTreasury.deployed();

		// Set Address in dygnifyConfig
		await dygnifyConfig.setAddress(11, multiSign.address);
		await dygnifyConfig.setAddress(2, usdcToken.address);
		await dygnifyConfig.setAddress(8, dygnifyTreasury.address);

		// Initialize
		await dygnifyTreasury.initialize(dygnifyConfig.address);

		// Transfer Usdc
		await usdcToken.transfer(dygnifyTreasury.address, "50000000000000");
	});
	describe("_MultiSign_init", function () {
		describe("positive cases", function () {
			it("should initialize correctly", async function () {
				await multiSign._MultiSign_init([owner1.address, owner2.address], 2);
			});
		});
		describe("negative cases", function () {
			it("should revert if owner count is 0", async function () {
				await expect(multiSign._MultiSign_init([], 0)).to.be.revertedWith(
					"owners required"
				);
			});
			it("should revert for number of required confirmations equals 0", async function () {
				await expect(
					multiSign._MultiSign_init([owner1.address, owner2.address], 0)
				).to.be.revertedWith("invalid number of required confirmations");
			});
			it("should revert for number of required confirmations greater than owners", async function () {
				await expect(
					multiSign._MultiSign_init([owner1.address, owner2.address], 5)
				).to.be.revertedWith("invalid number of required confirmations");
			});
			it("should revert for invalid owner", async function () {
				await expect(
					multiSign._MultiSign_init(
						[owner1.address, ethers.constants.AddressZero],
						2
					)
				).to.be.revertedWith("invalid owner");
			});
			it("should revert if owners not unique", async function () {
				await expect(
					multiSign._MultiSign_init([owner1.address, owner1.address], 2)
				).to.be.revertedWith("owner not unique");
			});
		});
		describe("border cases", function () {
			it("should revert if not passing owners array", async function () {
				await expect(multiSign._MultiSign_init(owner1.address, 2)).to.be
					.reverted;
			});
			it("should revert for overflow owner", async function () {
				await expect(multiSign._MultiSign_init([overflow, owner2.address], 2))
					.to.be.reverted;
			});
			it("should revert for underflow owner", async function () {
				await expect(multiSign._MultiSign_init([-55, owner2.address], 2)).to.be
					.reverted;
			});
			it("should revert for overflow numConfirmationsRequired", async function () {
				await expect(
					multiSign._MultiSign_init([owner1.address, owner2.address], overflow)
				).to.be.reverted;
			});
			it("should revert for underflow numConfirmationsRequired", async function () {
				await expect(
					multiSign._MultiSign_init([owner1.address, owner2.address], -2)
				).to.be.reverted;
			});
		});
	});
	describe("submitTransaction", function () {
		beforeEach(
			async () =>
				await multiSign._MultiSign_init([owner1.address, owner2.address], 2)
		);
		describe("positive cases", function () {
			it("should submit transaction", async function () {
				await expect(
					multiSign
						.connect(owner1)
						.submitTransaction(
							dygnifyTreasury.address,
							0,
							"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
						)
				)
					.to.emit(multiSign, "SubmitTransaction")
					.withArgs(
						owner1.address,
						0,
						dygnifyTreasury.address,
						0,
						"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
					);
			});
		});
		describe("negative cases", function () {
			it("should revert if to address is zero", async function () {
				await expect(
					multiSign.submitTransaction(
						ethers.constants.AddressZero,
						0,
						"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
					)
				).to.be.revertedWith("invalid address");
			});
		});
		describe("border cases", function () {
			it("should revert for overflow to address", async function () {
				await expect(
					multiSign.submitTransaction(
						overflow,
						0,
						"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
					)
				).to.be.reverted;
			});
			it("should revert for overflow value", async function () {
				await expect(
					multiSign.submitTransaction(
						dygnifyTreasury.address,
						overflow,
						"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
					)
				).to.be.reverted;
			});
			it("should revert for underflow to address", async function () {
				await expect(
					multiSign.submitTransaction(
						-22545454,
						0,
						"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
					)
				).to.be.reverted;
			});
			it("should revert for underflow value", async function () {
				await expect(
					multiSign.submitTransaction(
						dygnifyTreasury.address,
						-1,
						"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
					)
				).to.be.reverted;
			});
		});
	});
	describe("confirmTransaction", function () {
		beforeEach(async () => {
			await multiSign._MultiSign_init([owner1.address, owner2.address], 2);
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
		});
		describe("positive cases", function () {
			it("should confirm transaction", async function () {
				await expect(multiSign.connect(owner1).confirmTransaction(0))
					.to.emit(multiSign, "ConfirmTransaction")
					.withArgs(owner1.address, 0);
			});
		});
		describe("negative cases", function () {
			it("should revert if not executed by owner", async function () {
				await expect(
					multiSign.connect(user).confirmTransaction(0)
				).to.be.revertedWith("not owner");
			});
			it("should revert if transaction not exist", async function () {
				await expect(
					multiSign.connect(owner1).confirmTransaction(5)
				).to.be.revertedWith("tx does not exist");
			});
			it("should revert if transaction already confirmed", async function () {
				await multiSign.connect(owner1).confirmTransaction(0);
				await expect(
					multiSign.connect(owner1).confirmTransaction(0)
				).to.be.revertedWith("tx already confirmed");
			});
			it("should revert if transaction already executed", async function () {
				await multiSign.connect(owner1).confirmTransaction(0);
				await multiSign.connect(owner2).confirmTransaction(0);
				await expect(
					multiSign.connect(owner2).confirmTransaction(0)
				).to.be.revertedWith("tx already executed");
			});
		});
		describe("border cases", function () {
			it("should revert for overflow txIndex", async function () {
				await expect(multiSign.connect(owner1).confirmTransaction(overflow)).to
					.be.reverted;
			});
			it("should revert for underflow txIndex", async function () {
				await expect(multiSign.connect(owner1).confirmTransaction(-2)).to.be
					.reverted;
			});
		});
	});
	describe("revokeConfirmation", function () {
		beforeEach(async () => {
			await multiSign._MultiSign_init([owner1.address, owner2.address], 2);
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
			multiSign.connect(owner1).confirmTransaction(0);
		});
		describe("positive cases", function () {
			it("should revoke confirmation", async function () {
				await expect(multiSign.connect(owner1).revokeConfirmation(0))
					.to.emit(multiSign, "RevokeConfirmation")
					.withArgs(owner1.address, 0);
			});
		});
		describe("negative cases", function () {
			it("should revert if not executed by owner", async function () {
				await expect(
					multiSign.connect(user).revokeConfirmation(0)
				).to.be.revertedWith("not owner");
			});
			it("should revert if transaction not exists", async function () {
				await expect(
					multiSign.connect(owner1).revokeConfirmation(5)
				).to.be.revertedWith("tx does not exist");
			});
			it("should revert if transaction already executed", async function () {
				await multiSign.connect(owner2).confirmTransaction(0);
				await expect(
					multiSign.connect(owner1).revokeConfirmation(0)
				).to.be.revertedWith("tx already executed");
			});
			it("should revert if transaction not confirmed", async function () {
				await expect(
					multiSign.connect(owner2).revokeConfirmation(0)
				).to.be.revertedWith("tx not confirmed");
			});
		});
		describe("border cases", function () {
			it("should revert for overflow txIndex", async function () {
				await expect(multiSign.connect(owner1).revokeConfirmation(overflow)).to
					.be.reverted;
			});
			it("should revert for underflow txIndex", async function () {
				await expect(multiSign.connect(owner1).revokeConfirmation(-2)).to.be
					.reverted;
			});
		});
	});
	describe("addOwner", function () {
		beforeEach(
			async () =>
				await multiSign._MultiSign_init([owner1.address, owner2.address], 2)
		);
		describe("positive cases", function () {
			it("should add owner", async function () {
				await expect(multiSign.connect(admin).addOwner(user.address))
					.to.emit(multiSign, "OwnerAdded")
					.withArgs(user.address);
			});
		});
		describe("negative cases", function () {
			it("should revert if function executor is not admin", async function () {
				await expect(
					multiSign.connect(owner1).addOwner(user.address)
				).to.be.revertedWith("Must have admin role to perform this action");
			});
			it("should revert for invalid owner", async function () {
				await expect(
					multiSign.connect(admin).addOwner(ethers.constants.AddressZero)
				).to.be.revertedWith("invalid owner");
			});
			it("should revert if owner already exists", async function () {
				await expect(
					multiSign.connect(admin).addOwner(owner1.address)
				).to.be.revertedWith("owner not unique");
			});
		});
		describe("border cases", function () {
			it("should revert for overflow owner address", async function () {
				await expect(multiSign.connect(admin).addOwner(overflow)).to.be
					.reverted;
			});
			it("should revert for underflow owner address", async function () {
				await expect(multiSign.connect(admin).addOwner(-2)).to.be.reverted;
			});
		});
	});
	describe("removeOwner", function () {
		beforeEach(
			async () =>
				await multiSign._MultiSign_init([owner1.address, owner2.address], 2)
		);
		describe("positive cases", function () {
			it("should remove owner", async function () {
				await expect(multiSign.connect(admin).removeOwner(owner2.address))
					.to.emit(multiSign, "OwnerRemoved")
					.withArgs(owner2.address);
			});
		});
		describe("negative cases", function () {
			it("should revert if function executor is not admin", async function () {
				await expect(
					multiSign.connect(owner1).removeOwner(owner2.address)
				).to.be.revertedWith("Must have admin role to perform this action");
			});
			it("should revert for invalid owner", async function () {
				await expect(
					multiSign.connect(admin).removeOwner(ethers.constants.AddressZero)
				).to.be.revertedWith("invalid owner");
			});
			it("should revert if owner does not exists", async function () {
				await expect(
					multiSign.connect(admin).removeOwner(user.address)
				).to.be.revertedWith("owner does not exist");
			});
		});
		describe("border cases", function () {
			it("should revert for overflow owner address", async function () {
				await expect(multiSign.connect(admin).removeOwner(overflow)).to.be
					.reverted;
			});
			it("should revert for underflow owner address", async function () {
				await expect(multiSign.connect(admin).removeOwner(-2)).to.be.reverted;
			});
		});
	});
	describe("updateNumConfirmationsRequired", function () {
		beforeEach(
			async () =>
				await multiSign._MultiSign_init([owner1.address, owner2.address], 2)
		);
		describe("positive cases", function () {
			it("should update number of confirmations required", async function () {
				await expect(multiSign.connect(admin).updateNumConfirmationsRequired(1))
					.to.emit(multiSign, "ConfirmationsRequiredUpdated")
					.withArgs(1);
			});
		});
		describe("negative cases", function () {
			it("should revert if function executor is not admin", async function () {
				await expect(
					multiSign
						.connect(owner1)
						.updateNumConfirmationsRequired(owner2.address)
				).to.be.revertedWith("Must have admin role to perform this action");
			});
			it("should revert for invalid number of confirmations required", async function () {
				await expect(
					multiSign.connect(admin).updateNumConfirmationsRequired(5)
				).to.be.revertedWith("invalid number of confirmations required");
			});
		});
		describe("border cases", function () {
			it("should revert for overflow number of confirmations required", async function () {
				await expect(
					multiSign.connect(admin).updateNumConfirmationsRequired(overflow)
				).to.be.reverted;
			});
			it("should revert for underflow number of confirmations required", async function () {
				await expect(
					multiSign.connect(admin).updateNumConfirmationsRequired(-2)
				).to.be.reverted;
			});
		});
	});
	describe("getOwners", function () {
		beforeEach(
			async () =>
				await multiSign._MultiSign_init([owner1.address, owner2.address], 2)
		);
		it("should get owners", async function () {
			expect(JSON.stringify(await multiSign.getOwners())).to.equal(
				JSON.stringify([owner1.address, owner2.address])
			);
		});
	});
	describe("getTransactionCount", function () {
		beforeEach(
			async () =>
				await multiSign._MultiSign_init([owner1.address, owner2.address], 2)
		);
		it("should get transaction count", async function () {
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
			expect(await multiSign.getTransactionCount()).to.equal(1);
		});
	});
	describe("getTransaction", function () {
		beforeEach(
			async () =>
				await multiSign._MultiSign_init([owner1.address, owner2.address], 2)
		);
		it("should get transaction", async function () {
			await multiSign
				.connect(owner1)
				.submitTransaction(
					dygnifyTreasury.address,
					0,
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000"
				);
			let tx = await multiSign.getTransaction(0);
			tx = tx.map((item) => item.toString());
			expect(JSON.stringify(tx)).to.equal(
				JSON.stringify([
					dygnifyTreasury.address,
					"0",
					"0xf3fef3a30000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc00000000000000000000000000000000000000000000000000002d79883d2000",
					"false",
					"0",
				])
			);
		});
	});
});
