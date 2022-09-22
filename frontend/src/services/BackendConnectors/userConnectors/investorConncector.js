const { ethers } = require("ethers");
const opportunityPool = require("../../../artifacts/contracts/protocol/OpportunityPool.sol/OpportunityPool.json");
const seniorPool = require("../../../artifacts/contracts/protocol/SeniorPool.sol/SeniorPool.json");
const investor = require("../../../artifacts/contracts/protocol/Investor.sol/Investor.json");
const opportunityOrigination = require("../../../artifacts/contracts/protocol/OpportunityOrigination.sol/OpportunityOrigination.json");
const { requestAccount, getEthAddress } = require("./commonConnectors");
const { getOpportunity } = require("../opportunityConnectors");
const Sentry = require("@sentry/react");

const sixDecimals = 6;

export const withdrawAllJunior = async (poolAddress) => {
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		console.log({ provider });
		const signer = provider.getSigner();
		const poolContract = new ethers.Contract(
			poolAddress,
			opportunityPool.abi,
			signer
		);

		const transaction = await poolContract.withdrawAll(0); // 0 is juniorpool ID
		await transaction.wait();
		return { transaction, success: true };
	} else {
		return {
			success: false,
			msg: "Please connect your wallet!",
		};
	}
};

export const withdrawSeniorPoolInvestment = async (amount) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });
			const contract = new ethers.Contract(
				process.env.REACT_APP_SENIORPOOL,
				seniorPool.abi,
				signer
			);

			amount = ethers.utils.parseUnits(amount, sixDecimals);
			if (amount && amount > 0) {
				let transaction = await contract.withdrawWithLP(amount);
				await transaction.wait();
				return { transaction, success: true };
			}
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

export const getTotalInvestmentOfInvestor = async () => {
	let { result } = await getEthAddress();
	let investorAddress = result;
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				process.env.REACT_APP_INVESTOR,
				investor.abi,
				provider
			);
			const originationContract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			let opportunities = await contract.getOpportunityOfInvestor(
				investorAddress
			);
			let totalInvestment = 0;
			let obj = await getUserSeniorPoolInvestment();
			let seniorInvestment = obj.data.stakingAmt;
			totalInvestment += seniorInvestment;
			for (let i = 0; i < opportunities.length; i++) {
				let tx = await originationContract.opportunityToId(opportunities[i]);
				let { obj } = await getOpportunity(tx);

				const poolContract = new ethers.Contract(
					obj.opportunityPoolAddress,
					opportunityPool.abi,
					provider
				);
				let stakingBal = await poolContract.stakingBalance(investorAddress);
				stakingBal = ethers.utils.formatUnits(
					stakingBal.toString(),
					sixDecimals
				);
				totalInvestment += parseFloat(stakingBal);
			}
			return { totalInvestment, success: true };
		}
	} catch (error) {
		Sentry.captureException(error);
		return {
			success: false,
			msg: error.message,
		};
	}
	return 0;
};

export const getTotalYieldOfInvestor = async () => {
	let { result } = await getEthAddress();
	let investorAddress = result;
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				process.env.REACT_APP_INVESTOR,
				investor.abi,
				provider
			);
			const originationContract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			let opportunities = await contract.getOpportunityOfInvestor(
				investorAddress
			);
			let totalYield = 0;

			for (let i = 0; i < opportunities.length; i++) {
				let tx = await originationContract.opportunityToId(opportunities[i]);
				if (tx.opportunityStatus.toString() === "7") {
					let { obj } = await getOpportunity(tx);

					const poolContract = new ethers.Contract(
						obj.opportunityPoolAddress,
						opportunityPool.abi,
						provider
					);
					let stakingBal = await poolContract.stakingBalance(investorAddress);
					stakingBal = ethers.utils.formatUnits(
						stakingBal.toString(),
						sixDecimals
					);
					let yieldPercentage = await poolContract.juniorYieldPerecentage();
					yieldPercentage = ethers.utils.formatUnits(
						yieldPercentage.toString(),
						sixDecimals
					);
					let opportunityYieldEarned =
						parseFloat(stakingBal) * parseFloat(yieldPercentage);

					totalYield += opportunityYieldEarned;
				}
			}
			return { totalYield, success: true };
		}
	} catch (error) {
		Sentry.captureException(error);
		return {
			success: false,
			msg: error.message,
		};
	}
	return 0;
};

export const getSeniorPoolSharePrice = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(
				process.env.REACT_APP_SENIORPOOL,
				seniorPool.abi,
				provider
			);
			let sharePrice = await contract.sharePrice();
			return ethers.utils.formatUnits(sharePrice, sixDecimals) * 100;
		}
	} catch (error) {
		Sentry.captureException(error);
		return {
			success: false,
			msg: error.message,
		};
	}
	return 0;
};

export const getSeniorPoolDisplaySharePrice = async (defaultSharePrice) => {
	let sharePrice;
	// 10 will be the default in case we didn't get default share price
	defaultSharePrice = defaultSharePrice ? defaultSharePrice : 10;
	let backendSharePrice = parseFloat(await getSeniorPoolSharePrice()).toFixed(
		2
	);
	sharePrice =
		backendSharePrice > defaultSharePrice
			? backendSharePrice
			: defaultSharePrice;
	return {
		sharePrice: sharePrice,
		displaySharePrice: sharePrice + "%",
		success: true,
	};
};

export const getJuniorWithdrawableOp = async () => {
	let { result } = await getEthAddress();
	let investorAddress = result;
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_INVESTOR,
				investor.abi,
				provider
			);
			const originationContract = new ethers.Contract(
				process.env.REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS,
				opportunityOrigination.abi,
				provider
			);

			let opportunities = await contract.getOpportunityOfInvestor(
				investorAddress
			);
			let opportunityList = [];
			for (let i = 0; i < opportunities.length; i++) {
				let tx = await originationContract.opportunityToId(opportunities[i]);
				let { obj } = await getOpportunity(tx);

				const poolContract = new ethers.Contract(
					obj.opportunityPoolAddress,
					opportunityPool.abi,
					signer
				);
				let stakingBal = await poolContract.stakingBalance(investorAddress);
				stakingBal = ethers.utils.formatUnits(
					stakingBal.toString(),
					sixDecimals
				);
				obj.capitalInvested = stakingBal;
				let poolBal = await poolContract.poolBalance();
				poolBal = ethers.utils.formatUnits(poolBal, sixDecimals);

				let estimatedAPY = await poolContract.getYieldPercentage();

				obj.estimatedAPY =
					ethers.utils.formatUnits(estimatedAPY[1].toString(), sixDecimals) *
						100 +
					"%";
				let investorWithdrawable =
					await poolContract.getUserWithdrawableAmount();
				investorWithdrawable = ethers.utils.formatUnits(
					investorWithdrawable.toString(),
					sixDecimals
				);
				obj.withdrawableAmt =
					parseInt(poolBal) >= parseInt(obj.opportunityAmount)
						? investorWithdrawable
						: 0;
				opportunityList.push(obj);
			}
			console.log(opportunityList);
			return { opportunityList, success: true };
		}
	} catch (error) {
		Sentry.captureException(error);
		return {
			success: false,
			msg: error.message,
		};
	}
	return [];
};

export const getUserSeniorPoolInvestment = async () => {
	try {
		if (typeof window.ethereum !== "undefined") {
			await requestAccount();
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			console.log({ signer });
			const contract = new ethers.Contract(
				process.env.REACT_APP_SENIORPOOL,
				seniorPool.abi,
				signer
			);

			let data = await contract.getUserInvestment();
			if (data) {
				return {
					data: {
						stakingAmt: parseFloat(
							ethers.utils.formatUnits(data.stakingAmt, sixDecimals)
						),
						withdrawableAmt: parseFloat(
							ethers.utils.formatUnits(data.withdrawableAmt, sixDecimals)
						),
					},
					success: true,
				};
			}
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

export const investInSeniorPool = async (amount) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				process.env.REACT_APP_SENIORPOOL,
				seniorPool.abi,
				signer
			);
			amount = ethers.utils.parseUnits(amount, sixDecimals);
			let transaction = await contract.stake(amount);
			await transaction.wait();
			return { transaction, success: true };
		}
	} catch (error) {
		Sentry.captureException(error);
		return {
			success: false,
			msg: error.message,
		};
	}
};

export const investInJuniorPool = async (poolAddress, amount) => {
	try {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log({ provider });
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				poolAddress,
				opportunityPool.abi,
				signer
			);
			amount = ethers.utils.parseUnits(amount, sixDecimals);
			let transaction = await contract.deposit("0", amount); //0 denotes junior subpool
			await transaction.wait();
			return { transaction, success: true };
		}
	} catch (error) {
		Sentry.captureException(error);
		return {
			success: false,
			msg: error.message,
		};
	}
};
