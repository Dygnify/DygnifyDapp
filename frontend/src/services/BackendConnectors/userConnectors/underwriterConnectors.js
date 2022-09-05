const { ethers } = require("ethers");
const { getOpportunity } = require("../opportunityConnectors");
const { getEthAddress } = require("./commonConnectors");
const {
	opportunityOrigination,
} = require("../../../artifacts/contracts/protocol/OpportunityOrigination.sol/OpportunityOrigination.json");

const getApprovalHistory = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);
			const underWriter = await getEthAddress();
			const opportunities = await contract.getUnderWritersOpportunities(
				underWriter
			);
			let count = opportunities.length;
			let opportunitiesList = [];

			for (let i = 0; i < count; i++) {
				let tx = await contract.opportunityToId(opportunities[i]);
				if (tx.opportunityStatus.toString() !== "0") {
					//neglecting non voted opoortunities.
					let obj = getOpportunity(tx);
					opportunitiesList.push(obj);
				}
			}
			return opportunitiesList;
		}
	} catch (error) {
		console.log(error);
	}

	return 0;
};

module.exports = { getApprovalHistory };
