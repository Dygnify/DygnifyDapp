const {
	getOpportunityName,
} = require("../../services/BackendConnectors/opportunityConnectors");
const axiosHttpService = require("../../services/axioscall");
const {
	tokenTransactions,
} = require("../../services/ApiOptions/blockchainTransactionDataOptions");

const getTokenTransactions = async (address, tokenAddress) => {
	let trxArray;
	try {
		let trxData = await axiosHttpService(
			tokenTransactions(address, tokenAddress)
		);
		if (trxData && trxData.res.result) {
			console.log(trxData.res.result);

			trxData.res.result.forEach(async (trx) => {
				let isWithdrawal = getTransactionType(trx.from, address);
				let opportunityName = await getOpportunityName(
					isWithdrawal ? trx.to : trx.from
				);
				if (opportunityName) {
					trxArray.push({ ...trx, isWithdrawal, opportunityName });
				}
			});
		}
	} catch (error) {
		console.log(error);
	}
	return trxArray;
};

function getTransactionType(from, userAddress) {
	if (from.toUpperCase() === userAddress.toUpperCase()) {
		return true;
	} else {
		return false;
	}
}

module.exports = { getTokenTransactions };
