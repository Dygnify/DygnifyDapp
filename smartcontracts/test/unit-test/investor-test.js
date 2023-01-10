const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Investor", function () {
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

    // Deploy Mock OpportunityOrigination
    const OpportunityOrigination = await ethers.getContractFactory(
      "MockOpportunityOrigination"
    );
    opportunityOrigination = await OpportunityOrigination.deploy(
      opportunityPool.address
    );
    await opportunityOrigination.deployed();

    await dygnifyConfig.setAddress(6, opportunityOrigination.address);

    // Deploy Investor
    const Investor = await ethers.getContractFactory("Investor");
    investor = await Investor.deploy();
    await investor.deployed();

    // Initialize Investor
    await investor.initialize(dygnifyConfig.address);
  });

  describe("addOpportunity", function () {
    describe("positive cases", function () {
      it("should add single opportunity", async function () {
        expect(
          await opportunityPool.addOpportunity(
            investor.address,
            owner.address,
            ethers.utils.formatBytes32String("id1")
          )
        );
      });

      it("should add multiple opportunities", async function () {
        expect(
          await opportunityPool.addOpportunity(
            investor.address,
            owner.address,
            ethers.utils.formatBytes32String("id1")
          )
        );
        expect(
          await opportunityPool.addOpportunity(
            investor.address,
            owner.address,
            ethers.utils.formatBytes32String("id2")
          )
        );
      });
    });

    describe("negative cases", function () {
      it("should revert if investorAddress is 0", async function () {
        await expect(
          investor.addOpportunity(
            "0x0000000000000000000000000000000000000000",
            ethers.utils.formatBytes32String("id1")
          )
        ).to.be.revertedWith("Invalid Investor address");
      });

      it("should revert if not called by OpportunityPool", async function () {
        await expect(
          investor.addOpportunity(
            owner.address,
            ethers.utils.formatBytes32String("id1")
          )
        ).to.be.revertedWith(
          "Given opportunity can only be added by that pool."
        );
      });
    });
  });

  describe("removeOpportunity", function () {
    describe("positive cases", function () {
      it("should remove single opportunity", async function () {
        await opportunityPool.addOpportunity(
          investor.address,
          owner.address,
          ethers.utils.formatBytes32String("id1")
        );
        expect(
          await opportunityPool.removeOpportunity(
            investor.address,
            owner.address,
            ethers.utils.formatBytes32String("id1")
          )
        );
      });

      it("should remove multiple opportunities", async function () {
        await opportunityPool.addOpportunity(
          investor.address,
          owner.address,
          ethers.utils.formatBytes32String("id1")
        );
        await opportunityPool.addOpportunity(
          investor.address,
          owner.address,
          ethers.utils.formatBytes32String("id2")
        );
        expect(
          await opportunityPool.removeOpportunity(
            investor.address,
            owner.address,
            ethers.utils.formatBytes32String("id1")
          )
        );
        expect(
          await opportunityPool.removeOpportunity(
            investor.address,
            owner.address,
            ethers.utils.formatBytes32String("id2")
          )
        );
      });
    });

    describe("negative cases", function () {
      it("should revert if investorAddress is 0", async function () {
        await expect(
          investor.removeOpportunity(
            "0x0000000000000000000000000000000000000000",
            ethers.utils.formatBytes32String("id1")
          )
        ).to.be.revertedWith("Invalid Investor address");
      });

      it("should revert if not called by OpportunityPool", async function () {
        await expect(
          investor.removeOpportunity(
            owner.address,
            ethers.utils.formatBytes32String("id1")
          )
        ).to.be.revertedWith(
          "Given opportunity can only be added by that pool."
        );
      });

      it("should revert if investor doesn't have any existing opportunity", async function () {
        await expect(
          opportunityPool.removeOpportunity(
            investor.address,
            owner.address,
            ethers.utils.formatBytes32String("id1")
          )
        ).to.be.revertedWith("Investor doesn't invested in this opportunity.");
      });
    });
  });

  describe("getOpportunityOfInvestor", function () {
    describe("positive cases", function () {
      it("should match for single opportunity", async function () {
        await opportunityPool.addOpportunity(
          investor.address,
          owner.address,
          ethers.utils.formatBytes32String("id1")
        );
        expect(
          JSON.stringify(await investor.getOpportunityOfInvestor(owner.address))
        ).to.equal(JSON.stringify([ethers.utils.formatBytes32String("id1")]));
      });

      it("should match for multiple opportunities", async function () {
        await opportunityPool.addOpportunity(
          investor.address,
          owner.address,
          ethers.utils.formatBytes32String("id1")
        );
        await opportunityPool.addOpportunity(
          investor.address,
          owner.address,
          ethers.utils.formatBytes32String("id2")
        );
        expect(
          JSON.stringify(await investor.getOpportunityOfInvestor(owner.address))
        ).to.equal(
          JSON.stringify([
            ethers.utils.formatBytes32String("id1"),
            ethers.utils.formatBytes32String("id2"),
          ])
        );
      });
    });

    describe("negative cases", function () {
      it("should revert if investorAddress is 0", async function () {
        await expect(
          investor.getOpportunityOfInvestor(
            "0x0000000000000000000000000000000000000000"
          )
        ).to.be.revertedWith("Invalid investor address");
      });

      it("should return for empty opportunity if no opportunity found", async function () {
        expect(
          JSON.stringify(await investor.getOpportunityOfInvestor(owner.address))
        ).to.equal(JSON.stringify([]));
      });
    });
  });

  describe("isExistInInvestor", function () {
    describe("positive cases", function () {
      it("should return true if id found", async function () {
        await opportunityPool.addOpportunity(
          investor.address,
          owner.address,
          ethers.utils.formatBytes32String("id1")
        );
        expect(
          await investor.isExistInInvestor(
            owner.address,
            ethers.utils.formatBytes32String("id1")
          )
        ).to.equal(true);
      });
    });

    describe("negative cases", function () {
      it("should return false if id not found", async function () {
        expect(
          await investor.isExistInInvestor(
            owner.address,
            ethers.utils.formatBytes32String("id1")
          )
        ).to.equal(false);
      });

      it("should revert if investorAddress is 0", async function () {
        await expect(
          investor.isExistInInvestor(
            "0x0000000000000000000000000000000000000000",
            ethers.utils.formatBytes32String("id1")
          )
        ).to.be.revertedWith("Invalid investor address");
      });
    });
  });
});
