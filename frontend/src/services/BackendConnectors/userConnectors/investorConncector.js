const { ethers } = require("ethers");
const opportunityPool = require("../../../artifacts/contracts/protocol/OpportunityPool.sol/OpportunityPool.json");
const seniorPool = require("../../../artifacts/contracts/protocol/SeniorPool.sol/SeniorPool.json");
const investor = require("../../../artifacts/contracts/protocol/Investor.sol/Investor.json");
const opportunityOrigination = require("../../../artifacts/contracts/protocol/OpportunityOrigination.sol/OpportunityOrigination.json");
const { requestAccount, getEthAddress } = require("./commonConnectors");
const { getOpportunity } = require("../opportunityConnectors");

const sixDecimals = 6;

const withdrawAllJunior = async (poolAddress) => {
	if (typeof window.ethereum !== "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		console.log({ provider });
		const signer = provider.getSigner();
		const poolContract = new ethers.Contract(
			poolAddress,
			opportunityPool.abi,
			signer
		);

		const transaction1 = await poolContract.withdrawAll(0); // 0 is juniorpool ID
		await transaction1.wait();
	}
};

const withdrawSeniorPoolInvestment = async (amount) => {
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
			}
		}
	} catch (error) {
		console.log(error);
	}

	return undefined;
};

const getTotalInvestmentOfInvestor = async () => {
	let investorAddress = await getEthAddress();
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
			let seniorInvestment = obj.stakingAmt;
			totalInvestment += seniorInvestment;
			for (let i = 0; i < opportunities.length; i++) {
				let tx = await originationContract.opportunityToId(opportunities[i]);
				let obj = await getOpportunity(tx);

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
			return totalInvestment;
		}
	} catch (error) {
		console.log(error);
	}
	return 0;
};

const getTotalYieldOfInvestor = async () => {
	let investorAddress = await getEthAddress();
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
					let obj = await getOpportunity(tx);

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
			return totalYield;
		}
	} catch (error) {
		console.log(error);
	}
	return 0;
};
const getSeniorPoolSharePrice = async () => {
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
		console.log(error);
	}
	return 0;
};

const getSeniorPoolDisplaySharePrice = async (defaultSharePrice) => {
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
	return { sharePrice: sharePrice, displaySharePrice: sharePrice + "%" };
};

const getJuniorWithdrawableOp = async () => {
	let investorAddress = await getEthAddress();
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
				let obj = await getOpportunity(tx);

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
				let investorWithdrawable = await poolContract.getUserWithdrawableAmount();
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
			return opportunityList;
		}
	} catch (error) {
		console.log(error);
	}
	return [];
};

const getUserSeniorPoolInvestment = async () => {
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
					stakingAmt: parseFloat(
						ethers.utils.formatUnits(data.stakingAmt, sixDecimals)
					),
					withdrawableAmt: parseFloat(
						ethers.utils.formatUnits(data.withdrawableAmt, sixDecimals)
					),
				};
			}
		}
	} catch (error) {
		console.log(error);
	}

	return undefined;
};
const investInSeniorPool = async (amount) => {
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
		}
	} catch (error) {
		console.log(error);
	}
};
const investInJuniorPool = async (poolAddress, amount) => {
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
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	withdrawAllJunior,
	withdrawSeniorPoolInvestment,
	getTotalYieldOfInvestor,
	getTotalInvestmentOfInvestor,
	getSeniorPoolSharePrice,
	getSeniorPoolDisplaySharePrice,
	getJuniorWithdrawableOp,
	getUserSeniorPoolInvestment,
	investInJuniorPool,
	investInSeniorPool,
};
