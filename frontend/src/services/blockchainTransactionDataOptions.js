const tokenTransactions = (address, page, offset) => {
	if (!address) {
		return null;
	}
	console.log("Fetching transactions for address - ", address);
	var api_options = {
		method: "get",
		url: `${
			process.env.REACT_APP_POLYGONSCAN_URL
		}/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=${
			page ? page : 1
		}&offset=${offset ? offset : 10}&sort=desc&apikey=${
			process.env.REACT_APP_POLYGONSCAN_APIKEY
		}`,
	};

	return api_options;
};

const tokenTransactionsFromCovalent = (address) => {
	if (!address) {
		return null;
	}
	console.log("Fetching transactions for address - ", address);
	var api_options = {
		method: "get",
		url: `https://api.covalenthq.com/v1/80001/address/${address}/transactions_v2/?&key=${process.env.REACT_APP_COVALENT_API_KEY}`,
	};

	return api_options;
};

module.exports = { tokenTransactions, tokenTransactionsFromCovalent };
