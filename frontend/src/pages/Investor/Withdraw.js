import React, { useState, useEffect } from "react";

import WithdrawCard from "./components/Cards/WithdrawCard";
import { getWalletBal } from "../../services/BackendConnectors/userConnectors/commonConnectors";
import {
	getUserSeniorPoolInvestment,
	getSeniorPoolDisplaySharePrice,
	getJuniorWithdrawableOp,
} from "../../services/BackendConnectors/userConnectors/investorConncector";

import { getDisplayAmount } from "../../services/Helpers/displayTextHelper";

import WithdrawFundsModal from "./components/Modal/WithdrawFundsModal";
import Loader from "../../uiTools/Loading/Loader";
import ProcessingFundsModal from "./components/Modal/ProcessingFundsModal";
import ErrorModal from "../../uiTools/Modal/ErrorModal";
import { getJSONData } from "../../services/Helpers/skynetIPFS";

const Withdraw = () => {
	const [seniorPool, setSeniorPool] = useState();
	const [juniorPools, setJuniorPools] = useState([]);
	const [selected, setSelected] = useState(null);
	const [seniorPoolInvestment, setSeniorPoolInvestment] = useState();
	const [walletBal, setWalletBal] = useState();
	const [showModal, setShowModal] = useState(false);
	const [processFundModal, setProcessFundModal] = useState();
	const [investProcessing, setInvestProcessing] = useState();
	const [loading, setLoading] = useState(true);
	const [txhash, settxhash] = useState("");
	const [contractAdrress, setcontractAdrress] = useState("");
	const [amounts, setAmounts] = useState("");
	const [withdralAmt, setwithdralAmt] = useState(null);

	const [updateSenior, setUpdateSenior] = useState(12);
	const [errormsg, setErrormsg] = useState({
		status: false,
		msg: "",
	});

	const handleForm = () => {
		setSelected(null);
	};

	useEffect(() => {
		getUserSeniorPoolInvestment()
			.then((data) => {
				if (data.success) {
					setSeniorPoolInvestment(data.data);
				}
			})
			.catch((error) => console.log("Failed to get senior pool investment"))
			.finally(() => setLoading(false));

		getWalletBal().then((res) => {
			if (res.success) {
				setWalletBal(getDisplayAmount(res.balance));
			} else {
				console.log(res.msg);
				setErrormsg({
					status: !res.success,
					msg: res.msg,
				});
			}
		});
	}, [updateSenior]);

	useEffect(() => {
		if (seniorPoolInvestment) {
			// fetch data from IPFS

			getJSONData(process.env.REACT_APP_SENIORPOOL_CID).then(async (spJson) => {
				try {
					if (spJson) {
						let seniorInvestmentData = {};
						seniorInvestmentData.opportunityName = spJson.poolName;
						const res = await getWalletBal(process.env.REACT_APP_SENIORPOOL);

						let balance;

						if (res.success) {
							balance = res.balance;
							seniorInvestmentData.opportunityAmount =
								getDisplayAmount(balance);
						} else {
							setErrormsg({
								status: !res.success,
								msg: res.msg,
							});
						}

						let totalInvestment =
							seniorPoolInvestment.stakingAmt +
							seniorPoolInvestment.withdrawableAmt;
						seniorInvestmentData.capitalInvested =
							getDisplayAmount(totalInvestment);
						setwithdralAmt(seniorPoolInvestment.withdrawableAmt);

						const price = await getSeniorPoolDisplaySharePrice(
							spJson.estimatedAPY
						);

						if (price.success) {
							const { sharePriceFromContract, displaySharePrice } = price;
							seniorInvestmentData.estimatedAPY = displaySharePrice;

							let realPossibleWithdrawAmt =
								(balance * (100 - sharePriceFromContract)) / 100;

							if (
								balance >=
								(seniorPoolInvestment.withdrawableAmt *
									(100 + parseFloat(sharePriceFromContract))) /
									100
							) {
								seniorInvestmentData.withdrawableAmt = getDisplayAmount(
									seniorPoolInvestment.withdrawableAmt
								);
							} else {
								seniorInvestmentData.withdrawableAmt = getDisplayAmount(
									realPossibleWithdrawAmt
								);
							}
							setSeniorPool(seniorInvestmentData);
						} else {
							setSeniorPool(null);
							console.log(price.msg);
							setErrormsg({
								status: !price.status,
								msg: price.msg,
							});
						}
					}
				} catch (error) {
					console.log(error);
				}
			});
		}
	}, [seniorPoolInvestment]);

	useEffect(() => {
		try {
			const fetchData = async () => {
				const opportunities = await getJuniorWithdrawableOp();
				if (opportunities.success) {
					setJuniorPools(opportunities.opportunityList);
				}
			};
			fetchData();
		} catch (error) {
			console.log(error);
		}
	}, []);

	return (
		<div className={`relative ${loading ? "h-[100vh]" : ""}`}>
			{loading && <Loader />}
			<ErrorModal errormsg={errormsg} setErrormsg={setErrormsg} />
			<div className={`${loading ? "blur-sm" : ""}`}>
				{selected && (
					<WithdrawFundsModal
						showModal={showModal}
						handleForm={handleForm}
						userWalletBal={walletBal}
						data={selected}
						setShowModal={setShowModal}
						setProcessFundModal={setProcessFundModal}
						setInvestProcessing={setInvestProcessing}
						settxhash={settxhash}
						setcontractAdrress={setcontractAdrress}
						setAmounts={setAmounts}
						setUpdateSenior={setUpdateSenior}
						withdralAmt={withdralAmt}
					/>
				)}
				{processFundModal ? (
					<ProcessingFundsModal
						investProcessing={investProcessing}
						invest={false}
						txhash={txhash}
						contractAddress={contractAdrress}
						amounts={amounts}
					/>
				) : (
					<></>
				)}

				<div className="">
					<h2 className="text-[1.4375rem] lg:text-[2.0625rem] ">Withdraw</h2>
				</div>

				<div className="mt-8">
					{seniorPool ? (
						<div className="mb-16 flex flex-col gap-5">
							<h2 className="font-semibold text-[1.4375rem] md:text-[1.75rem]">
								Liquidity Provider
							</h2>

							<WithdrawCard
								data={seniorPool}
								isSeniorPool={true}
								setSelected={setSelected}
								setShowModal={setShowModal}
							/>
						</div>
					) : (
						""
					)}

					{juniorPools.length === 0 ? (
						<div className="relative h-screen flex justify-center">
							<div className="text-[#64748B] text-xl text-center mt-3 absolute top-40">
								<p>No stats are available.</p>
							</div>
						</div>
					) : (
						<div className="mb-16 flex flex-col gap-5">
							<h2 className="font-semibold text-[1.4375rem] md:text-[1.75rem]">
								Underwriter
							</h2>
							<div className="flex flex-col md:flex-row flex-wrap gap-5 md:gap-[1.8vw]">
								{juniorPools.map((item) => (
									<WithdrawCard
										key={Math.random()}
										data={item}
										isSeniorPool={false}
										setSelected={setSelected}
										setShowModal={setShowModal}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Withdraw;
<h2>Invest</h2>;
