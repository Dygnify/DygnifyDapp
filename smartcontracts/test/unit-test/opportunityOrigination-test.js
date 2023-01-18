const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");

const OVERFLOW =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";
const ZEROADDRESS = ethers.constants.AddressZero;
const ID = ethers.utils.id("aadhar");

describe("OpportunityOrigination", function () {
	let opportunityOrigination,
		dygnifyConfig,
		configHelper,
		collateralToken,
		opportunityPool,
		dygnifyKeeper;

	beforeEach(async () => {
		// deploy DygnifyConfig.sol
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();

		// deploy OpportunityOrigination.sol
		const OpportunityOrigination = await ethers.getContractFactory(
			"OpportunityOrigination"
		);
		opportunityOrigination = await OpportunityOrigination.deploy();
		await opportunityOrigination.deployed();

		// deploy ConfigHelper.sol
		const ConfigHelper = await ethers.getContractFactory("ConfigHelper");
		configHelper = await ConfigHelper.deploy();
		await configHelper.deployed();

		// deploy DygnifyKeeper.sol
		const DygnifyKeeper = await hre.ethers.getContractFactory("DygnifyKeeper");
		dygnifyKeeper = await DygnifyKeeper.deploy();
		await dygnifyKeeper.deployed();

		// deploy CollateralToken.sol
		const CollateralToken = await ethers.getContractFactory("CollateralToken");
		collateralToken = await CollateralToken.deploy();
		await collateralToken.deployed();

		// deploy OpportunityPool.sol
		const OpportunityPool = await ethers.getContractFactory("OpportunityPool");
		opportunityPool = await OpportunityPool.deploy();
		await opportunityPool.deployed();

		// initialize dygnifyConfig and pass it to opportunityOrigination
		await dygnifyConfig.initialize();

		// await dygnifyConfig.setAddress(4, opportunityPool.address);
		await dygnifyConfig.setAddress(5, collateralToken.address);
		await dygnifyConfig.setAddress(6, opportunityOrigination.address);
		await dygnifyConfig.setAddress(9, dygnifyKeeper.address);
		await opportunityOrigination.initialize(dygnifyConfig.address);
		// await dygnifyKeeper.initialize(dygnifyConfig.address);
		// initialize collateralToken
		await collateralToken.initialize(
			dygnifyConfig.address,
			opportunityOrigination.address
		);
	});

	// createOpportunity function

	describe("createOpportunity", function () {
		const createOpportunity = ({
			borrowerAddress,
			opportunityName,
			opportunityInfo,
			loanType,
			loanAmount,
			loanTenureInDays,
			loanInterest,
			paymentFrequencyInDays,
			collateralDocument,
			capitalLoss,
			expected,
		}) =>
			async function () {
				await opportunityOrigination.createOpportunity({
					borrowerAddress,
					opportunityName,
					opportunityInfo,
					loanType,
					loanAmount,
					loanTenureInDays,
					loanInterest,
					paymentFrequencyInDays,
					collateralDocument,
					capitalLoss,
				});
				// The Ethereum Identity function computes the KECCAK256 hash of the text bytes.
				const id = ethers.utils.id(collateralDocument);
				const opportunityToId = await opportunityOrigination.opportunityToId(
					id
				);
				// check each value inside of opportunityToId
				assert.equal(opportunityToId.opportunityID.toString(), id);
				assert.equal(opportunityToId.borrower, expected[0]);
				assert.equal(opportunityToId.opportunityName, opportunityName);
				assert.equal(opportunityToId.opportunityInfo, opportunityInfo);
				assert.equal(opportunityToId.loanType, loanType);
				assert.equal(opportunityToId.loanAmount.toString(), loanAmount);
				assert.equal(
					opportunityToId.loanTenureInDays.toString(),
					loanTenureInDays
				);
				assert.equal(opportunityToId.loanInterest.toString(), loanInterest);
				assert.equal(
					opportunityToId.paymentFrequencyInDays.toString(),
					paymentFrequencyInDays
				);
				assert.equal(opportunityToId.collateralDocument, collateralDocument);
				assert.equal(opportunityToId.capitalLoss.toString(), capitalLoss);
				assert.equal(opportunityToId.opportunityStatus, "0");
				assert.equal(opportunityToId.opportunityPoolAddress, ZEROADDRESS);
				//assert.equal(opportunityToId.createdOn.toString(), block.timestamp);
				// check isOpportunity is true or not
				const isOpportunityOfBorrower = await opportunityInfo.isOpportunityOf(
					id
				);
				assert(isOpportunityOfBorrower);
				// length of opportunityIds should be increased by 1
				const opportunityIds = await opportunityOrigination.opportunityIds();
				assert.equal(opportunityIds.length, 1);
			};
		//	positive cases
		describe("Positive cases", function () {
			it("1. should createOpportunity successfully", async function () {
				const borrower = await ethers.getSigner();
				createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					},
					[borrower.address]
				);
			});

			it("2. should createOpportunity successfully", async function () {
				const borrower = await ethers.getSigner();
				createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "abc",
						opportunityInfo: "for bullet loan",
						loanType: 0,
						loanAmount: 5000000000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					},
					[borrower.address]
				);
			});
			it("3. should createOpportunity successfully", async function () {
				const borrower = await ethers.getSigner();
				createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "xzy",
						opportunityInfo: "for Bullet loan",
						loanType: 0,
						loanAmount: 2500340000000,
						loanTenureInDays: 512,
						loanInterest: 9000000,
						paymentFrequencyInDays: 90,
						collateralDocument: "pan",
						capitalLoss: 430000000,
					},
					[borrower.address]
				);
			});

			it("4. should createOpportunity successfully", async function () {
				const borrower = await ethers.getSigner();
				createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 250007870000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "pan",
						capitalLoss: 10000000,
					},
					[borrower.address]
				);
			});
		});
		//	negative cases
		describe("Negative cases", function () {
			it("revert when LoanType is out of range", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 4,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.reverted;
			});
			it("revert when loan amount is 0", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 0,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.revertedWith("Loan Amount Must be greater than 0");
			});
			it("revert when borrower is address 0", async function () {
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: ZEROADDRESS,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.revertedWith("invalid borrower address");
			});
			it("revert when loan interest is 0", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: 0,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.revertedWith(
					"Loan Interest Must be greater than 0 and less than or equal to 100"
				);
			});
			it("revert when loan interest is greater than 100%", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: 101000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.revertedWith(
					"Loan Interest Must be greater than 0 and less than or equal to 100"
				);
			});
			it("revert when loanTenureInDays is 0", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 234356700000,
						loanTenureInDays: 0,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.revertedWith("Loan Tenure Must be greater than 0");
			});
			it("revert when paymentFrequencyInDays is 0", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 23498000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 0,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.revertedWith("Payment Frequency Must be greater than 0");
			});

			it("revert when opportunityName greater than 50", async function () {
				const oppoName =
					"000000000000078978798798798798798798kjkjkjkjkjkjkjkj987090000070777";
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: oppoName,
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 234565000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.revertedWith(
					"Length of Opportunity name must be less than or equal to 50"
				);
			});
			it("revert when same document used to create differenct opportunity", async function () {
				const borrower = await ethers.getSigner();
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xzy",
					opportunityInfo: "for Bullet loan",
					loanType: 0,
					loanAmount: 2500340000000,
					loanTenureInDays: 512,
					loanInterest: 9000000,
					paymentFrequencyInDays: 90,
					collateralDocument: "pan",
					capitalLoss: 430000000,
				});
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "abc",
						opportunityInfo: "for Term Loan",
						loanType: 1,
						loanAmount: 2500340000000,
						loanTenureInDays: 512,
						loanInterest: 9000000,
						paymentFrequencyInDays: 90,
						collateralDocument: "pan",
						capitalLoss: 430000000,
					})
				).to.be.revertedWith(
					"Same collatoral document is been used to create different opportunity."
				);
			});
		});

		describe("Border cases", function () {
			it("going to overflow for LoanType", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: OVERFLOW,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.reverted;
			});
			it("going to overflow for loan amount", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: OVERFLOW,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.reverted;
			});
			it("going to overflow for loan interest", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: OVERFLOW,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.reverted;
			});
			it("going to overflow for loanTenureInDays", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 234356700000,
						loanTenureInDays: OVERFLOW,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.reverted;
			});
			it("going to overflow for paymentFrequencyInDays", async function () {
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 23498000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: OVERFLOW,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.reverted;
			});
			it("revert when opportunityName greater than 50", async function () {
				const oppoName = "123456789009876543212345678909877";
				const borrower = await ethers.getSigner();
				await expect(
					opportunityOrigination.createOpportunity({
						borrower: borrower.address,
						opportunityName: oppoName,
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 234565000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					})
				).to.be.reverted;
			});
		});
	});

	describe("assignUnderwriters", function () {
		const fn = (
			{
				borrowerAddress,
				opportunityName,
				opportunityInfo,
				loanType,
				loanAmount,
				loanTenureInDays,
				loanInterest,
				paymentFrequencyInDays,
				collateralDocument,
				capitalLoss,
			},
			i
		) =>
			async function () {
				const accounts = await ethers.getSigners();
				await opportunityOrigination.createOpportunity({
					borrowerAddress,
					opportunityName,
					opportunityInfo,
					loanType,
					loanAmount,
					loanTenureInDays,
					loanInterest,
					paymentFrequencyInDays,
					collateralDocument,
					capitalLoss,
				});

				const id = ethers.utils.id(collateralDocument);

				expect(
					await opportunityOrigination.assignUnderwriters(
						id,
						accounts[i].address
					)
				);
			};

		describe("Positive cases", function () {
			it("given opportunityId assigns underwriter correctly", async function () {
				const borrower = await ethers.getSigner();
				fn(
					{
						borrower: borrower.address,
						opportunityName: "xzy",
						opportunityInfo: "for Bullet loan",
						loanType: 0,
						loanAmount: 2500340000000,
						loanTenureInDays: 512,
						loanInterest: 9000000,
						paymentFrequencyInDays: 90,
						collateralDocument: "pan",
						capitalLoss: 430000000,
					},
					0
				);
			});

			it("given opportunityId assigns underwriter correctly", async function () {
				const borrower = await ethers.getSigner();
				fn(
					{
						borrower: borrower.address,
						opportunityName: "xzy",
						opportunityInfo: "for Bullet loan",
						loanType: 0,
						loanAmount: 2500340000000,
						loanTenureInDays: 512,
						loanInterest: 9000000,
						paymentFrequencyInDays: 90,
						collateralDocument: "pan",
						capitalLoss: 430000000,
					},
					1
				);
			});

			it("given opportunityId assigns underwriter correctly", async function () {
				const borrower = await ethers.getSigner();
				fn(
					{
						borrower: borrower.address,
						opportunityName: "xzy",
						opportunityInfo: "for Bullet loan",
						loanType: 0,
						loanAmount: 2500340000000,
						loanTenureInDays: 512,
						loanInterest: 9000000,
						paymentFrequencyInDays: 90,
						collateralDocument: "pan",
						capitalLoss: 430000000,
					},
					2
				);
			});

			it("given opportunityId assigns underwriter correctly", async function () {
				const borrower = await ethers.getSigner();
				fn(
					{
						borrower: borrower.address,
						opportunityName: "xzy",
						opportunityInfo: "for Bullet loan",
						loanType: 0,
						loanAmount: 2500340000000,
						loanTenureInDays: 512,
						loanInterest: 9000000,
						paymentFrequencyInDays: 90,
						collateralDocument: "aadhar",
						capitalLoss: 430000000,
					},
					3
				);
			});
		});

		describe("Negative cases", function () {
			it("reverts when caller is not admin", async function () {
				const accounts = await ethers.getSigners();
				const id = ethers.utils.id("pan");
				opportunityOrigination = opportunityOrigination.connect(accounts[6]);
				await expect(
					opportunityOrigination.assignUnderwriters(id, accounts[2].address)
				).to.be.revertedWith("Must have admin role to perform this action");
			});

			it("reverts when underwriter addrsess is zero address", async function () {
				const id = ethers.utils.id("pan");
				await expect(
					opportunityOrigination.assignUnderwriters(id, ZEROADDRESS)
				).to.be.revertedWith("Invalid Address");
			});

			it("reverts when opportunity does not exist", async function () {
				const underwriter = await ethers.getSigner();
				const id = ethers.utils.id("pan");
				await expect(
					opportunityOrigination.assignUnderwriters(id, underwriter.address)
				).to.be.revertedWith("Opportunity ID doesn't exist");
			});

			it("reverts when opportunity is already judged", async function () {
				const [borrower, underwriter] = await ethers.getSigners();
				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});
				const id = ethers.utils.id("aadhar");
				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					id,
					underwriter.address
				);

				// call voteOpportunity function
				opportunityOriginationConnectUnderwriter =
					opportunityOrigination.connect(underwriter);
				await opportunityOriginationConnectUnderwriter.voteOpportunity(id, 2);

				const tx = await opportunityOrigination.opportunityToId(id);

				await expect(
					opportunityOrigination.assignUnderwriters(id, underwriter.address)
				).to.be.revertedWith("Opportunity is already Judged");
			});
		});

		describe("Border cases", function () {
			it("going to owerflow for opportuntiyId", async function () {
				const underwriter = await ethers.getSigner();
				const id =
					"0x42e0ac7bc628eb9081b512f4eb24bd9b3aea00331eef760c30c1229f287295c79";
				await expect(
					opportunityOrigination.assignUnderwriters(id, underwriter.address)
				).to.be.reverted;
			});

			it("going to owerflow for opportuntiyId", async function () {
				const underwriter = await ethers.getSigner();
				const id =
					"0x42e0ac7bc628eb9081b512f4eb24bd8989b3aea00331eef760c30c1229f287295c79";
				await expect(
					opportunityOrigination.assignUnderwriters(id, underwriter.address)
				).to.be.reverted;
			});
		});
	});

	describe("voteOpportunity", function () {
		const voteOpportunity = (status, expected) =>
			async function () {
				const [borrower, underwriter] = await ethers.getSigners();

				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				const id = ethers.utils.id("aadhar");
				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					id,
					underwriter.address
				);

				// call voteOpportunity function
				opportunityOrigination = opportunityOrigination.connect(underwriter);
				await opportunityOrigination.voteOpportunity(id, status);

				// check opportunityToId[id].opportunityStatus has current status
				const opportunityToIdFromContract =
					await opportunityOrigination.opportunityToId(id);

				assert.equal(opportunityToIdFromContract.opportunityStatus, expected);
			};

		describe("Positive cases", function () {
			it(
				"underwriter should reject opportunity successfully",
				voteOpportunity(1, 1)
			);

			it(
				"underwriter should approve opportunity and function should mint oppotunity and create opportunity pool successfully",
				voteOpportunity(2, 5)
			);

			it("underwriter is Unsure about opportunity", voteOpportunity(3, 3));
		});

		describe("Negative cases", function () {
			it("reverts when caller is not auditor of opportunity", async function () {
				const [borrower, underwriter] = await ethers.getSigners();

				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				const id = ethers.utils.id("aadhar");
				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					id,
					underwriter.address
				);

				// call voteOpportunity function

				await expect(
					opportunityOrigination.voteOpportunity(id, 1)
				).to.be.revertedWith("You are not an audiitor for this Opportunity.");
			});

			it("reverts when opportunity does not exist", async function () {
				const id = ethers.utils.id("aadhar");

				const [borrower, underwriter] = await ethers.getSigners();

				await expect(opportunityOrigination.voteOpportunity(id, 1)).to.be
					.reverted;
			});

			it("reverts when status is more than 3", async function () {
				const [borrower, underwriter] = await ethers.getSigners();

				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				const id = ethers.utils.id("aadhar");
				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					id,
					underwriter.address
				);

				// call voteOpportunity function
				opportunityOrigination = opportunityOrigination.connect(underwriter);

				await expect(
					opportunityOrigination.voteOpportunity(id, 4)
				).to.be.revertedWith("Status : out of range");
			});

			it("reverts when opportunity is judged before", async function () {
				const [borrower, underwriter] = await ethers.getSigners();

				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				const id = ethers.utils.id("aadhar");
				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					id,
					underwriter.address
				);

				// call voteOpportunity function
				opportunityOrigination = opportunityOrigination.connect(underwriter);

				await opportunityOrigination.voteOpportunity(id, 3);
				await expect(
					opportunityOrigination.voteOpportunity(id, 2)
				).to.be.revertedWith("Opportunity is already Judged");
			});
		});

		describe("Border cases", function () {
			it("going to overflow for status", async function () {
				const id = ethers.utils.id("aadhar");
				const status = 257;
				await expect(opportunityOrigination.voteOpportunity(id, status)).to.be
					.reverted;
			});

			it("going to overflow for status", async function () {
				const id = ethers.utils.id("aadhar");
				const status = 10;
				await expect(opportunityOrigination.voteOpportunity(id, status)).to.be
					.reverted;
			});
		});
	});

	describe("markDrawDown", function () {
		describe("Positive cases", function () {
			let opportunityPool, opportunityOrigination, admin;
			beforeEach(async function () {
				const accounts = await ethers.getSigners();
				// deploy MockOpportunityPoolV1.sol
				const OpportunityPool = await ethers.getContractFactory(
					"MockOpportunityPoolV1"
				);
				opportunityPool = await OpportunityPool.deploy();
				await opportunityPool.deployed();

				// deployMockOpportunityOriginationForTestingOO.sol
				const OpportunityOrigination = await ethers.getContractFactory(
					"MockOpportunityOriginationForTestingOO"
				);
				opportunityOrigination = await OpportunityOrigination.deploy(
					dygnifyConfig.address,
					opportunityPool.address,
					dygnifyKeeper.address
				);
				await opportunityOrigination.deployed();

				// set addresses
				await dygnifyConfig.setAddress(6, opportunityOrigination.address);
				await dygnifyKeeper.initialize(dygnifyConfig.address);
			});
			it("should markdown opportunity successfully", async function () {
				const [borrower, underwriter] = await ethers.getSigners();

				// create opportunity and make it active
				await opportunityOrigination.createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					},
					5
				);

				const tx = await opportunityPool.toCheckMarkDrawDown(
					ID,
					opportunityOrigination.address
				);

				await tx.wait(1);

				const opportunity = await opportunityOrigination.opportunityToId(ID);

				assert.equal(opportunity.opportunityStatus, 6);
			});

			it("should markdown opportunity successfully", async function () {
				const [borrower, underwriter] = await ethers.getSigners();

				// create opportunity and make it active
				await opportunityOrigination.createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "kjk",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 120,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					},
					5
				);

				const tx = await opportunityPool.toCheckMarkDrawDown(
					ID,
					opportunityOrigination.address
				);

				await tx.wait(1);

				const opportunity = await opportunityOrigination.opportunityToId(ID);

				assert.equal(opportunity.opportunityStatus, 6);
			});
		});

		describe("Negative cases", function () {
			it("revertes when opportunity is not created", async function () {
				await expect(
					opportunityOrigination.markDrawDown(ID)
				).to.be.revertedWith("Opportunity ID doesn't exist");
			});

			it("reverts when opportunity is not called by opprotunity pool", async function () {
				const [borrower] = await ethers.getSigners();
				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});
				await expect(
					opportunityOrigination.markDrawDown(ID)
				).to.be.revertedWith("Opportunity pool is not active");
			});

			it("reverts when opportunity is active but markDrawDown function not called by opportunity pool", async function () {
				const [borrower, underwriter] = await ethers.getSigners();

				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				const id = ethers.utils.id("aadhar");
				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					id,
					underwriter.address
				);

				// call voteOpportunity function
				opportunityOrigination = opportunityOrigination.connect(underwriter);
				await opportunityOrigination.voteOpportunity(id, 2);

				await expect(
					opportunityOrigination.markDrawDown(id)
				).to.be.revertedWith("Only Opportunity Pool can mark it as drawdown");
			});
		});

		describe("Border cases", function () {
			it("going to overflow for id", async function () {
				const id = ID + "3";
				await expect(opportunityOrigination.markDrawDown(id)).to.be.reverted;
			});
		});
	});

	describe("markRepaid", function () {
		describe("Positive cases", function () {
			let opportunityPool, opportunityOrigination, admin;
			beforeEach(async function () {
				const accounts = await ethers.getSigners();
				// deploy MockOpportunityPoolV1.sol
				const OpportunityPool = await ethers.getContractFactory(
					"MockOpportunityPoolV1"
				);
				opportunityPool = await OpportunityPool.deploy();
				await opportunityPool.deployed();

				// deployMockOpportunityOriginationForTestingOO.sol
				const OpportunityOrigination = await ethers.getContractFactory(
					"MockOpportunityOriginationForTestingOO"
				);
				opportunityOrigination = await OpportunityOrigination.deploy(
					dygnifyConfig.address,
					opportunityPool.address,
					dygnifyKeeper.address
				);
				await opportunityOrigination.deployed();

				// set addresses
				await dygnifyConfig.setAddress(6, opportunityOrigination.address);
				await dygnifyKeeper.initialize(dygnifyConfig.address);
			});
			it("should markRepaid opportunity successfully", async function () {
				const [borrower] = await ethers.getSigners();

				// create opportunity and make it active
				await opportunityOrigination.createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					},
					6
				);

				const tx = await opportunityPool.toCheckMarkRepaid(
					ID,
					opportunityOrigination.address
				);

				await tx.wait(1);

				const opportunity = await opportunityOrigination.opportunityToId(ID);

				assert.equal(opportunity.opportunityStatus, 8);
			});

			it("should markRepaid opportunity successfully", async function () {
				const [borrower] = await ethers.getSigners();

				// create opportunity and make it active
				await opportunityOrigination.createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "kjk",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 120,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					},
					6
				);

				const tx = await opportunityPool.toCheckMarkRepaid(
					ID,
					opportunityOrigination.address
				);

				await tx.wait(1);

				const opportunity = await opportunityOrigination.opportunityToId(ID);

				assert.equal(opportunity.opportunityStatus, 8);
			});
		});

		describe("Negative cases", function () {
			it("revertes when opportunity is not created", async function () {
				await expect(opportunityOrigination.markRepaid(ID)).to.be.revertedWith(
					"Opportunity ID doesn't exist"
				);
			});

			it("reverts when markReapid function is not called by opprotunity pool", async function () {
				const [borrower] = await ethers.getSigners();
				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				await expect(opportunityOrigination.markRepaid(ID)).to.be.revertedWith(
					"Opportunity pool is haven't drawdown yet."
				);
			});
		});

		describe("Border cases", function () {
			it("going to overflow for id", async function () {
				const id = ID + "3";
				await expect(opportunityOrigination.markRepaid(id)).to.be.reverted;
			});
		});
	});

	describe("markWriteOff", function () {
		describe("Positive cases", function () {
			let opportunityPool, opportunityOrigination;
			beforeEach(async function () {
				// deploy MockOpportunityPoolV1.sol
				const OpportunityPool = await ethers.getContractFactory(
					"MockOpportunityPoolV1"
				);
				opportunityPool = await OpportunityPool.deploy();
				await opportunityPool.deployed();
				// deployMockOpportunityOriginationForTestingOO.sol
				const OpportunityOrigination = await ethers.getContractFactory(
					"MockOpportunityOriginationForTestingOO"
				);
				opportunityOrigination = await OpportunityOrigination.deploy(
					dygnifyConfig.address,
					opportunityPool.address,
					opportunityPool.address
				);
				await opportunityOrigination.deployed();
				// set addresses
				await dygnifyConfig.setAddress(6, opportunityOrigination.address);
				await dygnifyConfig.setAddress(9, opportunityPool.address);
				await dygnifyKeeper.initialize(dygnifyConfig.address);
			});
			it("should markWriteOff opportunity successfully", async function () {
				const [borrower, underwriter] = await ethers.getSigners();
				// create opportunity and make it active
				await opportunityOrigination.createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for term loan",
						loanType: 1,
						loanAmount: 2500000000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					},
					6
				);
				const tx = await opportunityPool.toCheckmarkWriteOff(
					ID,
					opportunityPool.address,
					opportunityOrigination.address
				);
				await tx.wait(1);
				const opportunity = await opportunityOrigination.opportunityToId(ID);
				assert.equal(opportunity.opportunityStatus, 7);
			});
			it("should markWriteOff opportunity successfully", async function () {
				const [borrower, underwriter] = await ethers.getSigners();
				// create opportunity and make it active
				await opportunityOrigination.createOpportunity(
					{
						borrower: borrower.address,
						opportunityName: "xyz",
						opportunityInfo: "for bullet loan",
						loanType: 0,
						loanAmount: 250000000000,
						loanTenureInDays: 512,
						loanInterest: 10000000,
						paymentFrequencyInDays: 30,
						collateralDocument: "aadhar",
						capitalLoss: 10000000,
					},
					6
				);
				const tx = await opportunityPool.toCheckmarkWriteOff(
					ID,
					opportunityPool.address,
					opportunityOrigination.address
				);
				await tx.wait(1);
				const opportunity = await opportunityOrigination.opportunityToId(ID);
				assert.equal(opportunity.opportunityStatus, 7);
			});
		});

		describe("Negative cases", function () {
			it("revertes when opportunity is not created", async function () {
				await expect(
					opportunityOrigination.markWriteOff(ID, opportunityPool.address)
				).to.be.revertedWith("Opportunity ID doesn't exist");
			});
			it("reverts when markWrteOff function is not called by opprotunity pool", async function () {
				const [borrower] = await ethers.getSigners();
				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});
				await expect(
					opportunityOrigination.markWriteOff(ID, opportunityPool.address)
				).to.be.revertedWith("Opportunity pool is haven't drawdown yet.");
			});
		});
		describe("Border cases", function () {
			it("going to overflow for id", async function () {
				const id = ID + "3";
				await expect(
					opportunityOrigination.markWriteOff(id, opportunityPool.address)
				).to.be.reverted;
			});
		});
	});
});
