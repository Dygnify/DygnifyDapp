const { ethers } = require("ethers");
const { IPaymaster, ChainId } = require("@biconomy/core-types");
const SmartAccount = require("@biconomy/smart-account").default;
const Sentry = require("@sentry/react");

let smartAccount;
const init = async () => {
	let options = {
		// activeNetworkId: activeChainId,
		// supportedNetworksIds: supportedChains,
		// Network Config.
		// Link Paymaster / DappAPIKey for the chains you'd want to support Gasless transactions on
		networkConfig: [
			{
				chainId: ChainId.POLYGON_MUMBAI,
				dappAPIKey: process.env.REACT_APP_BICONOMY_KEY,
				// customPaymasterAPI: <IPaymaster Instance of your own Paymaster>
			},
		],
	};
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	console.log("SmartAccount", SmartAccount);
	smartAccount = new SmartAccount(provider, options);
	smartAccount = await smartAccount.init();
};

export async function getSmartAccount() {
	if (!smartAccount) {
		await init();
	}
	smartAccount.on("error", (response) => {
		Sentry.captureMessage(
			`error event received via emitter, ${response}`,
			"error"
		);
		console.log("########", response);
	});
	return smartAccount;
}
