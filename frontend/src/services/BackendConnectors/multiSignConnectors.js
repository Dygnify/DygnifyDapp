const { ethers } = require("ethers");
const { requestAccount } = require("./userConnectors/commonConnectors");
const multiSign = require("../../artifacts/contracts/protocol/MultiSign.sol/MultiSign.json");
const Sentry = require("@sentry/react");


export const confirmTransaction = async (txIndex) => {
	Sentry.captureMessage("confirmTransaction", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			const transaction1 = await contract.confirmTransaction(txIndex);
			await transaction1.wait();
			return { transaction1, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const revokeConfirmation = async (txIndex) => {
	Sentry.captureMessage("revokeConfirmation", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			const transaction1 = await contract.revokeConfirmation(txIndex);
			await transaction1.wait();
			return { transaction1, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const addOwner = async (owner) => {
	Sentry.captureMessage("addOwner", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			const transaction1 = await contract.addOwner(owner);
			await transaction1.wait();
			return { transaction1, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const removeOwner = async (owner) => {
	Sentry.captureMessage("removeOwner", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			const transaction1 = await contract.removeOwner(owner);
			await transaction1.wait();
			return { transaction1, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const updateNumConfirmationsRequired = async (
	numConfirmationsRequired
) => {
	Sentry.captureMessage("updateNumConfirmationsRequired", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			const transaction1 = await contract.updateNumConfirmationsRequired(
				numConfirmationsRequired
			);
			await transaction1.wait();
			return { transaction1, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const getOwners = async () => {
	Sentry.captureMessage("getOwners", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			const transaction1 = await contract.getOwners();
			await transaction1.wait();
			return { transaction1, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const getTransactionCount = async () => {
	Sentry.captureMessage("getTransactionCount", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			const transaction1 = await contract.getTransactionCount();
			await transaction1.wait();
			return { transaction1, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const getTransaction = async () => {
	Sentry.captureMessage("getTransaction", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			const transaction1 = await contract.getTransaction();
			await transaction1.wait();
			return { transaction1, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const getAllTransactions = async () => {
	Sentry.captureMessage("getAllTransactions", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			let traxactions = [];
			const txCount = (await contract.getTransactionCount()).toString();
			for (let i = 0; i < txCount; i++) {
				const transaction = await contract.transactions(i);
				traxactions.push(transaction);
			}
			return { traxactions, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const getNumConfirmationsRequired = async () => {
	Sentry.captureMessage("getAllTransactions", "info");
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_MULTISIGN,
				multiSign.abi,
				signer
			);
			const transaction = await contract.numConfirmationsRequired();
			return { transaction, success: true };
		} else {
			Sentry.captureMessage("Wallet connect error", "warning");
			return {
				success: false,
				msg: "please connect your wallet!",
			};
		}
	} catch (error) {
		Sentry.captureException(error);
		if (error?.data) {
			return {
				success: false,
				msg: error.data.message,
			};
		}
		return {
			success: false,
			msg: error.message,
		};
	}
};


