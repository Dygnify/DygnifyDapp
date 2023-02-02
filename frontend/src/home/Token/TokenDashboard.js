import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Header from "../../pages/Layout/Header";

const TokenDashboard = () => {
	const [linkStatus, setLinkStatus] = useState(false);
	const [darkMode, setDarkMode] = useState(true);

	const handleChange = (e) => {
		setLinkStatus(e.target.checked);
	};

	return (
		<div className={` ${darkMode ? "dark" : ""}`}>
			<div className="bg-neutral-50 dark:bg-darkmode-900 text-neutral-700 dark:text-white">
				<Header
					linkStatus={linkStatus}
					darkMode={darkMode}
					setDarkMode={setDarkMode}
				/>
				<div className="drawer drawer-mobile border-t-[1px] border-t-[#B8C0CC] dark:border-t-[#20232A]">
					<input
						id="dashboard-sidebar"
						type="checkbox"
						className="drawer-toggle"
						checked={linkStatus}
						onChange={handleChange}
					/>

					<div
						className={`drawer-content  ${
							linkStatus ? "blur-sm lg:blur-none" : ""
						}`}
					>
						<div className="bg-neutral-50 dark:bg-darkmode-900 text-neutral-700 dark:text-white">
							<Outlet></Outlet>
						</div>
					</div>

					<div className="drawer-side border-r border-neutral-300 dark:border-darkmode-800">
						<label
							htmlFor="dashboard-sidebar"
							className="drawer-overlay"
						></label>
						<ul className="h-full py-4  overflow-y-auto w-60  text-[#64748B] bg-neutral-50 dark:bg-darkmode-900 flex flex-col gap-2 lg:bg-transparent lg:dark:bg-transparent">
							<li className="font-medium text-center">
								<NavLink
									className="flex pl-10 py-4 gap-2"
									to="/tokenDashboard/opportunityContract"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									Opportunity Origination
								</NavLink>
							</li>
							<li className="font-medium text-center ">
								<NavLink
									className="flex pl-10 py-4 gap-2"
									to="/tokenDashboard/seniorPoolContract"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									Senior Pool
								</NavLink>
							</li>
							<li className="font-medium text-center ">
								<NavLink
									className="flex pl-10 py-4 gap-2"
									to="/tokenDashboard/juniorPoolContract"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									Junior Pool
								</NavLink>
							</li>
							<li className="font-medium text-center ">
								<NavLink
									className="flex pl-10 py-4 gap-2"
									to="/tokenDashboard/testUSDC"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									Test USDC
								</NavLink>
							</li>
							<li className="font-medium text-center ">
								<NavLink
									className="flex pl-10 py-4 gap-2"
									to="/tokenDashboard/multisig"
									onClick={() => {
										setLinkStatus(false);
									}}
								>
									MultiSign
								</NavLink>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TokenDashboard;
