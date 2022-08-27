import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { PieChart } from "recharts";
import axiosHttpService from "../../services/axioscall";

import Header from "../Layout/Header";

const InvestorDashboardNew = () => {
	const [linkStatus, setLinkStatus] = useState(false);

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
							linkStatus ? "blur-lg lg:blur-none" : ""
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
						<ul className="menu p-4 overflow-y-auto w-60  text-white bg-darkmode-900">
							<li>
								<Link to="/investor-dashboard">Overview</Link>
							</li>
							<li>
								<Link to="/investor-dashboard/invest">Invest</Link>
							</li>
							<li>
								<Link to="/investor-dashboard/withdraw">Withdraw</Link>
							</li>
							<li>
								<Link to="/investor-dashboard/transaction">Transaction</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default InvestorDashboardNew;
