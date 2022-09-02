import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { PieChart } from "recharts";
import axiosHttpService from "../../services/axioscall";
import OverviewIcon from "../../pages/../uiTools/Icons/OverviewIcon";
import InvestIcon from "../../pages/../uiTools/Icons/InvestIcon";
import TransactionIcon from "../../pages/../uiTools/Icons/TransactionIcon";
import WithdrawIcon from "../../pages/../uiTools/Icons/WithdrawIcon";

import Header from "../Layout/Header";

const InvestorDashboardNew = () => {
	const [linkStatus, setLinkStatus] = useState(false);
	const [Overview, setOverview] = useState(true);
	const [Invest, setInvest] = useState(false);
	const [Transaction, setTransaction] = useState(false);
	const [Withdrow, setWithdrow] = useState(false);

	const handleChange = (e) => {
		setLinkStatus(e.target.checked);
	};

	return (
		<>
			<div style={{ backgroundColor: "#14171F" }}>
				<Header linkStatus={linkStatus} />
				<div className="drawer drawer-mobile">
					<input
						id="dashboard-sidebar"
						type="checkbox"
						className="drawer-toggle"
						checked={linkStatus}
						onChange={handleChange}
					/>

					<div
						className={`py-4 drawer-content text-white ${
							linkStatus ? "blur-sm lg:blur-none" : ""
						}`}
					>
						<div className="px-4 sm:px-6 md:px-8 lg:px-4 xl:px-8">
							<Outlet></Outlet>
						</div>
					</div>

					<div
						style={{ borderRight: "1px solid #20232A" }}
						className="drawer-side"
					>
						<label
							htmlFor="dashboard-sidebar"
							className="drawer-overlay"
						></label>
						<ul className="h-full  overflow-y-auto w-60  text-white bg-darkmode-900 -mr-5">
							<li
								className={`font-medium text-center ${
									Overview ? "bg-[#3A3C43]" : ""
								} ${Overview ? "text-[#9281FF] " : "text-[#64748B]"}`}
							>
								<Link
									className="flex ml-8 py-4 gap-2"
									to="/investor-dashboard"
									onClick={() => {
										setLinkStatus(false);
										if (Overview) {
											setOverview(false);
										} else {
											setOverview(true);
											setTransaction(false);
											setWithdrow(false);
											setInvest(false);
										}
									}}
								>
									<span className="ml-6">
										<OverviewIcon color={Overview} />
									</span>
									Overview
								</Link>
							</li>
							<li
								className={`font-medium text-center ${
									Invest ? "bg-[#3A3C43]" : ""
								} ${Invest ? "text-[#9281FF] " : "text-[#64748B]"}`}
							>
								<Link
									className="flex ml-8 py-4 gap-2"
									to="/investor-dashboard/invest"
									onClick={() => {
										setLinkStatus(false);
										if (Invest) {
											setInvest(false);
										} else {
											setInvest(true);
											setTransaction(false);
											setWithdrow(false);
											setOverview(false);
										}
									}}
								>
									<span className="ml-7">
										<InvestIcon color={Invest} />
									</span>
									Invest
								</Link>
							</li>
							<li
								className={`font-medium text-center ${
									Transaction ? "bg-[#3A3C43]" : ""
								} ${Transaction ? "text-[#9281FF] " : "text-[#64748B]"}`}
							>
								<Link
									className="flex ml-8 py-4 gap-2"
									to="/investor-dashboard/withdraw"
									onClick={() => {
										setLinkStatus(false);
										if (Transaction) {
											setTransaction(false);
										} else {
											setInvest(false);
											setTransaction(true);
											setWithdrow(false);
											setOverview(false);
										}
									}}
								>
									<span className="ml-6">
										<WithdrawIcon color={Transaction} />
									</span>
									Withdraw
								</Link>
							</li>
							<li
								className={`font-medium text-center ${
									Withdrow ? "bg-[#3A3C43]" : ""
								} ${Withdrow ? "text-[#9281FF] " : "text-[#64748B]"}`}
							>
								<Link
									className="flex ml-8 py-4 gap-2"
									to="/investor-dashboard/transaction"
									onClick={() => {
										setLinkStatus(false);
										if (Withdrow) {
											setWithdrow(false);
										} else {
											setInvest(false);
											setTransaction(false);
											setWithdrow(true);
											setOverview(false);
										}
									}}
								>
									<span className="ml-6">
										<TransactionIcon color={Withdrow} />
									</span>
									Transaction
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default InvestorDashboardNew;
