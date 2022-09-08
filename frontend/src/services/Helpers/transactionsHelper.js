import { getOpportunityName } from "../../services/BackendConnectors/opportunityConnectors";
import axiosHttpService from "../../services/axioscall";
import { tokenTransactions } from "../../services/ApiOptions/blockchainTransactionDataOptions";

export const getTokenTransactions = async (address, tokenAddress) => {
	let trxArray = [];
	try {
		let trxData = await axiosHttpService(
			tokenTransactions(address, tokenAddress)
		);
		if (trxData && trxData.res.result) {
			console.log(trxData.res.result);

			for (let i = 0; i < trxData.res.result.length; i++) {
				let trx = trxData.res.result[i];
				let isWithdraw = getTransactionType(trx.from, address);
				let opportunityName = await getOpportunityName(
					isWithdraw ? trx.to : trx.from
				);

				if (opportunityName) {
					trxArray.push({ ...trx, isWithdraw, opportunityName });
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
	console.log("*********", trxArray.length, trxArray);
	return trxArray;
};

function getTransactionType(from, userAddress) {
	if (from.toUpperCase() === userAddress.toUpperCase()) {
		return true;
	} else {
		return false;
	}
}
