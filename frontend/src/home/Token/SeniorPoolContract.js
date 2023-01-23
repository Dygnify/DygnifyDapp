import React from "react";
import GradientButton from "../../uiTools/Button/GradientButton";
import "./../Token.css";
import TokenInput from "./TokenInput";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import dygToken from "../../artifacts/contracts/protocol/old/TestUSDCToken.sol/TestUSDCToken.json";
import NFTMinter from "../../artifacts/contracts/protocol/old/NFT_minter.sol/NFTMinter.json";
import axiosHttpService from "../../services/axioscall";
import { amlCheck } from "../../services/ApiOptions/OFACAxiosOptions";
import axios from "axios";
import { Web3Storage, getFilesFromPath } from "web3.storage";
import opportunityOrigination from "../../artifacts/contracts/protocol/OpportunityOrigination.sol/OpportunityOrigination.json";
import seniorPool from "../../artifacts/contracts/protocol/SeniorPool.sol/SeniorPool.json";
import opportunityPool from "../../artifacts/contracts/protocol/OpportunityPool.sol/OpportunityPool.json";
import "./../Token.css";
import {
	getAllUnderReviewOpportunities,
	getAllActiveOpportunities,
} from "../../services/BackendConnectors/opportunityConnectors";
import {
	uploadFile,
	openFileInNewTab,
	storeJSONData,
} from "../../services/Helpers/skynetIPFS";
import Loader from "../../uiTools/Loading/Loader";
const tokenAddress = "0x7d7FE8dbb260a213322b0dEE20cB1ca2d313EBfE";
const NFT_minter = "0xbEfC9040e1cA8B224318e4f9BcE9E3e928471D37";

//metadata to ipfs
const pinJSONToIPFS = async (JSONBody) => {
	console.log("debug ", 1);
	const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
	//making axios POST request to Pinata ⬇️
	return axios
		.post(url, JSONBody, {
			headers: {
				pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
				pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
			},
		})
		.then(function (response) {
			return {
				success: true,
				pinataUrl:
					"https://gateway.pinata.cloud/ipfs/" +
					response.data.IpfsHash,
			};
		})
		.catch(function (error) {
			console.log(error);
			return {
				success: false,
				message: error.message,
			};
		});
};

const SeniorPoolContract = () => {
	const [userAccount, setUserAccount] = useState();
	const [amount, setAmount] = useState();
	const [selectedFile, setSelectedFile] = useState();
	const [tokenURI, setTokenURI] = useState("");
	const [nameForAMLCheck, setNameForAMLCheck] = useState("");
	const [admin, setAdmin] = useState("");
	const [juniorPool, setJuniorPool] = useState("");
	const [usdcReceiver, setUsdcReceiver] = useState("");
	const [receiverContract, setReceiverContract] = useState("");
	const [opportunityId, setOpportunityId] = useState("");
	const [underWriter, setUnderWriter] = useState("");
	const [opportunityIdForInvest, setOpportunityIdForInvest] = useState("");
	const [underReviewOp, setUnderReviewOp] = useState([]);
	const [activeOpportunityList, setActiveOpportunityList] = useState([]);
	const [user, setuser] = useState("");
	const [balance, setBalance] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	const makeTestingDark = (isDark) => {};

	// variation:1
	// useEffect(async () => {
	// 	let op = await getAllUnderReviewOpportunities();
	// 	if (op.success) setUnderReviewOp(op.opportunities);
	// 	else {
	// 		console.log(op.msg);
	// 	}
	// }, []);

	// variation:2
	useEffect(() => {
		async function fnc() {
			let op = await getAllUnderReviewOpportunities();
			if (op.success) setUnderReviewOp(op.opportunities);
			else {
				console.log(op.msg);
			}
		}
		fnc();
	}, []);

	useEffect(() => {
		async function fnc() {
			let { opportunities: op } = await getAllActiveOpportunities();
			if (op && op.length) setActiveOpportunityList(op);
			setIsLoading(false);
		}

		fnc();
	}, []);

	async function grantAdminRole(contractId, receiver) {
		console.log("debug ", 2);
		const admin =
			"0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			let contract;
			if (contractId == 0) {
				contract = new ethers.Contract(
					process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
					opportunityOrigination.abi,
					signer
				);
			} else if (contractId == 1) {
				contract = new ethers.Contract(
					process.env.REACT_APP_SENIORPOOL,
					seniorPool.abi,
					signer
				);
			}

			const transaction1 = await contract.grantRole(admin, receiver);
			await transaction1.wait();
		}
	}

	async function grantAdminRoleOfPool(receiver) {
		console.log("debug ", 3);
		const admin =
			"0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				juniorPool,
				opportunityPool.abi,
				signer
			);

			const transaction1 = await contract.grantRole(admin, receiver);
			await transaction1.wait();
		}
	}

	async function approveUSDCToken() {
		console.log("debug ", 4);
		let amount = "10000000000000000000000000000";
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			const contract2 = new ethers.Contract(
				process.env.REACT_APP_TEST_USDCTOKEN,
				dygToken.abi,
				signer
			);
			const transaction = await contract2.approve(usdcReceiver, amount);
			await transaction.wait();
		}
	}

	async function balanceOf() {
		console.log("debug ", 5);
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract2 = new ethers.Contract(
				process.env.REACT_APP_TEST_USDCTOKEN,
				dygToken.abi,
				provider
			);
			let amount = await contract2.balanceOf(user);
			amount = ethers.utils.formatUnits(amount, 6);
			setBalance(amount);
			return amount;
		}
	}

	async function investInToJunior() {
		console.log("debug ", 6);
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			let contract = new ethers.Contract(
				process.env.REACT_APP_SENIORPOOL,
				seniorPool.abi,
				signer
			);

			const transaction1 = await contract.invest(opportunityIdForInvest);
			await transaction1.wait();
		}
	}

	async function approveUSDCFromSenior() {
		console.log("debug ", 7);
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			let contract = new ethers.Contract(
				process.env.REACT_APP_SENIORPOOL,
				seniorPool.abi,
				signer
			);

			const transaction1 = await contract.approveUSDC(receiverContract);
			await transaction1.wait();
		}
	}

	async function assignUnderWriter() {
		console.log("debug ", 8);
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			let contract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				signer
			);

			const transaction1 = await contract.assignUnderwriters(
				opportunityId,
				underWriter
			);
			await transaction1.wait();
		}
	}

	async function lockPool(poolId) {
		console.log("debug ", 9);
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				juniorPool,
				opportunityPool.abi,
				signer
			);

			const transaction1 = await contract.lockPool(poolId);
			await transaction1.wait();
		}
	}

	async function unlockPool(poolId) {
		console.log("debug ", 10);
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				juniorPool,
				opportunityPool.abi,
				signer
			);

			const transaction1 = await contract.unLockPool(poolId);
			await transaction1.wait();
		}
	}

	async function requestAccount() {
		console.log("debug ", 11);
		await window.ethereum.request({ method: "eth_requestAccounts" });
	}

	async function getBalance() {
		console.log("debug ", 12);
		if (typeof window.ethereum !== "undefined") {
			const [account] = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				tokenAddress,
				dygToken.abi,
				provider
			);
			const balance = await contract.balanceOf(account);
			console.log("Balance: ", balance.toString());
		}
	}

	async function sendCoins() {
		console.log("debug ", 13);
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				tokenAddress,
				dygToken.abi,
				signer
			);
			const transaction = await contract.transfer(userAccount, amount);
			await transaction.wait();
			console.log(`${amount} Coins successfully sent to ${userAccount}`);
		}
	}

	async function approveSendCoins() {
		console.log("debug ", 14);
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				tokenAddress,
				dygToken.abi,
				signer
			);
			const transaction = await contract.approve(userAccount, amount);
			await transaction.wait();
			console.log(`${amount} Coins successfully sent to ${userAccount}`);
		}
	}

	async function mint_NFT(tokenURI) {
		console.log("debug ", 15);
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				NFT_minter,
				NFTMinter.abi,
				signer
			);
			const transaction = await contract.mint(tokenURI);
			await transaction.wait();
			console.log(`${tokenURI} has minted sucessfully.`);
			alert(`${tokenURI} has minted sucessfully.`);
		}
	}

	//web3.storage
	function makeStorageClient() {
		console.log("debug ", 16);
		return new Web3Storage({
			token: process.env.REACT_APP_WEB3STORAGE_APIKEY,
		});
	}

	// On file upload (click the upload button)
	async function onFileUpload() {
		console.log("debug ", 17);
		try {
			console.log("Upload called");
			await uploadFile(selectedFile);
		} catch (error) {
			console.log(error);
		}
	}

	async function onFileOpen() {
		console.log("debug ", 18);
		try {
			console.log("Open file called");
			await openFileInNewTab();
		} catch (error) {
			console.log(error);
		}
	}

	async function onSaveSeniorPoolData() {
		console.log("debug ", 19);
		try {
			await storeJSONData("Senior_Pool_Data", {
				poolName: "Dygnify's Senior Pool",
				poolDescription:
					"A brilliant option to earn automatically diversified yields wherein the capital is distributed among the open pools backed by real world assets.The pool comprises of various borrowers who have been verified and vetted by the protocol. Each fund is unique in its own way and the details of the same are provided below.\n\nHighlights :\n1. Risk is automatically distributed  by deploying  your capital in various open borrower pools letting you earn passive yield.\n2. The borrowings are covered by a minimum of 110% of security in the form of physical real world assets.\n3. Stable monthly returns on the investment uncorelated to the digital asset market.",
				estimatedAPY: "7",
			});
		} catch (error) {
			console.log(error);
		}
	}

	async function onCheckAML(name) {
		console.log("debug ", 20);
		try {
			console.log("onCheckAML called");
			if (!name) {
				return;
			}
			let amlCheckRes = await axiosHttpService(amlCheck(name));
			console.log("Status " + amlCheckRes.code);
			console.log("Body" + amlCheckRes.res);
			console.log("Error " + amlCheckRes.res["error"]);
			if (
				amlCheckRes.code === 200 &&
				amlCheckRes.res["error"] === false
			) {
				if (
					amlCheckRes.res["matches"][name][0] &&
					amlCheckRes.res["matches"][name][0]["score"] >=
						process.env.REACT_APP_OFAC_MIN_SCORE
				) {
					return true;
				} else {
					return false;
				}
			} else {
				return;
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="p-2">
			<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
				Add Admin
			</h2>
			<div className="-mt-1 divider"></div>
			<div>
				<div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						placeholder="Target Address"
						onChange={(event) => setAdmin(event.target.value)}
					/>
					<GradientButton onClick={() => grantAdminRole(1, admin)}>
						Add Admin
					</GradientButton>
				</div>
				<br />
				<h2 className="mt-12 text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					All Active Opportunities
				</h2>
				<div className="-mt-1 divider"></div>
				<div className="relative">
					{isLoading && <Loader />}
					<div
						className={`${
							isLoading ? "blur-sm" : ""
						} w-[95%] mx-auto overflow-x-auto`}
					>
						<table className="w-full">
							<tr className="token-table-header text-slate-200">
								<td className=" font-bold">Opportunity name</td>
								<td className=" font-bold">
									Opportunity Address
								</td>
								<td className="font-bold">Opportunity id</td>
							</tr>
							{activeOpportunityList.map((item) => {
								return (
									<>
										<tr>
											<td>{item.opportunityName}</td>
											<td>
												{item.opportunityPoolAddress}
											</td>
											<td>{item.id}</td>
										</tr>
									</>
								);
							})}
						</table>
					</div>
				</div>
				<br />
				<br />
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					Fund Opportunity
				</h2>
				<div className="-mt-1 divider"></div>

				<div className="md:w-[60%] mx-auto font-semibold mb-2 pl-2">
					<p>Step-1</p>
				</div>
				<div className="flex flex-col md:flex-row items-center md:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						placeholder="Receiver contract Address"
						onChange={(event) =>
							setReceiverContract(event.target.value)
						}
					/>
					<GradientButton onClick={() => approveUSDCFromSenior()}>
						Approve
					</GradientButton>
				</div>
				<br />
				<br />
				<div className="md:w-[60%] mx-auto font-semibold mb-2 pl-2">
					<p>Step-2</p>
				</div>
				<div className="flex flex-col md:flex-row items-center md:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						placeholder="Opportunity Id"
						onChange={(event) =>
							setOpportunityIdForInvest(event.target.value)
						}
					/>
					<GradientButton onClick={() => investInToJunior()}>
						Invest in Senior tranche
					</GradientButton>
				</div>
			</div>
		</div>
	);
};

export default SeniorPoolContract;
