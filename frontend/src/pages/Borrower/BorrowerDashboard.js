import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../Layout/Header";
import OverviewIcon from "../../uiTools/Icons/OverviewIcon";
import BorIcon from "../../uiTools/Icons/BorIcon";
import TransactionIcon from "../../uiTools/Icons/TransactionIcon";
import UnderIcon from "../../uiTools/Icons/UnderIcon";
import ProfileIcon from "../../uiTools/Icons/ProfileIcon";

const BorrowerDashboard = () => {
	const [Overview, setOverview] = useState(true);
	const [Borr, setBorr] = useState(false);
	const [Transaction, setTransaction] = useState(false);
	const [Under, setUnder] = useState(false);
	const [Profile, setProfile] = useState(false);

	return (
		<div style={{ backgroundColor: "#14171F" }}>
			<Header />
			<div className="drawer drawer-mobile">
				<input
					id="dashboard-sidebar"
					type="checkbox"
					className="drawer-toggle"
				/>
				<div className="mt-6 drawer-content text-white">
					<div className="px-5">
						<Outlet></Outlet>
					</div>
				</div>
				<div
					style={{ borderRight: "1px solid #20232A" }}
					className="drawer-side"
				>
					<label htmlFor="dashboard-sidebar" className="drawer-overlay"></label>
					<ul className="h-full overflow-y-auto w-60  text-white bg-darkmode-900 -mr-5">
						<li
							className={`font-medium text-center ${
								Overview ? "bg-[#3A3C43]" : ""
							} ${Overview ? "text-[#9281FF] " : "text-[#64748B]"}`}
						>
							<Link
								className="flex ml-6 py-4 gap-2"
								to="/borrower_dashboard"
								onClick={() => {
									if (Overview) {
										setOverview(false);
									} else {
										setOverview(true);
										setTransaction(false);
										setBorr(false);
										setProfile(false);
										setUnder(false);
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
								Borr ? "bg-[#3A3C43]" : ""
							} ${Borr ? "text-[#9281FF] " : "text-[#64748B]"}`}
						>
							<Link
								className="flex ml-6 py-4 gap-2"
								to="/borrower_dashboard/borrow_list"
								onClick={() => {
									if (Borr) {
										setBorr(false);
									} else {
										setBorr(true);
										setTransaction(false);
										setOverview(false);
										setProfile(false);
										setUnder(false);
									}
								}}
							>
								<span className="ml-6">
									<BorIcon color={Borr} />
								</span>
								Borrow
							</Link>
						</li>
						<li
							className={`font-medium text-center ${
								Transaction ? "bg-[#3A3C43]" : ""
							} ${Transaction ? "text-[#9281FF] " : "text-[#64748B]"}`}
						>
							<Link
								className="flex ml-6 py-4 gap-2"
								to="/borrower_dashboard/transaction"
								onClick={() => {
									if (Transaction) {
										setTransaction(false);
									} else {
										setTransaction(true);
										setBorr(false);
										setOverview(false);
										setProfile(false);
										setUnder(false);
									}
								}}
							>
								<span className="ml-6">
									<TransactionIcon color={Transaction} />
								</span>
								Transactions
							</Link>
						</li>
						{/* <li>
              <Link to="/borrower_dashboard/underwriterQueries">
                Underwriter queries
              </Link>
            </li> */}
						<li
							className={`font-medium text-center ${
								Profile ? "bg-[#3A3C43]" : ""
							} ${Profile ? "text-[#9281FF] " : "text-[#64748B]"}`}
						>
							<Link
								className="flex ml-6 py-4 gap-2"
								to="/borrower_dashboard/borrower_profile"
								onClick={() => {
									if (Profile) {
										setProfile(false);
									} else {
										setProfile(true);
										setBorr(false);
										setOverview(false);
										setTransaction(false);
										setUnder(false);
									}
								}}
							>
								<span className="ml-6">
									<ProfileIcon color={Profile} />
								</span>
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
