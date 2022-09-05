// import { ethers } from "ethers";
// import dygnifyStaking from "../../artifacts/contracts/protocol/old/DygnifyStaking.sol/DygnifyStaking.json";

// import { requestAccount } from "../navbar/NavBarHelper";
// import opportunityOrigination from "../../artifacts/contracts/protocol/OpportunityOrigination.sol/OpportunityOrigination.json";
// import opportunityPool from "../../artifacts/contracts/protocol/OpportunityPool.sol/OpportunityPool.json";

// import {
// 	getDisplayAmount,
// 	getTrimmedWalletAddress,
// } from "../../services/displayTextHelper";

// const opportunityOriginationAddress =
// 	process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS;

// export async function approve(amount) {
// 	if (amount <= 0 || amount <= "0") {
// 		console.log("Amount must be greater than 0");
// 	} else if (typeof window.ethereum !== "undefined") {
// 		await requestAccount();
// 		const provider = new ethers.providers.Web3Provider(window.ethereum);
// 		console.log({ provider });
// 		const signer = provider.getSigner();
// 		const contract2 = new ethers.Contract(
// 			process.env.REACT_APP_TOKEN,
// 			dygnifyToken.abi,
// 			signer
// 		);
// 		const transaction = await contract2.approve(
// 			process.env.REACT_APP_DYGNIFY_STAKING_ADDRESS,
// 			amount
// 		);
// 		await transaction.wait();
// 	}
// }

// export async function allowance(ownerAddress) {
// 	if (typeof window.ethereum !== "undefined") {
// 		await requestAccount();
// 		const provider = new ethers.providers.Web3Provider(window.ethereum);
// 		console.log({ provider });
// 		const signer = provider.getSigner();
// 		const contract2 = new ethers.Contract(
// 			process.env.REACT_APP_TOKEN,
// 			dygnifyToken.abi,
// 			signer
// 		);
// 		const transaction = await contract2.allowance(
// 			ownerAddress,
// 			process.env.REACT_APP_DYGNIFY_STAKING_ADDRESS
// 		);

// 		return ethers.utils.formatEther(transaction);
// 	}
// }

// export async function stake(amount) {
// 	if (amount <= 0 || amount <= "0") {
// 		console.log("Amount must be greater than 0");
// 	} else if (typeof window.ethereum !== "undefined") {
// 		await requestAccount();
// 		const provider = new ethers.providers.Web3Provider(window.ethereum);
// 		console.log({ provider });
// 		const signer = provider.getSigner();
// 		const contract = new ethers.Contract(
// 			process.env.REACT_APP_DYGNIFY_STAKING_ADDRESS,
// 			dygnifyStaking.abi,
// 			signer
// 		);
// 		const transaction1 = await contract.stake(amount);
// 		await transaction1.wait();
// 	}
// }

// export async function unstake(amount) {
// 	if (amount === 0) console.log("Amount must be greater than 0");
// 	else if (typeof window.ethereum !== "undefined") {
// 		await requestAccount();
// 		const provider = new ethers.providers.Web3Provider(window.ethereum);
// 		console.log({ provider });
// 		const signer = provider.getSigner();
// 		const contract = new ethers.Contract(
// 			process.env.REACT_APP_DYGNIFY_STAKING_ADDRESS,
// 			dygnifyStaking.abi,
// 			signer
// 		);
// 		const transaction = await contract.unstake(amount);
// 		await transaction.wait();
// 	}
// }

// export async function withdrawYield() {
// 	if (typeof window.ethereum !== "undefined") {
// 		await requestAccount();
// 		const provider = new ethers.providers.Web3Provider(window.ethereum);
// 		console.log({ provider });
// 		const signer = provider.getSigner();
// 		const contract = new ethers.Contract(
// 			process.env.REACT_APP_DYGNIFY_STAKING_ADDRESS,
// 			dygnifyStaking.abi,
// 			signer
// 		);
// 		const transaction = await contract.withdrawYield();
// 		await transaction.wait();
// 	}
// }

// export async function getTotalYield() {
// 	try {
// 		if (typeof window.ethereum !== "undefined") {
// 			await requestAccount();
// 			const provider = new ethers.providers.Web3Provider(window.ethereum);
// 			console.log({ provider });
// 			const signer = provider.getSigner();
// 			const contract = new ethers.Contract(
// 				process.env.REACT_APP_DYGNIFY_STAKING_ADDRESS,
// 				dygnifyStaking.abi,
// 				signer
// 			);
// 			const data = await contract.getTotalYield();

// 			return ethers.utils.formatEther(data);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// 	return 0;
// }

// // once all work done this function name needs to be changed to getUSDCWalletBal

// //getWithBal not used in mainstack

// export async function getWithdrawBal() {
// 	try {
// 		if (typeof window.ethereum !== "undefined") {
// 			await requestAccount();
// 			const provider = new ethers.providers.Web3Provider(window.ethereum);
// 			console.log({ provider });
// 			const contract = new ethers.Contract(
// 				process.env.REACT_APP_DYGNIFY_STAKING_ADDRESS,
// 				dygnifyStaking.abi,
// 				provider
// 			);

// 			const signer = provider.getSigner();
// 			const data = await contract.stakingBalance(await signer.getAddress());
// 			return ethers.utils.formatEther(data);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}

// 	return 0;
// }

// export const getEthAddress = async () => {
// 	const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
// 	// Prompt user for account connections
// 	await provider.send("eth_requestAccounts", []);
// 	const signer = provider.getSigner();
// 	return await signer.getAddress();
// };
