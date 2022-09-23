import { useState, useEffect } from "react";
import PoolCard from "./components/Cards/PoolCard";
import GradientButtonHeader from "../../uiTools/Button/GradientButtonHeader";
import {
	getUserSeniorPoolInvestment,
	getJuniorWithdrawableOp,
	getSeniorPoolDisplaySharePrice,
	getTotalYieldOfInvestor,
	getTotalInvestmentOfInvestor,
} from "../../services/BackendConnectors/userConnectors/investorConncector";
import { getWalletBal } from "../../services/BackendConnectors/userConnectors/commonConnectors";
import { useNavigate } from "react-router-dom";
import DoughnutChart from "../Components/DoughnutChart";
import LineChart from "./components/LineChart";
import { retrieveFiles } from "../../services/Helpers/web3storageIPFS";
import { getBinaryFileData } from "../../services/Helpers/fileHelper";
import { getDisplayAmount } from "../../services/Helpers/displayTextHelper";
import Loader from "../../uiTools/Loading/Loader";

const InvestorOverview = () => {
	const [totalInvestment, setTotalInvestment] = useState(0);
	const [totalYield, setTotalYield] = useState(0);
	const [seniorPool, setSeniorPool] = useState();
	const [juniorPool, setJuniorPool] = useState([]);
	const [seniorPoolInvestment, setSeniorPoolInvestment] = useState();

	// loading
	const [loading, setLoading] = useState(true);
	const [seniorPoolLoading, setSeniorPoolLoading] = useState(true);
	const [juniorPoolLoading, setJuniorPoolLoading] = useState(true);

	const path = useNavigate();

	async function updateSummery() {
		let amount = await getTotalInvestmentOfInvestor();

		if (amount.success) {
			setTotalInvestment(amount.totalInvestment);
		} else {
			console.log(amount.msg);
		}

		let yieldEarned = await getTotalYieldOfInvestor();

		if (yieldEarned.success) {
			setTotalYield(yieldEarned.totalYield);
		} else {
			console.log(yieldEarned.msg);
		}
	}

	useEffect(() => {
		getUserSeniorPoolInvestment()
			.then((data) => {
				if (data.success) {
					setSeniorPoolInvestment(data.data);
				} else {
					console.log(data.msg);
				}
			})
			.catch((error) => console.log("Failed to get senior pool investment"))
			.finally(() => setSeniorPoolLoading(false));
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
								seniorInvestmentData.opportunityName = spJson.poolName;
								const { balance } = await getWalletBal(
									process.env.REACT_APP_SENIORPOOL
								);
								seniorInvestmentData.opportunityAmount =
									getDisplayAmount(balance);

								let totalInvestment =
									seniorPoolInvestment.stakingAmt +
									seniorPoolInvestment.withdrawableAmt;

								seniorInvestmentData.capitalInvested =
									getDisplayAmount(totalInvestment);
								const { sharePrice, displaySharePrice } =
									await getSeniorPoolDisplaySharePrice(spJson.estimatedAPY);
								seniorInvestmentData.estimatedAPY = displaySharePrice;
								seniorInvestmentData.yieldGenerated = getDisplayAmount(
									parseFloat((totalInvestment * sharePrice) / 100)
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

	useEffect(async () => {
		await updateSummery();
		const junorPools = await getJuniorWithdrawableOp();
		if (junorPools.success) {
			setJuniorPool(junorPools.opportunityList);
		} else {
			console.log(junorPools.msg);
		}

		setJuniorPoolLoading(false);
	}, []);

	useEffect(() => {
		if (!juniorPoolLoading && !seniorPoolLoading) setLoading(false);
	}, [juniorPoolLoading, seniorPoolLoading]);

	return (
		<div className="lg:relative">
			{loading && <Loader />}
			<div className={`${loading ? "blur-sm" : ""}`}>
				<div className="flex items-center mb-8">
					<h2 className="text-[1.4rem] lg:text-[1.75rem] w-[50%] font-semibold">
						Investor's Dashboard
					</h2>
					<GradientButtonHeader
						onClick={() => path("/investor-dashboard/invest")}
						className="ml-auto text-white"
					>
						+ Invest
					</GradientButtonHeader>
				</div>

				{/* parent div */}
				<div className="flex flex-col md:flex-row gap-6">
					{/* child 1 */}
					<div className="flex flex-col gap-4 card-gradient px-4 py-4 rounded-xl md:flex-row sm:px-[4vw] md:pl-2 md:pr-[1.5vw] md:gap-3 lg:px-[1vw] xl:px-[1vw] xl:gap-8 md:w-1/2 2xl:items-center 2xl:justify-around">
						<div className="flex flex-col items-center gap-2 md:items-start	">
							<h2 className="text-xl font-bold text-[#64748B] md:text-sm 2xl:text-lg">
								Yield Earned
							</h2>

							<div className="">
								{totalInvestment || totalYield ? (
									<DoughnutChart
										data={[totalInvestment, totalYield ? totalYield : 0]}
										color={["#5375FE", "#ffffff"]}
										width={200}
										labels={["Total Outstanding", "Total Repaid"]}
										borderWidth={[1, 8]}
										legendStyle={{ display: false }}
									/>
								) : (
									<DoughnutChart
										data={[1]}
										color={["#64748B"]}
										width={200}
										labels={["Total Outstanding", "Total Repaid"]}
										borderWidth={[1, 8]}
										legendStyle={{ display: false }}
									/>
								)}
							</div>
						</div>
						{/* Change this total implementation */}

						<div className="flex flex-col gap-3 justify-center">
							<div className="flex items-center md:flex-col md:items-start gap-1">
								<p className="text-sm lg:text-base text-[#64748B] flex gap-1 items-center">
									<span className="inline-block w-3 h-2 bg-primary-500 rounded-3xl"></span>
									Total amount invested
								</p>

								{totalInvestment === 0 ? (
									<p className="ml-auto md:ml-0  text-xl lg:text-[1.75rem] px-5">
										- -
									</p>
								) : (
									<div className="ml-auto md:ml-0 font-semibold flex items-end gap-2 px-4">
										<p className=" text-xl lg:text-[1.75rem] ">
											{totalInvestment}
										</p>
										<p className="text-base lg:text-xl">
											{process.env.REACT_APP_TOKEN_NAME}
										</p>
									</div>
								)}
							</div>

							<div className="flex items-center md:flex-col md:items-start gap-1">
								<p className="text-sm lg:text-base text-[#64748B]  flex gap-1 items-center">
									<span className="inline-block w-3 h-2 bg-white rounded-3xl"></span>
									Total Yield Earned
								</p>

								{totalYield === 0 ? (
									<p className="ml-auto md:ml-0 text-xl lg:text-[1.75rem] px-5">
										- -
									</p>
								) : (
									<div className="ml-auto md:ml-0 font-semibold flex items-end gap-2 px-5">
										<p className=" text-xl lg:text-[1.75rem] ">{totalYield}</p>
										<p className="text-base lg:text-xl">
											{process.env.REACT_APP_TOKEN_NAME}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* child 2 */}
					{/* <div className="card-gradient md:w-1/2 px-2 py-4 flex flex-col gap-4 rounded-xl 2xl:justify-center xl:px-6 ">
						<p className="text-sm lg:text-base font-semibold  sm:px-4">
							Growth of investment on reinvesting everything for
						</p>
						<LineChart />
					</div> */}
				</div>

				<div className="flex flex-col gap-5 mt-[4em] md:mt-[5em]">
					<h1 className="text-[1.75rem] md:text-2xl font-semibold">
						Your Investments
					</h1>

					<div className="mb-4">
						<h2 className="md:text-[1.75rem] text-2xl mb-4">Senior Pool</h2>
						{seniorPool ? (
							<PoolCard data={seniorPool} />
						) : (
							<div className="text-center">
								<p className="text-neutral-500 text-lg">
									No senior pool investments stats available. Explore
									opportunities here.
								</p>
							</div>
						)}
					</div>

					<div>
						<h2 className="md:text-[1.75rem] text-2xl mb-4">Junior Pool</h2>
						{juniorPool.length === 0 ? (
							<div className="text-center">
								<p className="text-neutral-500 text-lg">
									No junior pool investments stats available. Explore
									opportunities here.
								</p>
							</div>
						) : (
							<div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
								{juniorPool.map((juniorPoolData) => (
									<PoolCard key={juniorPoolData.id} data={juniorPoolData} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvestorOverview;
<h2>InvestorOverview</h2>;
