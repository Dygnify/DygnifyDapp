import React, { useState, useEffect } from "react";
import GradientButton from "../../uiTools/Button/GradientButton";
import WithdrawCard from "./components/Cards/WithdrawCard";
import {
	getAllWithdrawableOpportunities,
	getUserSeniorPoolInvestment,
	getWalletBal,
	getSeniorPoolDisplaySharePrice,
	getJuniorWithdrawableOp,
} from "../../components/transaction/TransactionHelper";
import { retrieveFiles } from "../../services/web3storageIPFS";
import { getBinaryFileData } from "../../services/fileHelper";
import { getDisplayAmount } from "../../services/displayTextHelper";

import WithdrawFundsModal from "./components/Modal/WithdrawFundsModal";
import Loader from "../../uiTools/Loading/Loader";

const Withdraw = () => {
	const [seniorPool, setSeniorPool] = useState();
	const [juniorPools, setJuniorPools] = useState([]);
	const [selected, setSelected] = useState(true);
	const [seniorPoolInvestment, setSeniorPoolInvestment] = useState();
	const [walletBal, setWalletBal] = useState();
	const [showModal, setShowModal] = useState(false);

	const [loading, setLoading] = useState(true);

	const handleForm = () => {
		setSelected(null);
	};

	useEffect(() => {
		getUserSeniorPoolInvestment()
			.then((data) => {
				setSeniorPoolInvestment(data);
			})
			.catch((error) => console.log("Failed to get senior pool investment"))
			.finally(() => setLoading(false));

		getWalletBal().then((data) => {
			setWalletBal(getDisplayAmount(data));
		});
	}, []);

	useEffect(() => {
		if (seniorPoolInvestment) {
			// fetch data from IPFS
			retrieveFiles(process.env.REACT_APP_SENIORPOOL_CID, true).then((res) => {
				if (res) {
					let read = getBinaryFileData(res);
					read.onloadend = async function () {
						try {
							let spJson = JSON.parse(read.result);
							if (spJson) {
								let seniorInvestmentData = {};
								seniorInvestmentData.poolName = spJson.poolName;
								seniorInvestmentData.opportunityAmount = getDisplayAmount(
									await getWalletBal(process.env.REACT_APP_SENIORPOOL)
								);

								let totalInvestment =
									seniorPoolInvestment.stakingAmt +
									seniorPoolInvestment.withdrawableAmt;
								seniorInvestmentData.capitalInvested =
									getDisplayAmount(totalInvestment);
								const { sharePrice, displaySharePrice } =
									await getSeniorPoolDisplaySharePrice(spJson.estimatedAPY);
								seniorInvestmentData.estimatedAPY = displaySharePrice;
								seniorInvestmentData.withdrawableAmt = getDisplayAmount(
									seniorPoolInvestment.withdrawableAmt
								);
								setSeniorPool(seniorInvestmentData);
							}
						} catch (error) {
							console.log(error);
						}
					};
				}
			});
		}
	}, [seniorPoolInvestment]);

	useEffect(() => {
		try {
			const fetchData = async () => {
				const opportunities = await getJuniorWithdrawableOp();
				setJuniorPools(opportunities);
			};
			fetchData();
		} catch (error) {
			console.log(error);
		}
	}, []);

	return (
		<div className={`relative ${loading ? "h-[100vh]" : ""}`}>
			{loading && <Loader />}
			<div className={`${loading ? "blur-sm" : ""}`}>
				{selected && (
					<WithdrawFundsModal
						showModal={showModal}
						handleForm={handleForm}
						userWalletBal={walletBal}
						data={selected}
						setShowModal={setShowModal}
					/>
				)}

				<div className="">
					<h2 className="text-xl md:text-2xl lg:text-3xl font-medium">
						Withdraw
					</h2>
				</div>

				<div className="mt-8">
					{seniorPool ? (
						<div className="mb-16 flex flex-col gap-5">
							<h2 className="text-2xl md:text-3xl lg:text-4xl font-medium">
								Senior pool
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
						<div className="text-neutral-500 text-lg text-center">
							<p>No stats are available. Explore opportunities here.</p>
						</div>
					) : (
						<div className="mb-16 flex flex-col gap-5">
							<h2 className="text-2xl md:text-3xl lg:text-4xl font-medium">
								Junior pools
							</h2>
							<div className="flex flex-col md:flex-row flex-wrap gap-5 md:gap-[1.8vw]">
								{juniorPools.map((item) => (
									<WithdrawCard
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
