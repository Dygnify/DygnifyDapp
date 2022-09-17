const { ethers } = require("ethers");
const {
	requestAccount,
	convertDate,
} = require("./userConnectors/commonConnectors");
const opportunityOrigination = require("../../artifacts/contracts/protocol/OpportunityOrigination.sol/OpportunityOrigination.json");
const opportunityPool = require("../../artifacts/contracts/protocol/OpportunityPool.sol/OpportunityPool.json");
const {
	getTrimmedWalletAddress,
	getDisplayAmount,
} = require("../Helpers/displayTextHelper");
const {
	getUserWalletAddress,
	getEthAddress,
} = require("./userConnectors/commonConnectors");

const sixDecimals = 6;
const nullAddress = "0x0000000000000000000000000000000000000000";

const Sentry = require("@sentry/react");

const createOpportunity = async (formData) => {
	if (!formData) {
		return false;
	}
	try {
		let borrowerAdd = await getUserWalletAddress();

		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				signer
			);
			const loanAmt = ethers.utils.parseUnits(
				formData.loan_amount,
				sixDecimals
			);
			const loanInterest = ethers.utils.parseUnits(
				formData.loan_interest,
				sixDecimals
			);
			const capitalLoss = formData.capital_loss
				? ethers.utils.parseUnits(formData.capital_loss, sixDecimals)
				: 0;
			const opData = [
				borrowerAdd,
				formData.loan_name,
				formData.loanInfoHash,
				formData.loan_type,
				loanAmt,
				formData.loan_tenure,
				loanInterest,
				formData.payment_frequency,
				formData.collateralHash,
				capitalLoss,
			];
			const transaction1 = await contract.createOpportunity(opData);
			await transaction1.wait();
		}
		return true;
	} catch (error) {
		console.log(error);
	}
	return false;
};

function getOpportunity(opportunity) {
	if (!opportunity) {
		return undefined;
	}

	// Create the opportunity object
	let obj = {};
	obj.id = opportunity.opportunityID.toString();
	obj.borrower = opportunity.borrower.toString();
	obj.opportunityName = opportunity.opportunityName.toString();
	obj.borrowerDisplayAdd = getTrimmedWalletAddress(obj.borrower);
	obj.opportunityInfo = opportunity.opportunityInfo.toString();
	obj.loanType = opportunity.loanType.toString(); // 0 or 1 need to be handled
	let amount = ethers.utils.formatUnits(opportunity.loanAmount, sixDecimals);
	obj.opportunityAmount = getDisplayAmount(amount);
	obj.actualLoanAmount = amount;
	obj.loanTenure = (opportunity.loanTenureInDays / 30).toString() + " Months";
	let loanInt = ethers.utils.formatUnits(opportunity.loanInterest, sixDecimals);
	obj.loanActualInterest = loanInt;
	obj.loanInterest = loanInt.toString() + "%";
	obj.paymentFrequencyInDays =
		opportunity.paymentFrequencyInDays.toString() + " Days";
	obj.collateralDocument = opportunity.collateralDocument.toString();
	obj.capitalLoss = ethers.utils
		.formatUnits(opportunity.capitalLoss, sixDecimals)
		.toString();
	obj.status = opportunity.opportunityStatus.toString();
	obj.opportunityPoolAddress = opportunity.opportunityPoolAddress.toString();

	obj.createdOn = convertDate(opportunity.createdOn);
	obj.epochCreationDate = opportunity.createdOn.toString();

	return obj;
}

// to fetch created opportunities of specific borrower
const getOpportunitysOf = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			// await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			let borrower = await getEthAddress();
			const data = await contract.getOpportunityOf(borrower);
			let opportunities = [];
			for (const op of data) {
				let tx = await contract.opportunityToId(op);
				let obj = getOpportunity(tx);
				if (
					obj.opportunityPoolAddress &&
					obj.opportunityPoolAddress !== nullAddress
				) {
					try {
						const poolContract = new ethers.Contract(
							obj.opportunityPoolAddress,
							opportunityPool.abi,
							provider
						);
						let poolBal = await poolContract.poolBalance();
						obj.poolBalance = ethers.utils.formatUnits(poolBal, sixDecimals);
						obj.poolDisplayBalance = getDisplayAmount(obj.poolBalance);
					} catch (error) {
						console.log(error);
					}
				} else {
					obj.poolBalance = 0;
				}
				opportunities.push(obj);
			}
			return opportunities;
		}
	} catch (error) {
		console.log(error);
	}

	return 0;
};

const voteOpportunity = async (id, vote) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				signer
			);
			const transaction1 = await contract.voteOpportunity(id, vote);
			await transaction1.wait();
			return { transaction1, success: true };
		}
	} catch (error) {
		return {
			success: false,
			msg: error.message,
		};
	}
	// return false;
};

// to fetch opportunity by id
const getOpportunityAt = async (id) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			console.log("check");
			let tx = await contract.opportunityToId(id);
			let obj = getOpportunity(tx);
			return obj;
		}
	} catch (error) {
		console.log(error);
	}
	return null;
};

const getAllUnderReviewOpportunities = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			const count = await contract.getTotalOpportunities();
			let opportunities = [];

			for (let i = 0; i < count; i++) {
				let id = await contract.opportunityIds(i);

				let tx = await contract.opportunityToId(id);
				if (tx.opportunityStatus.toString() === "0") {
					let obj = getOpportunity(tx);
					opportunities.push(obj);
				}
			}
			return opportunities;
		}
	} catch (error) {
		console.log(error);
	}

	return 0;
};

const getDrawdownOpportunities = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			let borrower = await getEthAddress();
			const data = await contract.getOpportunityOf(borrower);
			let opportunities = [];
			for (const opportunity of data) {
				let tx = await contract.opportunityToId(opportunity);

				if (
					!tx.opportunityPoolAddress ||
					tx.opportunityPoolAddress === nullAddress ||
					tx.opportunityStatus.toString() !== "5"
				) {
					continue;
				}

				// Get opportunities available for drawdown
				let poolAddress = tx.opportunityPoolAddress.toString();
				console.log(poolAddress);
				const poolContract = new ethers.Contract(
					poolAddress,
					opportunityPool.abi,
					provider
				);

				if (!poolContract) {
					continue;
				}

				let poolBalance = await poolContract.poolBalance();
				poolBalance = ethers.utils.formatUnits(poolBalance, sixDecimals);
				let loanAmount = ethers.utils.formatUnits(tx.loanAmount, sixDecimals);
				console.log(poolBalance.toString());
				if (parseInt(poolBalance) >= parseInt(loanAmount)) {
					let obj = getOpportunity(tx);
					opportunities.push(obj);
				}
			}
			return opportunities;
		}
	} catch (error) {
		console.log(error);
	}

	return undefined;
};
const getOpportunitiesWithDues = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			if (!provider) {
				return;
			}
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			if (!contract) {
				return;
			}

			let borrower = await getEthAddress();
			const data = await contract.getOpportunityOf(borrower);
			let opportunities = [];
			for (const opportunity of data) {
				let tx = await contract.opportunityToId(opportunity);
				// check for the drawn down opportunities
				if (tx.opportunityStatus.toString() === "6") {
					let poolAddress = tx.opportunityPoolAddress.toString();
					console.log(poolAddress);
					const poolContract = new ethers.Contract(
						poolAddress,
						opportunityPool.abi,
						provider
					);

					if (!poolContract) {
						continue;
					}

					let repaymentDate = await poolContract.nextRepaymentTime();
					let repaymentAmount = await poolContract.getRepaymentAmount();
					let totalRepaidAmt = await poolContract.totalRepaidAmount();
					repaymentAmount = ethers.utils.formatUnits(
						repaymentAmount,
						sixDecimals
					);

					let obj = getOpportunity(tx);
					obj.nextDueDate = convertDate(repaymentDate);
					obj.epochDueDate = repaymentDate.toString();
					obj.repaymentAmount = repaymentAmount;
					obj.repaymentDisplayAmount = getDisplayAmount(repaymentAmount);
					obj.totalRepaidAmount = parseFloat(
						ethers.utils.formatUnits(totalRepaidAmt, sixDecimals)
					);
					const overdueTime = Math.floor(Date.now() / 1000) - repaymentDate;
					obj.isOverDue = overdueTime > 0 ? true : false;

					opportunities.push(obj);
				}
			}
			return opportunities;
		}
	} catch (error) {
		console.log(error);
	}

	return undefined;
};

const getAllActiveOpportunities = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			const count = await contract.getTotalOpportunities();
			let opportunities = [];

			for (let i = 0; i < count; i++) {
				let id = await contract.opportunityIds(i);
				let opportunity = await contract.opportunityToId(id);
				if (opportunity.opportunityStatus.toString() === "5") {
					// get pool for opportunity
					let poolAddress = opportunity.opportunityPoolAddress.toString();
					console.log(poolAddress);
					const poolContract = new ethers.Contract(
						poolAddress,
						opportunityPool.abi,
						provider
					);
					let juniorPooldata = await poolContract.juniorSubpoolDetails();
					let poolBal = await poolContract.poolBalance();
					let obj = getOpportunity(opportunity);
					let investableAmount =
						+juniorPooldata[1].toString() - +juniorPooldata[2].toString();

					investableAmount = ethers.utils.formatUnits(
						investableAmount,
						sixDecimals
					);
					obj.investableAmount = investableAmount;
					obj.investableDisplayAmount = getDisplayAmount(investableAmount);

					poolBal = ethers.utils.formatUnits(poolBal, sixDecimals);

					obj.isFull = parseFloat(poolBal) >= parseFloat(obj.actualLoanAmount);
					opportunities.push(obj);
				}
			}
			return { opportunities, success: true };
		}
	} catch (error) {
		Sentry.captureException(error);
		return {
			success: false,
			msg: error.message,
		};
	}

	return undefined;
};

const getAllWithdrawableOpportunities = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			let borrower = await getEthAddress();
			const count = await contract.getOpportunityOf(borrower);
			let opportunities = [];

			for (let i = 0; i < count; i++) {
				let id = await contract.opportunityIds(i);

				let tx = await contract.opportunityToId(id);

				if (tx.opportunityStatus.toString() === "7") {
					let poolAddress = tx.opportunityPoolAddress.toString();
					console.log(poolAddress);
					const poolContract = new ethers.Contract(
						poolAddress,
						opportunityPool.abi,
						provider
					);
					let poolBal = await poolContract.poolBalance();
					if (poolBal.toString() !== "0") {
						const signer = provider.getSigner();
						const userStakingAmt = await poolContract.stakingBalance(
							await signer.getAddress()
						);
						const estimatedAPY = await poolContract.juniorYieldPerecentage();
						let obj = getOpportunity(tx);
						obj.capitalInvested = userStakingAmt;
						obj.estimatedAPY = estimatedAPY;
						obj.yieldGenerated = userStakingAmt * estimatedAPY;
						if (obj) {
							opportunities.push(obj);
						}
					}
				}
			}
			return { opportunities, success: true };
		}
	} catch (error) {
		Sentry.captureException(error);

		return {
			success: false,
			msg: error.message,
		};
	}

	return [];
};

const getAllUnderwriterOpportunities = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			let underWriter = await getEthAddress();
			const opportunityList = await contract.getUnderWritersOpportunities(
				underWriter
			);
			if (!opportunityList) {
				return null;
			}

			let opportunities = [];
			for (let i = 0; i < opportunityList.length; i++) {
				let tx = await contract.opportunityToId(opportunityList[i]);
				if (tx.opportunityStatus.toString() === "0") {
					let obj = getOpportunity(tx);
					opportunities.push(obj);
				}
			}
			return { opportunities, success: true };
		}
	} catch (error) {
		Sentry.captureException(error);

		return {
			success: false,
			msg: error.message,
		};
	}

	return null;
};

const getOpportunityName = async (poolAddress) => {
	if (!poolAddress || poolAddress === nullAddress) {
		return;
	}

	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const poolContract = new ethers.Contract(
				poolAddress,
				opportunityPool.abi,
				provider
			);
			const opName = await poolContract.getOpportunityName();
			return { opName, success: true };
		}
	} catch (error) {
		Sentry.captureException(error);
		return {
			success: false,
			msg: error.message,
		};
	}
	return "";
};
module.exports = {
	createOpportunity,
	getOpportunity,
	getOpportunitysOf,
	voteOpportunity,
	getOpportunityAt,
	getAllUnderReviewOpportunities,
	getDrawdownOpportunities,
	getOpportunitiesWithDues,
	getAllActiveOpportunities,
	getAllWithdrawableOpportunities,
	getAllUnderwriterOpportunities,
	getOpportunityName,
};
