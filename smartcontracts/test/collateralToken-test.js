const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CollateralToken", function () {
  let collateralToken, minter, tokenOwner, otherAccount;
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
  });

  describe("initialize", () => {
    it("initilizes the token Correctly.", async () => {
      const name = await collateralToken.name();
      const symbol = await collateralToken.symbol();
      expect(name).to.equal("CollateralToken");
      expect(symbol).to.equal("CT");
    });
  });

  describe("safeMint", function () {
    describe("positive cases", function () {
      it("should able mint token", async function () {
        expect(await collateralToken.safeMint(tokenOwner.address, "abcd"));
      });

      it("should match ownerOf token", async function () {
        expect(await collateralToken.safeMint(tokenOwner.address, "abcd"));
        expect(await collateralToken.ownerOf(0)).to.equal(tokenOwner.address);
      });

      it("should match tokenURI", async function () {
        const tx = await collateralToken.safeMint(tokenOwner.address, "abcd");
        await tx.wait();
        const tokenUri = await collateralToken.tokenURI(0);
        expect(tokenUri).to.equal("ipfs://abcd");
      });
    });

    describe("negative cases", function () {
      it("should fail to mint token if function executor is not minter", async function () {
        collateralToken = collateralToken.connect(tokenOwner);
        await expect(collateralToken.safeMint(tokenOwner.address, "abcd")).to.be
          .reverted;
      });
    });
  });

  describe("burn", function () {
    describe("positive cases", function () {
      it("only token owner should able burn token", async function () {
        await collateralToken.safeMint(tokenOwner.address, "abcd");
        collateralToken = collateralToken.connect(tokenOwner);
        expect(await collateralToken.burn(0));
      });
    });

    describe("negative cases", function () {
      it("should fail if function executor is minter, not the token owner", async function () {
        await collateralToken.safeMint(tokenOwner.address, "abcd");
        await expect(collateralToken.burn(0)).to.be.reverted;
      });

      it("should fail if function executor is not token owner", async function () {
        await collateralToken.safeMint(tokenOwner.address, "abcd");
        collateralToken = collateralToken.connect(otherAccount);
        await expect(collateralToken.burn(0)).to.be.reverted;
      });
    });
  });
});
