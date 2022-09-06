import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "../Layout/Header";
import OverviewIcon from "../../uiTools/Icons/OverviewIcon";
import BorIcon from "../../uiTools/Icons/BorIcon";
import TransactionIcon from "../../uiTools/Icons/TransactionIcon";
import UnderIcon from "../../uiTools/Icons/UnderIcon";
import ProfileIcon from "../../uiTools/Icons/ProfileIcon";

const BorrowerDashboard = () => {
	const [linkStatus, setLinkStatus] = useState(false);

	const [darkMode, setDarkMode] = useState(true);

	const handleChange = (e) => {
		setLinkStatus(e.target.checked);
	};

	return (
		<div className={`${darkMode ? "dark" : ""} `}>
			<div className="dark:bg-darkmode-900">
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
						className={`py-4 drawer-content text-white ${
							linkStatus ? "blur-sm lg:blur-none" : ""
						}`}
					>
						<div className="px-4 sm:px-6 md:px-8 lg:px-4 xl:px-8">
							<Outlet></Outlet>
						</div>
					</div>
					<div className="drawer-side border-r border-darkmode-800">
						<label
							htmlFor="dashboard-sidebar"
							className="drawer-overlay"
						></label>
						<ul className="h-full  overflow-y-auto w-60  text-[#64748B] bg-darkmode-900 flex flex-col gap-2 lg:bg-transparent">
							<li className="font-medium text-center">
								<NavLink
									to="/borrower_dashboard/overview"
									className="flex ml-8 py-4 gap-2"
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
							<li className="font-medium text-center">
								<NavLink
									to="/borrower_dashboard/borrow_list"
									className="flex ml-8 py-4 gap-2"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									<span className="ml-6">
										<BorIcon />
									</span>
									Borrow
								</NavLink>
							</li>
							<li className="font-medium text-center">
								<NavLink
									to="/borrower_dashboard/transaction"
									className="flex ml-8 py-4 gap-2"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									<span className="ml-6">
										<UnderIcon />
									</span>
									Transactions
								</NavLink>
							</li>

							<li className="font-medium text-center">
								<NavLink
									to="/borrower_dashboard/borrower_profile"
									className="flex ml-8 py-4 gap-2"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									<span className="ml-6">
										<ProfileIcon />
									</span>
									Profile
								</NavLink>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BorrowerDashboard;
