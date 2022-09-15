const { ethers } = require("ethers");
const { requestAccount, getEthAddress } = require("./commonConnectors");
const borrowerContract = require("../../../artifacts/contracts/protocol/Borrower.sol/Borrower.json");

const opportunityPool = require("../../../artifacts/contracts/protocol/OpportunityPool.sol/OpportunityPool.json");

const getBorrowerDetails = async (address) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				process.env.REACT_APP_BORROWER,
				borrowerContract.abi,
				provider
			);

			if (!address) {
				address = await getEthAddress();
			}

			if (address) {
				console.log("getBrDe", await contract.borrowerProfile(address));
				return await contract.borrowerProfile(address);
			}
		}
	} catch (error) {
		console.log(error);
	}

	return undefined;
};

const updateBorrowerDetails = async (cid) => {
	try {
		if (typeof window.ethereum !== "undefined" && cid) {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_BORROWER,
				borrowerContract.abi,
				signer
			);
			let transaction = await contract.updateBorrowerProfile(cid);
			await transaction.wait();
		}
	} catch (error) {
		console.log(error);
	}

	return undefined;
};

const repayment = async (poolAddress) => {
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		console.log({ provider });
		const signer = provider.getSigner();
		const poolContract = new ethers.Contract(
			poolAddress,
			opportunityPool.abi,
			signer
		);

		const transaction1 = await poolContract.repayment();
		await transaction1.wait();
		return transaction1;
	}
};
const drawdown = async (poolAddress) => {
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		console.log({ provider });
		const signer = provider.getSigner();
		const poolContract = new ethers.Contract(
			poolAddress,
			opportunityPool.abi,
			signer
		);

		const transaction1 = await poolContract.drawdown();
		await transaction1.wait();
	}
};

module.exports = {
	getBorrowerDetails,
	updateBorrowerDetails,
	repayment,
	drawdown,
};
