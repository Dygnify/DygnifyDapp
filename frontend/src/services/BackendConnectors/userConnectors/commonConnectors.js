const { ethers } = require("ethers");
const {
	dygnifyToken,
} = require("../../../artifacts/contracts/protocol/old/TestUSDCToken.sol/TestUSDCToken.json");

const sixDecimals = 6;

const getEthAddress = async () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
	// Prompt user for account connections
	await provider.send("eth_requestAccounts", []);
	const signer = provider.getSigner();
	return await signer.getAddress();
};

const requestAccount = async (metaMask) => {
	if (typeof window.ethereum !== "undefined") {
		let provider = window.ethereum;
		// edge case if MM and CBW are both installed
		if (window.ethereum.providers?.length) {
			window.ethereum.providers.forEach(async (p) => {
				if (metaMask === true) {
					if (p.isMetaMask) provider = p;
				} else {
					if (p.isCoinbaseWallet) {
						provider = p;
					}
				}
			});
		}
		await provider.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: "0x13881" }], // chainId must be in hexadecimal numbers
		});
		await provider.request({
			method: "eth_requestAccounts",
			params: [],
		});
	}
};

const isConnected = async () => {
	if (window.ethereum) {
		let connectionStatus = await window.ethereum.isConnected();
		console.log(connectionStatus);
		let chainId = window.ethereum.networkVersion;
		console.log(chainId);
		if (chainId == "80001" && connectionStatus == true) {
			return connectionStatus;
		}
	}
	return false;
};

const convertDate = (epochTimestamp) => {
	function pad(s) {
		return s < 10 ? "0" + s : s;
	}
	//epoch gives timestamp in seconds we need to convert it in miliseconds
	var d = new Date(epochTimestamp * 1000);
	return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
};

const getUserWalletAddress = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const address = await signer.getAddress();
			return address;
		}
	} catch (error) {
		console.log(error);
	}
	return undefined;
};

const getWalletBal = async (address) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			// console.log({ provider });
			const contract = new ethers.Contract(
				process.env.REACT_APP_TEST_USDCTOKEN,
				dygnifyToken.abi,
				provider
			);
			const signer = provider.getSigner();
			const bal = await contract.balanceOf(
				address ? address : await signer.getAddress()
			);
			return ethers.utils.formatUnits(bal, sixDecimals);
		}
	} catch (error) {
		console.log(error);
	}

	return 0;
};

module.exports = {
	getEthAddress,
	requestAccount,
	isConnected,
	convertDate,
	getUserWalletAddress,
	getWalletBal,
};
