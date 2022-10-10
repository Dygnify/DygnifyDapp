const { ethers } = require("ethers");
const { requestAccount, getEthAddress } = require("./commonConnectors");
const borrowerContract = require("../../../artifacts/contracts/protocol/Borrower.sol/Borrower.json");

const opportunityPool = require("../../../artifacts/contracts/protocol/OpportunityPool.sol/OpportunityPool.json");

const Sentry = require("@sentry/react");

export const getBorrowerDetails = async (address) => {
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
				Sentry.captureMessage("Address not found", "info");
				let { result } = await getEthAddress();
				address = result;
			}

			if (address) {
				Sentry.captureMessage("Address received", "info");

				const borrowerCid = await contract.borrowerProfile(address);
				return { borrowerCid, success: true };
			}
		} else {
			Sentry.captureMessage("Wallet not connected", "warning");
			return {
				success: false,
				msg: "please connect your wallet",
			};
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

export const updateBorrowerDetails = async (cid) => {
	try {
		if (typeof window.ethereum !== "undefined" && cid) {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_BORROWER,
				borrowerContract.abi,
				signer
			);

			let transaction = await contract.updateBorrowerProfile(cid);
			await transaction.wait();

			return { success: true };
		}

		Sentry.captureMessage("Wallet not connected", "warning");
		return {
			success: false,
			msg: "please connect your wallet",
		};
	} catch (error) {
		Sentry.captureException(error);

		return {
			success: false,
			msg: error.message,
		};
	}
};

export const repayment = async (poolAddress) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			const iface = new ethers.utils.Interface(["function repayment()"]);

			const data = iface.encodeFunctionData("repayment", []);

			const transaction = {
				to: poolAddress,
				data: data,
				gasLimit: "0x7A120",
				from: window.ethereum.selectedAddress,
			};
			const tx = await signer.sendTransaction(transaction);
			await tx.wait();
			return { tx, success: true };
		}
		Sentry.captureMessage("Wallet not connected", "warning");
		return {
			success: false,
			msg: "please connect your wallet",
		};
	} catch (error) {
		Sentry.captureException(error);

		return {
			success: false,
			msg: error.message,
		};
	}
};
export const drawdown = async (poolAddress) => {
	try {
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
			return { success: true, hash: transaction1 };
		}
		Sentry.captureMessage("Wallet not connected", "warning");
		return {
			success: false,
			msg: "please connect your wallet",
		};
	} catch (error) {
		Sentry.captureException(error);

		return {
			success: false,
			msg: error.message,
		};
	}
};
