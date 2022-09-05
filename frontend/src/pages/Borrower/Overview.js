import React, { useState, useEffect } from "react";
import DrawdownCard from "./Components/Cards/DrawdownCard";
import DueDateCard from "./Components/Cards/DueDateCard";
import RepaymentCard from "./Components/Cards/RepaymentCard";
import LoanFormModal from "./Components/Modal/LoanFormModal";
import DashboardHeader from "./DashboardHeader";
import { getBorrowerDetails } from "../../services/BackendConnectors/userConnectors/borrowerConnectors";
import { getUserWalletAddress } from "../../services/BackendConnectors/userConnectors/commonConnectors";
import { getDrawdownOpportunities } from "../../services/BackendConnectors/opportunityConnectors";
import { getOpportunitiesWithDues } from "../../services/BackendConnectors/opportunityConnectors";
import DoughnutChart from "../Components/DoughnutChart";
import ProcessingRequestModal from "./Components/Modal/ProcessingModal";
import Loader from "../../uiTools/Loading/Loader";

import { getDisplayAmount } from "../../services/Helpers/displayTextHelper";
import KycCheckModal from "./Components/Modal/KycCheckModal";
import axiosHttpService from "../../services/axioscall";
import { kycOptions } from "../../services/KYC/blockpass";
import ProcessingDrawdownModal from "./Components/Modal/processingDrawdownModal";
import ProcessingRepaymentModal from "./Components/Modal/ProcessingRepaymentModal";

const Overview = () => {
	const [drawdownList, setDrawdownList] = useState([]);
	const [repaymentList, setRepaymentList] = useState([]);
	const [totalBorrowedAmt, setTotalBorrowedAmt] = useState("--");
	const [totalOutstandingAmt, setTotalOutstandingAmt] = useState("--");
	const [totalRepaidAmt, setTotalRepaidAmt] = useState("--");
	const [totalLoanAmtWithInterest, setTotalLoanAmtWithInterest] = useState(0);
	const [nextDueDate, setNextDueDate] = useState();
	const [nextDueAmount, setNextDueAmount] = useState();
	const [selected, setSelected] = useState(null);
	const [kycSelected, setKycSelected] = useState();
	const [kycStatus, setKycStatus] = useState();
	const [profileStatus, setProfileStatus] = useState();
	const [borrowReqProcess, setBorrowReqProcess] = useState(false);
	const [processModal, setProcessModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadDrawdownList, setLoadDrawdownList] = useState();
	const [loadRepaymentList, setLoadRepaymentList] = useState();
	const [processDrawdown, setProcessDrawdown] = useState();
	const [openProcessDrawdown, setOpenProcessDrawdown] = useState();
	const [openProcessRepayment, setOpenProcessRepayment] = useState();
	const [processRepayment, setProcessRepayment] = useState();

	const handleForm = () => {
		setSelected(null);
		setKycSelected(null);
	};

	const cutProcessModal = () => {
		console.log("kadl");
		setSelected(null);
		setProcessModal(null);
		setOpenProcessDrawdown(null);
	};

	useEffect(() => {
		const fetchData = async () => {
			let opportunities = await getDrawdownOpportunities();
			if (opportunities && opportunities.length) {
				console.log("************", opportunities);
				setDrawdownList(opportunities);
			}

			setLoading(false);
		};
		fetchData();
		getUserWalletAddress().then((address) => checkForKycAndProfile(address));
	}, [loadDrawdownList]);

	function sortByProperty(property) {
		return function (a, b) {
			if (a[property] < b[property]) return 1;
			else if (a[property] > b[property]) return -1;

			return 0;
		};
	}

	const checkForKycAndProfile = async (refId) => {
		try {
			const result = await axiosHttpService(kycOptions(refId));

			if (result.res.status === "success") setKycStatus(true);
			if (result.res.status === "error") {
				setKycStatus(false);
			}

			getBorrowerDetails().then((borrowerCID) => {
				console.log(borrowerCID);
				if (borrowerCID) setProfileStatus(true);
				else {
					setProfileStatus(false);
				}

				setLoading(false);
			});
		} catch (error) {
			console.log(error);
		}
	};

	// get all upcoming reapayments
	useEffect(() => {
		const fetchData = async () => {
			let opportunities = await getOpportunitiesWithDues();
			if (opportunities && opportunities.length) {
				//sort the list based on date
				opportunities.sort(sortByProperty("epochDueDate"));
				setRepaymentList(opportunities);

				// set next due date and amount
				setNextDueAmount(opportunities[0].repaymentAmount);
				setNextDueDate(opportunities[0].nextDueDate);

				console.log(repaymentList, nextDueAmount);
			}
		};
		fetchData();
	}, [loadRepaymentList]);

	useEffect(() => {
		// set total borrowed amount
		let totalLoanAmt = 0;
		let totalLoanWithIntAmount = 0;
		let totalRepaidAmt = 0;
		for (const op of repaymentList) {
			let loanAmt = parseFloat(op.actualLoanAmount);
			totalLoanAmt += loanAmt;
			totalLoanWithIntAmount +=
				loanAmt +
				parseFloat((loanAmt * parseFloat(op.loanActualInterest)) / 100);
			totalRepaidAmt += op.totalRepaidAmount;
		}
		if (totalLoanAmt > 0) {
			setTotalBorrowedAmt("$" + getDisplayAmount(totalLoanAmt));
		}

		totalRepaidAmt = totalRepaidAmt ? totalRepaidAmt : 0;
		if (totalRepaidAmt > 0) {
			setTotalRepaidAmt({
				amount: totalRepaidAmt,
				displayTotalRepaidAmt: getDisplayAmount(totalRepaidAmt),
			});
		}
		if (totalLoanWithIntAmount) {
			setTotalLoanAmtWithInterest(totalLoanWithIntAmount);
			setTotalOutstandingAmt(
				getDisplayAmount(totalLoanWithIntAmount - totalRepaidAmt)
			);
		}
	}, [repaymentList]);

	return (
		<>
			{loading && <Loader />}
			<div className={`${loading ? "blur-sm" : ""}`}>
				<DashboardHeader
					setSelected={setSelected}
					kycStatus={kycStatus}
					profileStatus={profileStatus}
					setKycSelected={setKycSelected}
				/>
				{selected && (
					<LoanFormModal
						key={drawdownList?.id}
						data={drawdownList}
						handleForm={handleForm}
						setBorrowReqProcess={setBorrowReqProcess}
						setSelected={setSelected}
						setProcessModal={setProcessModal}
					/>
				)}

				{processModal && (
					<ProcessingRequestModal
						borrowReqProcess={borrowReqProcess}
						setSelected={setSelected}
						handleDrawdown={cutProcessModal}
						setProcessModal={setProcessModal}
						processModal={processModal}
					/>
				)}

				{kycSelected ? (
					<KycCheckModal kycStatus={kycStatus} profileStatus={profileStatus} />
				) : (
					<></>
				)}

				<div className="mt-6 lg:mt-12 flex flex-col gap-4 md:flex-row">
					<div className="card-gradient px-4 sm:px-6 md:px-3 pt-6 pb-3 rounded-xl md:flex flex-col justify-center md:w-[20%] lg:w-[25%]">
						{totalBorrowedAmt ? (
							<div className="font-bold flex items-end gap-2 text-xl">
								<h3 className="text-2xl md:text-4xl xl:text-5xl text-gradient">
									{totalBorrowedAmt}
								</h3>
								<p className="text-xl text-gradient">
									{process.env.REACT_APP_TOKEN_NAME}
								</p>
							</div>
						) : (
							<p>--</p>
						)}

						<p className="font-semibold text-neutral-500 text-sm lg:text-base">
							Total Amount Borrowed
						</p>
					</div>

					<div className="card-gradient pt-3 pb-4  rounded-xl  md:w-[60%] lg:w-[50%]">
						<div className="hidden md:block">
							<h2 className="text-neutral-500 font-semibold text-base md:text-xl px-5">
								Active loans distribution
							</h2>
						</div>
						<div className="flex flex-col gap-8 md:flex-row-reverse md:justify-between md:gap-[3vw] md:items-center md:px-5">
							<div className=" flex flex-col gap-3 items-center md:block ">
								<h2 className="text-neutral-500 font-semibold text-xl md:hidden">
									Active loans distribution
								</h2>
								{totalLoanAmtWithInterest || totalRepaidAmt.amount ? (
									<DoughnutChart
										data={[
											totalLoanAmtWithInterest,
											totalRepaidAmt.amount ? totalRepaidAmt.amount : 0,
										]}
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

							<div className="px-4 sm:px-6 flex flex-col gap-2 md:px-0 md:py-2">
								<div className="flex flex-col gap-3 md:gap-2">
									<div className="flex md:flex-col gap-1 items-end md:items-start">
										<p className="text-neutral-400 flex gap-1 items-center">
											<span className="inline-block w-3 h-2 bg-gradient-to-r from-[#4B74FF] to-primary-500 rounded-3xl"></span>
											Total Outstanding
										</p>
										<div className="ml-auto font-semibold md:ml-0 flex md:flex-col gap-2 items-end md:items-start px-4">
											<h3 className="text-2xl">{totalOutstandingAmt}</h3>
											<p className="">{process.env.REACT_APP_TOKEN_NAME}</p>
										</div>
									</div>

									<div className="flex md:flex-col gap-1 items-end md:items-start">
										<p className="text-neutral-400 flex gap-1 items-center">
											<span className="inline-block w-3 h-2 bg-white rounded-3xl"></span>
											Total Repaid
										</p>
										<div className="ml-auto font-semibold md:ml-0 flex md:flex-col gap-2 items-end md:items-start px-4">
											<h3 className="text-2xl">
												{totalRepaidAmt?.displayTotalRepaidAmt}
											</h3>
											<p className="">{process.env.REACT_APP_TOKEN_NAME}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-4 md:w-[20%] lg:w-[25%]">
						<div className="card-gradient py-4 rounded-xl px-4 sm:px-6 md:h-[50%]">
							{nextDueAmount ? (
								<div className="font-bold text-primary-500 flex items-end gap-2 text-xl">
									<h3 className="text-3xl">{nextDueAmount}</h3>
									{process.env.REACT_APP_TOKEN_NAME}
								</div>
							) : (
								<p>- -</p>
							)}
							<p className="text-neutral-500 text-[0.875rem]">
								Next Due Amount
							</p>
						</div>

						<div className="card-gradient py-4 rounded-xl px-4 sm:px-6 md:h-[50%]">
							{nextDueDate ? (
								<h3 className="font-bold text-3xl text-primary-500">
									{nextDueDate}
								</h3>
							) : (
								<p>- -</p>
							)}
							<p className="text-neutral-500 text-[0.875rem]">Next Due Date</p>
						</div>
					</div>
				</div>
				<div className="mb-16 text-xl">
					<h2 className="mb-2">Repayment Notification</h2>
					{repaymentList.length === 0 ? (
						<div
							style={{ display: "flex", marginTop: 20 }}
							className="justify-center"
						>
							<div style={{ color: "#64748B", fontSize: 18 }}>
								No repayment available.
							</div>
						</div>
					) : (
						<div style={{ display: "flex" }} className="gap-4">
							{repaymentList.map((item) => (
								<RepaymentCard
									key={item.id}
									data={item}
									loadRepaymentList={setLoadRepaymentList}
									setOpenProcessRepayment={setOpenProcessRepayment}
									setProcessRepayment={setProcessRepayment}
								/>
							))}
						</div>
					)}

					{openProcessRepayment && (
						<ProcessingRepaymentModal processRepayment={processRepayment} />
					)}
				</div>
				<div className="mb-16">
					<h2 className="mb-2 text-xl">Drawdown Funds</h2>

					{drawdownList.length === 0 ? (
						<div
							style={{ display: "flex", marginTop: 20 }}
							className="justify-center"
						>
							<div style={{ color: "#64748B", fontSize: 18 }}>
								No drawdown available.
							</div>
						</div>
					) : (
						<div style={{ display: "flex" }} className=" gap-4">
							{drawdownList.map((item) => (
								<DrawdownCard
									key={item.id}
									data={item}
									loadDrawdownList={setLoadDrawdownList}
									setOpenProcessDrawdown={setOpenProcessDrawdown}
									setProcessDrawdown={setProcessDrawdown}
								/>
							))}
						</div>
					)}

					{openProcessDrawdown ? (
						<ProcessingDrawdownModal
							processDrawdown={processDrawdown}
							handleDrawdown={cutProcessModal}
						/>
					) : (
						<></>
					)}
				</div>
				<div className="mb-16">
					<h2 className="mb-2 text-xl">Upcoming Due Dates</h2>
					<div className="collapse mb-3">
						<input type="checkbox" className="peer" />
						<div
							style={{
								display: "flex",
								borderTop: "1px solid #20232A",
								borderBottom: "1px solid #20232A",
							}}
							className="collapse-title text-md font-light justify-around w-full"
						>
							<p className="w-1/4 text-center">Pool Name</p>
							<p className="w-1/4 text-center">Capital Borrowed</p>
							<p className="w-1/4 text-center">Amount Due</p>
							<p className="w-1/4 text-center">Due Date</p>
						</div>
					</div>
					{repaymentList.length === 0 ? (
						<div
							style={{ display: "flex", marginTop: 40 }}
							className="justify-center"
						>
							<div style={{ color: "#64748B", fontSize: 18 }}>
								No due dates available.
							</div>
						</div>
					) : (
						<div>
							{repaymentList.map((item) => (
								<DueDateCard key={item.id} data={item} />
							))}
						</div>
					)}
				</div>
				<br />
				<br />
				<br />
				<br />
			</div>
		</>
	);
};

export default Overview;
