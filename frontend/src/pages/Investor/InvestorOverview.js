import { useState, useEffect } from "react";
import PoolCard from "./components/Cards/PoolCard";
import GradientButtonHeader from "../../uiTools/Button/GradientButtonHeader";
import {
	getAllWithdrawableOpportunities,
	getUserSeniorPoolInvestment,
	getWalletBal,
	getSeniorPoolDisplaySharePrice,
	getTotalInvestmentOfInvestor,
	getTotalYieldOfInvestor,
	getJuniorWithdrawableOp,
} from "../../components/transaction/TransactionHelper";
import { useNavigate } from "react-router-dom";
import DoughnutChart from "../Components/DoughnutChart";
import LineChart from "./components/LineChart";
import { retrieveFiles } from "../../services/web3storageIPFS";
import { getBinaryFileData } from "../../services/fileHelper";
import { getDisplayAmount } from "../../services/displayTextHelper";
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
		setTotalInvestment(amount);
		let yieldEarned = await getTotalYieldOfInvestor();
		setTotalYield(yieldEarned);
	}

	useEffect(() => {
		getUserSeniorPoolInvestment()
			.then((data) => {
				setSeniorPoolInvestment(data);
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
		setJuniorPool(junorPools);
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
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl w-[50%]">
						Investor's Dashboard,
					</h2>
					<GradientButtonHeader
						onClick={() => path("/investor-dashboard/invest")}
						className="ml-auto"
					>
						+ Invest
					</GradientButtonHeader>
				</div>

				{/* parent div */}
				<div className="flex flex-col md:flex-row gap-6 2xl:justify-around">
					{/* child 1 */}
					<div className="flex flex-col gap-4 bg-gradient-to-br from-[#282828] to-[#00000028] px-4 py-4 rounded-xl md:flex-row sm:px-[4vw] md:pl-2 md:pr-[1.5vw] md:gap-3 lg:px-[1vw] xl:px-[1vw] xl:gap-8 md:w-1/2 2xl:w-[40rem] 2xl:items-center">
						<div className="flex flex-col items-center gap-2 md:items-start">
							<h2 className="text-lg font-bold text-[#64748B] sm:text-2xl md:text-xl 2xl:text-2xl">
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

						<div className="flex flex-col gap-3 md:ml-auto justify-center">
							<div className="flex items-center md:flex-col md:items-start">
								<p className="text-base text-[#64748B] sm:text-lg xl:text-xl 2xl:text-2xl">
									Total amount invested
								</p>

								<div className="ml-auto text-2xl md:ml-0 xl:text-3xl 2xl:text-4xl">
									{totalInvestment === 0 ? "- -" : totalInvestment + "USDC"}
								</div>
							</div>

							<div className="flex items-center md:flex-col md:items-start">
								<p className="text-base text-[#64748B] sm:text-lg xl:text-xl 2xl:text-2xl">
									Total Yield Earned
								</p>

								<div className="ml-auto text-2xl md:ml-0 xl:3xl 2xl:text-4xl">
									{totalYield === 0 ? "- -" : totalYield + "USDC"}
								</div>
							</div>
						</div>
					</div>

					{/* child 2 */}
					<div className="bg-gradient-to-br from-[#282828] to-[#00000028] md:w-1/2 px-2 py-4 flex flex-col gap-4 rounded-xl 2xl:w-[40rem] 2xl:justify-center xl:px-6 ">
						<p className="text-xl font-semibold sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl sm:px-4">
							Growth of investment on reinvesting everything for
						</p>
						<LineChart />
					</div>
				</div>
				<div style={{ fontSize: 23 }} className="mt-5 mb-3">
					<h1>Your Investments</h1>

					<div>
						<h2 style={{ fontSize: 24 }} className=" mb-5">
							Senior Pool
						</h2>
						{seniorPool ? (
							<div className="mb-16 w-1/2 ">
								<div style={{ display: "flex" }} className="gap-4">
									<PoolCard data={seniorPool} />
								</div>
							</div>
						) : (
							<div style={{ display: "flex" }} className="justify-center">
								<div
									style={{
										color: "#64748B",
										fontSize: 18,
										margin: "50px 0",
									}}
								>
									No senior pool investments stats available. Explore
									opportunities here.
								</div>
							</div>
						)}
					</div>

					<div>
						<h2 style={{ fontSize: 24 }} className=" mb-5">
							Junior Pool
						</h2>
						{juniorPool.length === 0 ? (
							<div style={{ display: "flex" }} className="justify-center">
								<div
									style={{
										color: "#64748B",
										fontSize: 18,
										margin: "50px 0 ",
									}}
								>
									No junior pool investments stats available. Explore
									opportunities here.
								</div>
							</div>
						) : (
							<div className="mb-16">
								<div style={{ display: "flex" }} className=" gap-4">
									{juniorPool.map((juniorPoolData) => (
										<PoolCard key={juniorPoolData.id} data={juniorPoolData} />
									))}
								</div>
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
