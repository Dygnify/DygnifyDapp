import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { PieChart } from "recharts";
import axiosHttpService from "../../services/axioscall";
import OverviewIcon from "../../pages/../uiTools/Icons/OverviewIcon";
import InvestIcon from "../../pages/../uiTools/Icons/InvestIcon";
import TransactionIcon from "../../pages/../uiTools/Icons/TransactionIcon";
import WithdrawIcon from "../../pages/../uiTools/Icons/WithdrawIcon";

import Header from "../Layout/Header";

const InvestorDashboardNew = () => {
	const [linkStatus, setLinkStatus] = useState(false);
	const [darkMode, setDarkMode] = useState(true);

	const handleChange = (e) => {
		setLinkStatus(e.target.checked);
	};

	return (
		<div className={`${darkMode ? "dark" : ""} `}>
			<div className="bg-white dark:bg-darkmode-900 text-black dark:text-white">
				<Header
					linkStatus={linkStatus}
					darkMode={darkMode}
					setDarkMode={setDarkMode}
				/>
				<div className="drawer drawer-mobile">
					<input
						id="dashboard-sidebar"
						type="checkbox"
						className="drawer-toggle"
						checked={linkStatus}
						onChange={handleChange}
					/>

					<div
						className={`py-4 drawer-content  ${
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
						<ul className="h-full  overflow-y-auto w-60  text-[#64748B] bg-darkmode-900 flex flex-col gap-2 lg:bg-transparent">
							<li className="font-medium text-center">
								<NavLink
									className="flex ml-8 py-4 gap-2"
									to="/investor-dashboard/overview"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									<span className="ml-6">
										<OverviewIcon />
									</span>
									Overview
								</NavLink>
							</li>
							<li className="font-medium text-center ">
								<NavLink
									className="flex ml-8 py-4 gap-2"
									to="/investor-dashboard/invest"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									<span className="ml-7">
										<InvestIcon />
									</span>
									Invest
								</NavLink>
							</li>
							<li className="font-medium text-center ">
								<NavLink
									className="flex ml-8 py-4 gap-2"
									to="/investor-dashboard/withdraw"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									<span className="ml-6">
										<WithdrawIcon />
									</span>
									Withdraw
								</NavLink>
							</li>
							<li className="font-medium text-center ">
								<NavLink
									className="flex ml-8 py-4 gap-2"
									to="/investor-dashboard/transaction"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									<span className="ml-6">
										<TransactionIcon />
									</span>
									Transaction
								</NavLink>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvestorDashboardNew;
