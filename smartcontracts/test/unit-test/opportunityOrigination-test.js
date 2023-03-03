const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const OVERFLOW =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";
const ZEROADDRESS = ethers.constants.AddressZero;
const USDCAMOUNT = "9999999999000000";
const ID = ethers.utils.id("aadhar");
const AMOUNT = "100000000000";
let accounts;

describe("OpportunityOrigination", function () {
	let opportunityOrigination,
		dygnifyConfig,
		configHelper,
		collateralToken,
		opportunityPool,
		dygnifyKeeper,
		uSDCTestToken,
		seniorPool,
		lpToken,
		investor;

	beforeEach(async () => {
		accounts = await ethers.getSigners();
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

		// deploy USDCTestToken.sol

		const USDCTestToken = await ethers.getContractFactory("TestUSDCToken");
		uSDCTestToken = await USDCTestToken.deploy(USDCAMOUNT);
		await uSDCTestToken.deployed();

		// Senior pool deployment
		const SeniorPool = await hre.ethers.getContractFactory("SeniorPool");
		seniorPool = await SeniorPool.deploy();

		await seniorPool.deployed();

		// deploy LPToken.sol
		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();

		// Deploy Investor
		const Investor = await ethers.getContractFactory("Investor");
		investor = await Investor.deploy();
		await investor.deployed();

		// initialize dygnifyConfig and pass it to opportunityOrigination
		await dygnifyConfig.initialize();

		await dygnifyConfig.setAddress(1, lpToken.address);
		await dygnifyConfig.setAddress(2, uSDCTestToken.address);
		await dygnifyConfig.setAddress(3, seniorPool.address);
		await dygnifyConfig.setAddress(4, opportunityPool.address);
		await dygnifyConfig.setAddress(5, collateralToken.address);
		await dygnifyConfig.setAddress(7, investor.address);
		await dygnifyConfig.setAddress(6, opportunityOrigination.address);
		await dygnifyConfig.setAddress(9, dygnifyKeeper.address);

		await opportunityOrigination.initialize(dygnifyConfig.address);
		await seniorPool.initialize(dygnifyConfig.address);
		await lpToken.initialize(seniorPool.address);

		// Set all numbers
		// leverage ratio
		await dygnifyConfig.setNumber(0, 4);
		// Dygnify Fee
		await dygnifyConfig.setNumber(1, 100000);
		// OverDueFee
		await dygnifyConfig.setNumber(2, 5000000);
		// JuniorSubpoolFee
		await dygnifyConfig.setNumber(3, 200000);
		// second value should be the number of months for senior pool funds lockin for investor
		await dygnifyConfig.setNumber(4, 0);
		// WriteOffDays
		await dygnifyConfig.setNumber(5, 90);
		//AdjustmentOffset
		await dygnifyConfig.setNumber(6, 20);
		await dygnifyKeeper.initialize(dygnifyConfig.address);
		// initialize collateralToken
		await collateralToken.initialize(
			dygnifyConfig.address,
			opportunityOrigination.address
		);
		// Initialize the investor contract
		await investor.initialize(dygnifyConfig.address);
	});

	describe("createOpportunity", function () {
		//	positive cases
		describe("Positive cases", function () {
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
						borrower: borrowerAddress,
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
					const isOpportunityOfBorrower =
						await opportunityOrigination.isOpportunity(id);

					assert(isOpportunityOfBorrower);
					// length of opportunityIds should be increased by 1
					const opportunityIds =
						await opportunityOrigination.getTotalOpportunities();
					assert.equal(opportunityIds.toString(), "1");
				};

			it("1. should createOpportunity successfully", async function () {
				await createOpportunity({
					borrowerAddress: accounts[1].address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: 2500000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
					expected: [accounts[1].address],
				})();
			});

			it("2. should createOpportunity successfully", async function () {
				await createOpportunity({
					borrowerAddress: accounts[1].address,
					opportunityName: "abc",
					opportunityInfo: "for bullet loan",
					loanType: 0,
					loanAmount: 5000000000000,
					loanTenureInDays: 512,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
					expected: [accounts[1].address],
				})();
			});
			it("3. should createOpportunity successfully", async function () {
				await createOpportunity({
					borrowerAddress: accounts[1].address,
					opportunityName: "xyz",
					opportunityInfo: "for Bullet loan",
					loanType: 1,
					loanAmount: 2500340000000,
					loanTenureInDays: 512,
					loanInterest: 9000000,
					paymentFrequencyInDays: 90,
					collateralDocument: "pan",
					capitalLoss: 430000000,
					expected: [accounts[1].address],
				})();
			});

			it("4. should createOpportunity successfully", async function () {
				await createOpportunity({
					borrowerAddress: accounts[1].address,
					opportunityName: "xyz",
					opportunityInfo: "for Bullet loan",
					loanType: 1,
					loanAmount: 250007870000000,
					loanTenureInDays: 512,
					loanInterest: 9000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "pan",
					capitalLoss: 10000000,
					expected: [accounts[1].address],
				})();
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
					"000000000000078978798798798798798798kjkjkjkjkkjkjkljlkjlkjjklkjlkjjkjkjkj955555787090000070777";
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
		async function fun(borrower, underwriter, amount) {
			// create opportunity
			await opportunityOrigination.createOpportunity({
				borrower: borrower.address,
				opportunityName: "xyz",
				opportunityInfo: "for term loan",
				loanType: 1,
				loanAmount: amount,
				loanTenureInDays: 512,
				loanInterest: 10000000,
				paymentFrequencyInDays: 30,
				collateralDocument: "aadhar",
				capitalLoss: 10000000,
			});

			// call assignUnderwriters function
			await opportunityOrigination.assignUnderwriters(ID, underwriter.address);

			await opportunityOrigination.connect(underwriter).voteOpportunity(ID, 2);

			let opportunity = await opportunityOrigination.opportunityToId(ID);

			const poolAddress = opportunity.opportunityPoolAddress;

			opportunityPool = await ethers.getContractAt(
				"OpportunityPool",
				poolAddress
			);

			await uSDCTestToken.transfer(borrower.address, amount);
			await uSDCTestToken.connect(borrower).approve(seniorPool.address, amount);
			await seniorPool.connect(borrower).stake(amount);

			// Unlock juniorPool and seniorPool
			await opportunityPool.unLockPool(1);

			await seniorPool.approveUSDC(opportunityPool.address);
			await seniorPool.invest(ID);

			// deposit 20% of AMOUNT into junior Pool
			const amountToJunior = amount * 0.2;
			//	await uSDCTestToken.transfer(underwriter.address, 2 * amountToJunior);
			await uSDCTestToken.approve(opportunityPool.address, amountToJunior);
			await opportunityPool.deposit(0, amountToJunior);

			await opportunityPool.connect(borrower).drawdown();

			opportunity = await opportunityOrigination.opportunityToId(ID);

			assert(opportunity.opportunityStatus, 6);
		}

		describe("Positive cases", function () {
			it("should markdown opportunity successfully", async function () {
				const accounts = await ethers.getSigners();
				fun(accounts[1], accounts[2], AMOUNT);
			});

			it("should markdown opportunity successfully", async function () {
				const accounts = await ethers.getSigners();
				fun(accounts[7], accounts[3], 2 * AMOUNT);
			});

			it("should markdown opportunity successfully", async function () {
				const accounts = await ethers.getSigners();
				fun(accounts[2], accounts[10], 55 * AMOUNT);
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
		async function fun(borrower, underwriter, amount) {
			async function fun(borrower, underwriter, amount) {
				// create opportunity
				await opportunityOrigination.createOpportunity({
					borrower: borrower.address,
					opportunityName: "xyz",
					opportunityInfo: "for term loan",
					loanType: 1,
					loanAmount: amount,
					loanTenureInDays: 360,
					loanInterest: 10000000,
					paymentFrequencyInDays: 30,
					collateralDocument: "aadhar",
					capitalLoss: 10000000,
				});

				// call assignUnderwriters function
				await opportunityOrigination.assignUnderwriters(
					ID,
					underwriter.address
				);

				await opportunityOrigination
					.connect(underwriter)
					.voteOpportunity(ID, 2);

				let opportunity = await opportunityOrigination.opportunityToId(ID);

				const poolAddress = opportunity.opportunityPoolAddress;

				opportunityPool = await ethers.getContractAt(
					"OpportunityPool",
					poolAddress
				);

				const seniorAmount = (amount * 0.8).toString();
				// deposit 20% of AMOUNT into junior Pool
				const amountToJunior = (amount - seniorAmount).toString();
				//	await usdcToken.transfer(underwriter.address, 2 * amountToJunior);
				await uSDCTestToken
					.connect(underwriter)
					.approve(opportunityPool.address, amountToJunior);

				await uSDCTestToken.transfer(underwriter.address, 2 * amountToJunior);
				await uSDCTestToken.transfer(borrower.address, 2 * seniorAmount);

				await uSDCTestToken
					.connect(borrower)
					.approve(seniorPool.address, seniorAmount);
				await opportunityPool.connect(underwriter).deposit(0, amountToJunior);
				// 80 %
				await uSDCTestToken.approve(seniorPool.address, seniorAmount);
				await seniorPool.connect(borrower).stake(seniorAmount);
				await opportunityPool.unLockPool(1);
				await seniorPool.approveUSDC(opportunityPool.address);
				await seniorPool.invest(ID);

				// Drawdown
				let beforeBalance = await uSDCTestToken.balanceOf(borrower.address);
				await opportunityPool.connect(borrower).drawdown();
				let afterBalance = await uSDCTestToken.balanceOf(borrower.address);
				// Opportunity status should marked as drawdown
				opportunity = await opportunityOrigination.opportunityToId(ID);
				expect(opportunity.opportunityStatus).to.equal(6);
				// Borrower should receive usdc
				expect(afterBalance.sub(beforeBalance)).to.equal(amount);

				//
				// Approve test usdc
				await uSDCTestToken
					.connect(borrower)
					.approve(opportunityPool.address, 100 * amount);
				const repaymentCount = await opportunityPool.totalRepayments();
				// Repayment
				for (let i = 0; i < repaymentCount; i++) {
					await opportunityPool.connect(borrower).repayment();
				}
				// Opportunity status should marked as repaid
				opportunity = await opportunityOrigination.opportunityToId(ID);
				expect(opportunity.opportunityStatus).to.equal(8);
			}
		}

		describe("Positive cases", function () {
			it("should markRepaid opportunity successfully", async function () {
				await fun(accounts[3], accounts[2], AMOUNT);
			});

			it("should markRepaid opportunity successfully", async function () {
				await fun(accounts[7], accounts[2], 88 * AMOUNT);
			});

			it("should markRepaid opportunity successfully", async function () {
				await fun(accounts[4], accounts[9], 3 * AMOUNT);
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
		async function fun(borrower, underwriter, amount) {
			// create opportunity
			await opportunityOrigination.createOpportunity({
				borrower: borrower.address,
				opportunityName: "xyz",
				opportunityInfo: "for term loan",
				loanType: 1,
				loanAmount: amount,
				loanTenureInDays: 360,
				loanInterest: 10000000,
				paymentFrequencyInDays: 30,
				collateralDocument: "aadhar",
				capitalLoss: 10000000,
			});

			// call assignUnderwriters function
			await opportunityOrigination.assignUnderwriters(ID, underwriter.address);

			await opportunityOrigination.connect(underwriter).voteOpportunity(ID, 2);

			let opportunity = await opportunityOrigination.opportunityToId(ID);

			const poolAddress = opportunity.opportunityPoolAddress;

			opportunityPool = await ethers.getContractAt(
				"OpportunityPool",
				poolAddress
			);

			const seniorAmount = (amount * 0.8).toString();
			// deposit 20% of AMOUNT into junior Pool
			const amountToJunior = (amount - seniorAmount).toString();
			//	await usdcToken.transfer(underwriter.address, 2 * amountToJunior);
			await uSDCTestToken
				.connect(underwriter)
				.approve(opportunityPool.address, amountToJunior);

			await uSDCTestToken.transfer(underwriter.address, 2 * amountToJunior);
			await uSDCTestToken.transfer(borrower.address, 2 * seniorAmount);

			await uSDCTestToken
				.connect(borrower)
				.approve(seniorPool.address, seniorAmount);
			await opportunityPool.connect(underwriter).deposit(0, amountToJunior);
			// 80 %
			await uSDCTestToken.approve(seniorPool.address, seniorAmount);
			await seniorPool.connect(borrower).stake(seniorAmount);
			await opportunityPool.unLockPool(1);
			await seniorPool.approveUSDC(opportunityPool.address);
			await seniorPool.invest(ID);

			// Drawdown
			let beforeBalance = await uSDCTestToken.balanceOf(borrower.address);
			await opportunityPool.connect(borrower).drawdown();
			let afterBalance = await uSDCTestToken.balanceOf(borrower.address);
			// Opportunity status should marked as drawdown
			opportunity = await opportunityOrigination.opportunityToId(ID);
			expect(opportunity.opportunityStatus).to.equal(6);
			// Borrower should receive usdc
			expect(afterBalance.sub(beforeBalance)).to.equal(amount);
		}
		describe("Positive cases", function () {
			it("should markWriteOff opportunity successfully", async function () {
				const accounts = await ethers.getSigners();
				await fun(accounts[1], accounts[3], AMOUNT);
			});

			it("should markWriteOff opportunity successfully", async function () {
				const accounts = await ethers.getSigners();
				await fun(accounts[1], accounts[5], 2 * AMOUNT);
			});

			it("should markWriteOff opportunity successfully", async function () {
				const accounts = await ethers.getSigners();
				await fun(accounts[5], accounts[3], 8 * AMOUNT);
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
