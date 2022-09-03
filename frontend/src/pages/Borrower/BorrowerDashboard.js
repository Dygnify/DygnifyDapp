import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../Layout/Header";

const BorrowerDashboard = () => {
	const [linkStatus, setLinkStatus] = useState(false);

	const handleChange = (e) => {
		setLinkStatus(e.target.checked);
	};

	return (
		<div className="bg-darkmode-900">
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
				<div className="drawer-side border-r border-darkmode-800">
					<label htmlFor="dashboard-sidebar" className="drawer-overlay"></label>
					<ul className="menu p-4 overflow-y-auto w-60  text-white bg-darkmode-900 lg:bg-transparent">
						<li>
							<Link
								to="/borrower_dashboard"
								onClick={() => {
									setLinkStatus(false);
								}}
							>
								Overview
							</Link>
						</li>
						<li>
							<Link
								to="/borrower_dashboard/borrow_list"
								onClick={() => {
									setLinkStatus(false);
								}}
							>
								Borrow
							</Link>
						</li>
						<li>
							<Link
								to="/borrower_dashboard/transaction"
								onClick={() => {
									setLinkStatus(false);
								}}
							>
								Transactions
							</Link>
						</li>
						{/* <li>
              <Link to="/borrower_dashboard/underwriterQueries">
                Underwriter queries
              </Link>
            </li> */}
						<li>
							<Link
								to="/borrower_dashboard/borrower_profile"
								onClick={() => {
									setLinkStatus(false);
								}}
							>
								Profile
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default BorrowerDashboard;
