const { ethers } = require("ethers");
const { requestAccount } = require("./userConnectors");

const {
	opportunityOrigination,
} = require("../../artifacts/contracts/protocol/OpportunityOrigination.sol/OpportunityOrigination.json");
const {
	opportunityPool,
} = require("../../artifacts/contracts/protocol/OpportunityPool.sol/OpportunityPool.json");
const {
	getUserWalletAddress,
} = require("../../components/transaction/TransactionHelper");
const sixDecimals = 6;

const createOpportunity = async (formData) => {
	let borrower = await getUserWalletAddress();
	let {
		loan_type,
		loan_amount,
		loan_tenure,
		loan_interest,
		capital_loss,
		payment_frequency,
		loanInfoHash,
		collateralHash,
	} = formData;
	console.log("backend call", formData);

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
		const loanAmt = ethers.utils.parseUnits(loan_amount, sixDecimals);
		const loanInterest = ethers.utils.parseUnits(loan_interest, sixDecimals);
		const capitalLoss = capital_loss
			? ethers.utils.parseUnits(capital_loss, sixDecimals)
			: 0;
		const transaction1 = await contract.createOpportunity(
			borrower,
			loanInfoHash,
			loan_type,
			loanAmt,
			loan_tenure,
			loanInterest,
			payment_frequency,
			collateralHash,
			capitalLoss
		);
		await transaction1.wait();
		console.log("successfully created*******");
	}
};

module.exports = { createOpportunity };
