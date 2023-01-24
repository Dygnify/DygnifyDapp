const { expect, assert, use } = require("chai");
const { ethers } = require("hardhat");

// string of length 33 
const overflow = "123456789009876543212345678909877";

describe("Borrower", function () {
  let borrower, user;
  beforeEach(async () => {
    // deploy Borrower.sol
    const Borrower = await ethers.getContractFactory("Borrower");
    borrower = await Borrower.deploy();
    await borrower.deployed();

    const accounts = await ethers.getSigners();
    user = accounts[0];
  });

  describe("updateBorrowerProfile", function () {
    const updateBorrowerProfile = (cid) =>
      async function () {
        await borrower.updateBorrowerProfile(cid);
        const borrowerProfile = await borrower.borrowerProfile(user.address);

        assert.equal(borrowerProfile.toString(), cid);
      };

    const updateBorrowerProfileThrice = (cid1, cid2, cid3) =>
      async function () {
        await borrower.updateBorrowerProfile(cid1);
        await borrower.updateBorrowerProfile(cid2);
        await borrower.updateBorrowerProfile(cid3);
        const borrowerProfile = await borrower.borrowerProfile(user.address);

        assert.equal(borrowerProfile.toString(), cid3);
      };

    describe("Positive cases", function () {
      it(
        "user updates borrowerProfile successfully",
        updateBorrowerProfile("123")
      );

      it(
        "user updates borrowerProfile successfully",
        updateBorrowerProfile("234")
      );

      it(
        "user updates borrowerProfile successfully",
        updateBorrowerProfile("345")
      );

      it(
        "user updates borrowerProfile successfully",
        updateBorrowerProfile("678")
      );

      it("call updateBorrowerProfile thirce", async function () {
        updateBorrowerProfileThrice("123", "345", "567");
      });
    });

    describe("Negative cases", function () {
      it("reverts if giving no cid", async function () {
        await expect(borrower.updateBorrowerProfile("")).to.be.revertedWith(
          "Invalid CID"
        );
      });
    });

    describe("Border cases", function () {
      it("cid is going to overflow", async function () {
        await expect(
          borrower.updateBorrowerProfile(overflow)
        ).to.be.revertedWith("Invalid CID");
      });
    });
  });
});
