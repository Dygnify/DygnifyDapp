const { ethers } = require("ethers");
const ERC20 = require("../../artifacts/contracts/protocol/old/TestUSDCToken.sol/TestUSDCToken.json");

const allowance = async (owner, spender) => {
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		console.log({ provider });
		console.log(process.env.REACT_APP_TEST_USDCTOKEN);
		const signer = provider.getSigner();
		const Contract = new ethers.Contract(
			process.env.REACT_APP_TEST_USDCTOKEN,
			ERC20.abi,
			signer
		);

		const data = await Contract.allowance(owner, spender);
		return data;
	}
};

export default allowance;
