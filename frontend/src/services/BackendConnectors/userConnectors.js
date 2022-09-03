const { ethers } = require("ethers");

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

module.exports = { requestAccount, getUserWalletAddress };
