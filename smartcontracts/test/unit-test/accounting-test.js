const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const offset = 5;
const overflow =
	"115792089237316195423570985008687907853269984665640564039457584007913129639937";

describe("Accounting", function () {
	let accouting;
	beforeEach(async () => {
		const AccountingLibrary = await ethers.getContractFactory(
			"AccoutingLibrary"
		);
		accouting = await AccountingLibrary.deploy();
		await accouting.deployed();
	});

	describe("getTermLoanEMI", function () {
		const getTermLoanEMI = ({
			loanAmount,
			loanInterest,
			emiCount,
			paymentFrequency,
			expected,
		}) =>
			async function () {
				const res = await accouting.getTermLoanEMI(
					loanAmount,
					loanInterest,
					emiCount,
					paymentFrequency
				);
				assert.isBelow(Math.abs(expected - res.toString()), offset);
			};
		describe("Positive cases", function () {
			it(
				"1. It should return correct emi amount",
				getTermLoanEMI({
					loanAmount: 105544e6,
					loanInterest: 10.8e6,
					emiCount: "6",
					paymentFrequency: "30",
					expected: "18148909667",
				})
			);

			it(
				"2. It should return correct emi amount",
				getTermLoanEMI({
					loanAmount: 1000452e6,
					loanInterest: 9.2e6,
					emiCount: "12",
					paymentFrequency: "60",
					expected: "91911991265",
				})
			);

			it(
				"3. It should return correct emi amount",
				getTermLoanEMI({
					loanAmount: 1504877e6,
					loanInterest: 8.5e6,
					emiCount: "24",
					paymentFrequency: "90",
					expected: "80695592280",
				})
			);

			it(
				"4. It should return correct emi amount",
				getTermLoanEMI({
					loanAmount: 2048744e6,
					loanInterest: 7.5e6,
					emiCount: "18",
					paymentFrequency: "180",
					expected: "158565858425",
				})
			);
		});

		describe("Negative cases", function () {
			it("It should revert with Empty parameters", async function () {
				await expect(accouting.getTermLoanEMI("", "", "", "")).to.be.reverted;
			});

			it("It should revert with Invalid parameters giving loan amount 0", async function () {
				await expect(
					accouting.getTermLoanEMI(0, 10e6, 12, 30)
				).to.be.revertedWith("Invalid parameters");
			});

			it("It should revert with Invalid parameters giving loanInterest 0", async function () {
				await expect(
					accouting.getTermLoanEMI(2500000e6, 0, 12, 30)
				).to.be.revertedWith("Invalid parameters");
			});

			it("It should revert with Invalid parameters giving emiCount 0", async function () {
				await expect(
					accouting.getTermLoanEMI(2500000e6, 10e6, 0, 30)
				).to.be.revertedWith("Invalid parameters");
			});

			it("It should revert with Invalid parameters giving paymentFrequency 0", async function () {
				await expect(
					accouting.getTermLoanEMI(2500000e6, 10e6, 12, 0)
				).to.be.revertedWith("Invalid parameters");
			});
		});

		describe("Border cases", function () {
			// Overflow
			it("It is going to overflow for loan amount", async function () {
				await expect(accouting.getTermLoanEMI(overflow, 10e6, 12, 30)).to.be
					.reverted;
			});

			it("It is going to overflow for loan interest", async function () {
				await expect(accouting.getTermLoanEMI(2500000e6, overflow, 12, 30)).to
					.be.reverted;
			});

			it("It is going to overflow for emi count", async function () {
				await expect(accouting.getTermLoanEMI(2500000e6, 10e6, overflow, 30)).to
					.be.reverted;
			});

			it("It is going to overflow for payment frequency", async function () {
				await expect(accouting.getTermLoanEMI(2500000e6, 10e6, 12, overflow)).to
					.be.reverted;
			});
			// Underflow
			it("It is going to underflow for loan Amount", async function () {
				await expect(accouting.getTermLoanEMI(-2500000e6, 10e6, 12, 30)).to.be
					.reverted;
			});

			it("It is going to underflow for loan Interest", async function () {
				await expect(accouting.getTermLoanEMI(2500000e6, -10e6, 12, 30)).to.be
					.reverted;
			});

			it("It is going to underflow for emiCount", async function () {
				await expect(accouting.getTermLoanEMI(2500000e6, 10e6, -12, 30)).to.be
					.reverted;
			});

			it("It is going to underflow for paymentFrequency", async function () {
				await expect(accouting.getTermLoanEMI(2500000e6, 10e6, 12, -30)).to.be
					.reverted;
			});

			// Fractional loan amount
			it(
				"For fractional loan amount no. 1",
				getTermLoanEMI({
					loanAmount: 105544123456,
					loanInterest: 10.8e6,
					emiCount: "6",
					paymentFrequency: "30",
					expected: 18148930896,
				})
			);

			it(
				"For fractional loan amount no. 2",
				getTermLoanEMI({
					loanAmount: 1000452654321,
					loanInterest: 9.2e6,
					emiCount: "12",
					paymentFrequency: "60",
					expected: 91912051378,
				})
			);

			it(
				"For fractional loan amount no. 3",
				getTermLoanEMI({
					loanAmount: 1504877135790,
					loanInterest: 8.5e6,
					emiCount: "24",
					paymentFrequency: "90",
					expected: 80695599561,
				})
			);

			it(
				"For fractional loan amount no. 4",
				getTermLoanEMI({
					loanAmount: 2048744978645,
					loanInterest: 7.5e6,
					emiCount: "18",
					paymentFrequency: "180",
					expected: 158565934169,
				})
			);
		});
	});

	describe("getBulletLoanEMI", function () {
		const getBulletLoanEMI = ({
			loanAmount,
			loanInterest,
			paymentFrequencyInDays,
			expected,
		}) =>
			async function () {
				const res = await accouting.getBulletLoanEMI(
					loanAmount,
					loanInterest,
					paymentFrequencyInDays
				);
				assert.isBelow(Math.abs(expected - res.toString()), offset);
			};
		describe("Positive cases", function () {
			it(
				"1. It should return correct emi amount",
				getBulletLoanEMI({
					loanAmount: 105544e6,
					loanInterest: 10.8e6,
					paymentFrequencyInDays: "30",
					expected: "949896000",
				})
			);

			it(
				"2. It should return correct emi amount",
				getBulletLoanEMI({
					loanAmount: 1000452e6,
					loanInterest: 9.2e6,
					paymentFrequencyInDays: "60",
					expected: "15340264000",
				})
			);

			it(
				"3. It should return correct emi amount",
				getBulletLoanEMI({
					loanAmount: 1504877e6,
					loanInterest: 8.5e6,
					paymentFrequencyInDays: "90",
					expected: "31978636250",
				})
			);

			it(
				"4. It should return correct emi amount",
				getBulletLoanEMI({
					loanAmount: 2048744e6,
					loanInterest: 7.5e6,
					paymentFrequencyInDays: "180",
					expected: "76827900000",
				})
			);
		});

		describe("Negative cases", function () {
			it("It should revert with Invalid parameters giving loan amount 0", async function () {
				await expect(
					accouting.getBulletLoanEMI(0, 10e6, 30)
				).to.be.revertedWith("Invalid parameters");
			});

			it("It should revert with Invalid parameters giving loanInterest 0", async function () {
				await expect(
					accouting.getBulletLoanEMI(2500000e6, 0, 30)
				).to.be.revertedWith("Invalid parameters");
			});

			it("It should revert with Invalid parameters giving paymentFrequencyInDays 0", async function () {
				await expect(
					accouting.getBulletLoanEMI(2500000e6, 10e6, 0)
				).to.be.revertedWith("Invalid parameters");
			});
		});

		describe("Border cases", function () {
			// Overflow
			it("It is going to overflow for loan amount", async function () {
				await expect(accouting.getBulletLoanEMI(overflow, 10e6, 30)).to.be
					.reverted;
			});

			it("It is going to overflow for loan interest", async function () {
				await expect(accouting.getBulletLoanEMI(2500000e6, overflow, 30)).to.be
					.reverted;
			});

			it("It is going to overflow for emi count", async function () {
				await expect(accouting.getBulletLoanEMI(2500000e6, 10e6, overflow)).to
					.be.reverted;
			});

			// Underflow
			it("It is going to underflow for loan Amount", async function () {
				await expect(accouting.getBulletLoanEMI(-2500000e6, 10e6, 30)).to.be
					.reverted;
			});

			it("It is going to underflow for loan Interest", async function () {
				await expect(accouting.getBulletLoanEMI(2500000e6, -10e6, 30)).to.be
					.reverted;
			});

			it("It is going to underflow for paymentFrequency", async function () {
				await expect(accouting.getBulletLoanEMI(2500000e6, 10e6, -30)).to.be
					.reverted;
			});

			// Fractional loan amount
			it(
				"For fractional loan amount no. 1",
				getBulletLoanEMI({
					loanAmount: 105544123456,
					loanInterest: 10.8e6,
					paymentFrequencyInDays: "30",
					expected: 949897111,
				})
			);

			it(
				"For fractional loan amount no. 2",
				getBulletLoanEMI({
					loanAmount: 1000452654321,
					loanInterest: 9.2e6,
					paymentFrequencyInDays: "60",
					expected: 15340274032,
				})
			);

			it(
				"For fractional loan amount no. 3",
				getBulletLoanEMI({
					loanAmount: 1504877135790,
					loanInterest: 8.5e6,
					paymentFrequencyInDays: "90",
					expected: 31978639135,
				})
			);

			it(
				"For fractional loan amount no. 4",
				getBulletLoanEMI({
					loanAmount: 2048744978645,
					loanInterest: 7.5e6,
					paymentFrequencyInDays: "180",
					expected: 76827936699,
				})
			);
		});
	});

	describe("getTermLoanInterest", function () {
		const getTermLoanInterest = ({
			oustandingPrincipal,
			noOfDays,
			loanInterest,
			expected,
		}) =>
			async function () {
				const res = await accouting.getTermLoanInterest(
					oustandingPrincipal,
					noOfDays,
					loanInterest
				);
				assert.isBelow(Math.abs(expected - res.toString()), offset);
			};
		describe("Positive cases", function () {
			it(
				"1. It should return correct emi amount",
				getTermLoanInterest({
					oustandingPrincipal: 105544e6,
					noOfDays: "30",
					loanInterest: 10.8e6,
					expected: "949896000",
				})
			);

			it(
				"2. It should return correct emi amount",
				getTermLoanInterest({
					oustandingPrincipal: 1000452e6,
					noOfDays: "60",
					loanInterest: 9.2e6,
					expected: "15340264000",
				})
			);

			it(
				"3. It should return correct emi amount",
				getTermLoanInterest({
					oustandingPrincipal: 1504877e6,
					noOfDays: "90",
					loanInterest: 8.5e6,
					expected: "31978636250",
				})
			);

			it(
				"4. It should return correct emi amount",
				getTermLoanInterest({
					oustandingPrincipal: 2048744e6,
					noOfDays: "180",
					loanInterest: 7.5e6,
					expected: "76827900000",
				})
			);
		});

		describe("Negative cases", function () {
			it("It should revert with Invalid parameters giving loan amount 0", async function () {
				await expect(
					accouting.getTermLoanInterest(0, 30, 10e6)
				).to.be.revertedWith("Invalid parameters");
			});

			it("It should revert with Invalid parameters giving loanInterest 0", async function () {
				await expect(
					accouting.getTermLoanInterest(2500000e6, 0, 10e6)
				).to.be.revertedWith("Invalid parameters");
			});

			it("It should revert with Invalid parameters giving paymentFrequencyInDays 0", async function () {
				await expect(
					accouting.getTermLoanInterest(2500000e6, 30, 0)
				).to.be.revertedWith("Invalid parameters");
			});
		});

		describe("Border cases", function () {
			// Overflow
			it("It is going to overflow for loan amount", async function () {
				await expect(accouting.getTermLoanInterest(overflow, 30, 10e6)).to.be
					.reverted;
			});

			it("It is going to overflow for loan interest", async function () {
				await expect(accouting.getTermLoanInterest(2500000e6, overflow, 10e6))
					.to.be.reverted;
			});

			it("It is going to overflow for emi count", async function () {
				await expect(accouting.getTermLoanInterest(2500000e6, 30, overflow)).to
					.be.reverted;
			});

			// Underflow
			it("It is going to underflow for loan Amount", async function () {
				await expect(accouting.getTermLoanInterest(-2500000e6, 30, 10e6)).to.be
					.reverted;
			});

			it("It is going to underflow for loan Interest", async function () {
				await expect(accouting.getTermLoanInterest(2500000e6, -30, 10e6)).to.be
					.reverted;
			});

			it("It is going to underflow for paymentFrequency", async function () {
				await expect(accouting.getTermLoanInterest(2500000e6, 30, -10e6)).to.be
					.reverted;
			});

			// Fractional loan amount
			it(
				"For fractional loan amount no. 1",
				getTermLoanInterest({
					oustandingPrincipal: 105544123456,
					noOfDays: "30",
					loanInterest: 10.8e6,
					expected: 949897111,
				})
			);

			it(
				"For fractional loan amount no. 2",
				getTermLoanInterest({
					oustandingPrincipal: 1000452654321,
					noOfDays: "60",
					loanInterest: 9.2e6,
					expected: 15340274032,
				})
			);

			it(
				"For fractional loan amount no. 3",
				getTermLoanInterest({
					oustandingPrincipal: 1504877135790,
					noOfDays: "90",
					loanInterest: 8.5e6,
					expected: 31978639135,
				})
			);

			it(
				"For fractional loan amount no. 4",
				getTermLoanInterest({
					oustandingPrincipal: 2048744978645,
					noOfDays: "180",
					loanInterest: 7.5e6,
					expected: 76827936699,
				})
			);
		});
	});

	// for getYieldPercentage
	describe("getYieldPercentage", function () {
		const getYieldPercentage = (
			dygnifyFees,
			underwriterFees,
			isTermLoan,
			emiAmount,
			loanAmount,
			totalRepayments,
			loanInterest,
			leverageRatio,
			loanTenureInDays,
			expected
		) =>
			async function () {
				const res = await accouting.getYieldPercentage(
					dygnifyFees,
					underwriterFees,
					isTermLoan,
					emiAmount,
					loanAmount,
					totalRepayments,
					loanInterest,
					leverageRatio,
					loanTenureInDays
				);

				// expected and result difference must be less than 5

				assert.isBelow(Math.abs(expected[0] - res[0].toString()), offset);

				assert.isBelow(Math.abs(expected[1] - res[1].toString()), offset);
			};

		describe("Positive cases", function () {
			describe("Term loan", function () {
				it(
					"1. It should return expected seniorYieldPerecentage & juniorYieldPerecentage",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						true, // term loan
						219789718075, // emi amount
						2500000000000, // loan amount
						12, // repayments in 30 days so emit count is 12 for 360
						100000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[38493, 93484]
					)
				);

				it(
					"2. It should return expected seniorYieldPerecentage & juniorYieldPerecentage",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						true, // TERM LOAN
						297988321395, // emi amount
						5000000000000, // loan amount
						18, // repayments in 30 days so emi count is 18 for 540 days
						90000, // 9% loan interest
						4, // sp contribution / jp contribution
						540, // Loan tenure in Days
						[50931, 123689]
					)
				);

				it(
					"3. It should return expected seniorYieldPerecentage & juniorYieldPerecentage",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						true, // TERM LOAN
						91599907285492, // emi amount
						508789560000000, // loan amount
						6, // repayments in 90 days so emi count is 18 for 540 days
						90000, // 9% loan interest
						4, // sp contribution / jp contribution
						540, // Loan tenure in Days
						[56147, 136357]
					)
				);

				it(
					"4. It should return expected seniorYieldPerecentage & juniorYieldPerecentage",
					getYieldPercentage(
						200000, // 20% -> it changes jp
						200000, // 20%
						true, // TERM LOAN
						91599907285492, // emi amount
						508789560000000, // loan amount
						6, // repayments in 90 days so emi count is 18 for 540 days
						90000, // 9% loan interest
						4, // sp contribution / jp contribution
						540, // Loan tenure in Days
						[48126, 128336]
					)
				);
			});

			describe("Bullet loan", function () {
				it(
					"1. It should return expected seniorYieldPerecentage & juniorYieldPerecentage",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						false, // Bullet loan
						20833333333, // emi amount
						2500000000000, // loan amount
						12, // repayments
						10000000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[70000, 170000]
					)
				);
				it(
					"2. It should return expected seniorYieldPerecentage & juniorYieldPerecentage",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						false, // Bullet loan
						297988321395, // emi amount
						5000000000000, // loan amount
						18, // repayments
						9000000, // 9% loan interest
						4, // sp contribution / jp contribution
						540, // Loan tenure in Days
						[94500, 229500]
					)
				);
				it(
					"3. It should return expected seniorYieldPerecentage & juniorYieldPerecentage",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						false, // TERM LOAN
						763184340000000, // emi amount
						508789560000000, // loan amount
						18, // repayments s
						18000000, // 18% loan interest
						4, // sp contribution / jp contribution
						540, // Loan tenure in Days
						[189000, 459000]
					)
				);
				it(
					"4. It should return expected seniorYieldPerecentage & juniorYieldPerecentage",
					getYieldPercentage(
						200000, // 20% -> it changes jp
						200000, // 20%
						false, // TERM LOAN
						763184340000000, // emi amount
						508789560000000, // loan amount
						18, // repayments in 90 days so emi count is 18 for 540 days
						9000000, // 9% loan interest
						4, // sp contribution / jp contribution
						540, // Loan tenure in Days
						[81000, 216000]
					)
				);
			});
		});

		describe("Negative cases", function () {
			describe("Term loan", function () {
				it("It should revert with Invalid parameters giving dygnifyFees 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							true,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving underwriterFees 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							true,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving emiAmount 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							true,
							0,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving loanAmount 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							true,
							763184340000000,
							0,
							18,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving totalRepayments 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							200000,
							true,
							763184340000000,
							508789560000000,
							0,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving loanInterest 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							true,
							763184340000000,
							508789560000000,
							18,
							0,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters leverageRatio 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							true,
							763184340000000,
							508789560000000,
							18,
							9000000,
							0,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving loanTenureInDays 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							200000,
							true,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							0
						)
					).to.be.revertedWith("Invalid parameters");
				});
			});
			describe("Bullet loan", function () {
				it("It should revert with Invalid parameters giving dygnifyFees 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							false,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving underwriterFees 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							false,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving emiAmount 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							false,
							0,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving loanAmount 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							false,
							763184340000000,
							0,
							18,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving totalRepayments 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							200000,
							false,
							763184340000000,
							508789560000000,
							0,
							9000000,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving loanInterest 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							false,
							763184340000000,
							508789560000000,
							18,
							0,
							4,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters leverageRatio 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							false,
							763184340000000,
							508789560000000,
							18,
							9000000,
							0,
							540
						)
					).to.be.revertedWith("Invalid parameters");
				});
				it("It should revert with Invalid parameters giving loanTenureInDays 0", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							200000,
							false,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							0
						)
					).to.be.revertedWith("Invalid parameters");
				});
			});
		});

		describe("Border cases", function () {
			// Overflow

			describe("Term loan", function () {
				it("It is going to overflow for dygnifyFees", async function () {
					await expect(
						accouting.getYieldPercentage(
							overflow,
							200000,
							true,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for underWriterFees", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							overflow,
							true,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for emiAmount", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							true,
							overflow,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for loanAmount", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							true,
							763184340000000,
							overflow,
							18,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for totalRepayments", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							200000,
							true,
							763184340000000,
							508789560000000,
							overflow,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for loanInterest", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							true,
							763184340000000,
							508789560000000,
							18,
							overflow,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for leverageRatio", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							true,
							763184340000000,
							508789560000000,
							18,
							9000000,
							overflow,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for loanTenureInDays", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							200000,
							true,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							overflow
						)
					).to.be.reverted;
				});
			});

			describe("Bullet loan", function () {
				it("It is going to overflow for dygnifyFees", async function () {
					await expect(
						accouting.getYieldPercentage(
							overflow,
							200000,
							false,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for underWriterFees", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							overflow,
							false,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for emiAmount", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							false,
							overflow,
							508789560000000,
							18,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for loanAmount", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							false,
							763184340000000,
							overflow,
							18,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for totalRepayments", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							200000,
							false,
							763184340000000,
							508789560000000,
							overflow,
							9000000,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for loanInterest", async function () {
					await expect(
						accouting.getYieldPercentage(
							0,
							200000,
							false,
							763184340000000,
							508789560000000,
							18,
							overflow,
							4,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for leverageRatio", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							0,
							false,
							763184340000000,
							508789560000000,
							18,
							9000000,
							overflow,
							540
						)
					).to.be.reverted;
				});

				it("It is going to overflow for loanTenureInDays", async function () {
					await expect(
						accouting.getYieldPercentage(
							200000,
							200000,
							false,
							763184340000000,
							508789560000000,
							18,
							9000000,
							4,
							overflow
						)
					).to.be.reverted;
				});
			});

			// Fractional loan amount
			describe("Term loan", function () {
				it(
					"1. It should return expected seniorYieldPerecentage & juniorYieldPerecentage for fractional loan amount",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						true, // term loan
						219789777670, // emi amount
						2500000677867, // loan amount
						12, // repayments in 30 days so emit count is 12 for 360
						100000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[38493, 93484]
					)
				);
				it(
					"2. It should return expected seniorYieldPerecentage & juniorYieldPerecentage for fractional loan amount",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						true, // term loan
						47954120307, // emi amount
						545454545450, // loan amount
						12, // repayments in 30 days so emit count is 12 for 360
						100000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[38493, 93484]
					)
				);
				it(
					"3. It should return expected seniorYieldPerecentage & juniorYieldPerecentage for fractional loan amount",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						true, // term loan
						5967465787, // emi amount
						67876989876, // loan amount
						12, // repayments
						100000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[38493, 93484]
					)
				);
				it(
					"4. It should return expected seniorYieldPerecentage & juniorYieldPerecentage for fractional loan amount",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						true, // term loan
						77083769864, // emi amount
						876789989765, // loan amount
						12, // repayments in 30 days so emit count is 12 for 360
						100000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[38493, 93484]
					)
				);
			});

			describe("Bullet loan", function () {
				it(
					"1. It should return expected seniorYieldPerecentage & juniorYieldPerecentage for fractional loan amount",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						false, // Bullet loan
						219789777670, // emi amount
						2500000677867, // loan amount
						12, // repayments
						10000000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[70000, 170000]
					)
				);
				it(
					"2. It should return expected seniorYieldPerecentage & juniorYieldPerecentage for fractional loan amount",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						false, // Bullet loan
						47954120307, // emi amount
						545454545450, // loan amount
						12, // repayments
						10000000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[70000, 170000]
					)
				);
				it(
					"3. It should return expected seniorYieldPerecentage & juniorYieldPerecentage for fractional loan amount",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						false, // Bullet loan
						5967465787, // emi amount
						67876989876, // loan amount
						12, // repayments
						10000000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[70000, 170000]
					)
				);
				it(
					"4. It should return expected seniorYieldPerecentage & juniorYieldPerecentage for fractional loan amount",
					getYieldPercentage(
						100000, // 10%
						200000, // 20%
						false, // Bullet loan
						77083769864, // emi amount
						876789989765, // loan amount
						12, // repayments
						10000000, // 10% interest loan
						4, // sp contribution / jp contribution
						360, // Loan tenure in Days
						[70000, 170000]
					)
				);
			});
		});
	});

	// for getInterestDistribution
	describe("getInterestDistribution", function () {
		const getInterestDistribution = (
			dygnifyFees,
			underwriterFees,
			interestAmount,
			leverageRatio,
			loanAmount,
			seniorPoolInvestment,
			expected
		) =>
			async function () {
				const res = await accouting.getInterestDistribution(
					dygnifyFees,
					underwriterFees,
					interestAmount,
					leverageRatio,
					loanAmount,
					seniorPoolInvestment
				);

				// expected and result difference must be less than 5

				assert.isBelow(Math.abs(expected[0] - res[0].toString()), offset);

				assert.isBelow(Math.abs(expected[1] - res[1].toString()), offset);
			};

		describe("Positive cases", function () {
			it(
				"1. It should return expected SeniorPoolInterest and JuniorPoolInterest",
				getInterestDistribution(
					100000, // 10% dygnify fee
					200000, // 20% underwriterFees
					137476616895, // interest amount
					4, // leverage ratio
					2500000000000, // loan amount
					2000000000000, // seniorPoolInvestment
					[76986905461, 46742049744]
				)
			);

			it(
				"2. It should return expected SeniorPoolInterest and JuniorPoolInterest",
				getInterestDistribution(
					100000, // 10% dygnify fee
					200000, // 20% underwriterFees
					19006252267, // interest amount
					4, // leverage ratio
					345627000000, // loan amount
					276501600000, // seniorPoolInvestment
					[10643501270, 6462125771]
				)
			);

			it(
				"3. It should return expected SeniorPoolInterest and JuniorPoolInterest",
				getInterestDistribution(
					100000, // 10% dygnify fee
					200000, // 20% underwriterFees
					288944032389, // interest amount
					4, // leverage ratio
					5846972000000, // loan amount
					4677577600000, // seniorPoolInvestment
					[161808658138, 98240971012]
				)
			);

			it(
				"4. It should return expected SeniorPoolInterest and JuniorPoolInterest",
				getInterestDistribution(
					100000, // 10% dygnify fee
					200000, // 20% underwriterFees
					500800375653, // interest amount
					4, // leverage ratio
					5000008000000, // loan amount
					4000006400000, // seniorPoolInvestment
					[280448210366, 170272127722]
				)
			);
		});

		describe("Negative cases", function () {
			it("It should revert with Invalid parameters giving dygnifyFee 0", async function () {
				await expect(
					accouting.getInterestDistribution(
						0,
						200000,
						137476616895,
						4,
						2500000000000,
						2000000000000
					)
				).to.be.revertedWith("Invalid parameters");
			});
			it("It should revert with Invalid parameters giving underwriterFees 0", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						0,
						137476616895,
						4,
						2500000000000,
						200000000000
					)
				).to.be.revertedWith("Invalid parameters");
			});
			it("It should revert with Invalid parameters giving interestAmount 0", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						0,
						4,
						2500000000000,
						2000000000000
					)
				).to.be.revertedWith("Invalid parameters");
			});
			it("It should revert with Invalid parameters giving leverageRatio 0", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						137476616895,
						0,
						2500000000000,
						2000000000000
					)
				).to.be.revertedWith("Invalid parameters");
			});
			it("It should revert with Invalid parameters giving loanAmount 0", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						137476616895,
						4,
						0,
						2000000000000
					)
				).to.be.revertedWith("Invalid parameters");
			});
			it("It should revert with Invalid parameters giving seniorPoolInvestment 0", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						137476616895,
						4,
						2500000000000,
						0
					)
				).to.be.revertedWith("Invalid parameters");
			});
		});

		describe("Border cases", function () {
			// Overflow
			it("It is going to overflow for dygnifyFees", async function () {
				await expect(
					accouting.getInterestDistribution(
						overflow,
						200000,
						137476616895,
						4,
						2500000000000,
						2000000000000
					)
				).to.be.reverted;
			});

			it("It is going to overflow for underwriterFees", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						overflow,
						137476616895,
						4,
						2500000000000,
						2000000000000
					)
				).to.be.reverted;
			});

			it("It is going to overflow for interestAmount", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						overflow,
						4,
						2500000000000,
						2000000000000
					)
				).to.be.reverted;
			});

			it("It is going to overflow for leverageRatio", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						137476616895,
						overflow,
						2500000000000,
						200000000000
					)
				).to.be.reverted;
			});

			it("It is going to overflow for loanAmount", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						137476616895,
						4,
						overflow,
						2000000000000
					)
				).to.be.reverted;
			});

			it("It is going to overflow for seniorPoolInvestment", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						137476616895,
						4,
						2500000000000,
						overflow
					)
				).to.be.reverted;
			});

			// Underflow
			it("It is going to underflow for dygnifyFees", async function () {
				await expect(
					accouting.getInterestDistribution(
						-100000,
						200000,
						137476616895,
						4,
						2500000000000,
						2000000000000
					)
				).to.be.reverted;
			});

			it("It is going to underflow for underwriterFees", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						-200000,
						137476616895,
						4,
						2500000000000,
						2000000000000
					)
				).to.be.reverted;
			});

			it("It is going to underflow for interestAmount", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						-137476616895,
						4,
						2500000000000,
						2000000000000
					)
				).to.be.reverted;
			});

			it("It is going to underflow for leverageRatio", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						137476616895,
						-4,
						2500000000000,
						2000000000000
					)
				).to.be.reverted;
			});

			it("It is going to underflow for loanAmount", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						137476616895,
						4,
						-2500000000000,
						2000000000000
					)
				).to.be.reverted;
			});

			it("It is going to underflow for seniorPoolInvestment", async function () {
				await expect(
					accouting.getInterestDistribution(
						100000,
						200000,
						137476616895,
						4,
						2500000000000,
						-2000000000000
					)
				).to.be.reverted;
			});

			// Fractional loan amount
			it(
				"1. It should return expected SeniorPoolInterest and JuniorPoolInterest for fractional loan amount",
				getInterestDistribution(
					100000, // 10% dygnify fee
					200000, // 20% underwriterFees
					250399874861, // interest amount
					4, // leverage ratio
					2500000875342, // loan amount
					2000000700274, // seniorPoolInvestment
					[140223929922, 85135957453]
				)
			);

			it(
				"2. It should return expected SeniorPoolInterest and JuniorPoolInterest for fractional loan amount",
				getInterestDistribution(
					100000, // 10% dygnify fee
					200000, // 20% underwriterFees
					34618058717, // interest amount
					4, // leverage ratio
					345627876784, // loan amount
					276502301427, // seniorPoolInvestment
					[19386112882, 11770139964]
				)
			);

			it(
				"3. It should return expected SeniorPoolInterest and JuniorPoolInterest for fractional loan amount",
				getInterestDistribution(
					100000, // 10% dygnify fee
					200000, // 20% underwriterFees
					585632305614, // interest amount
					4, // leverage ratio
					5846972876789, // loan amount
					4677578301431, // seniorPoolInvestment
					[327954091144, 199114983909]
				)
			);

			it(
				"4. It should return expected SeniorPoolInterest and JuniorPoolInterest for fractional loan amount",
				getInterestDistribution(
					100000, // 10% dygnify fee
					200000, // 20% underwriterFees
					500800388018, // interest amount
					4, // leverage ratio
					5000008123456, // loan amount
					4000006498765, // seniorPoolInvestment
					[280448217290, 170272131926]
				)
			);
		});
	});
});
