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
				const poolAddress = isWithdraw ? trx.to : trx.from;
				let opportunityName;
				if (
					poolAddress.toUpperCase() ===
					process.env.REACT_APP_SENIORPOOL.toUpperCase()
				) {
					opportunityName = "Liquidity Pool";
				} else {
					const { opName } = await getOpportunityName(poolAddress);
					opportunityName = opName;
				}

				if (opportunityName) {
					trxArray.push({ ...trx, isWithdraw, opportunityName });
				}
			}
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
