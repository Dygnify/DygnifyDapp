import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import Header from "../Layout/Header";
import BorrowIcon from "../../uiTools/Icons/BorrowIcon";
import ApprovalIcon from "../../uiTools/Icons/ApprovalIcon";

const UnderwriterDashboard = () => {
	const [linkStatus, setLinkStatus] = useState(false);

	const handleChange = (e) => {
		setLinkStatus(e.target.checked);
	};

	return (
		<div className="bg-[#14171F]">
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
					className={`mt-6 drawer-content text-white ${
						linkStatus ? "blur-sm lg:blur-none" : ""
					}`}
				>
					<div className="px-5">
						<Outlet></Outlet>
					</div>
				</div>

				<div className="drawer-side  border-r-[#20232A] border-r-[1px]">
					<label htmlFor="dashboard-sidebar" className="drawer-overlay"></label>
					<ul className=" h-full  overflow-y-auto w-60  text-[#64748B] bg-darkmode-900 flex flex-col gap-2 lg:bg-transparent">
						<li className="font-medium text-center">
							<NavLink
								className="flex ml-8 py-4 gap-2"
								to="/underwriterDashboard/borrowRequest"
								onClick={() => {
									setLinkStatus(false);
								}}
							>
								<span className="ml-7">
									<BorrowIcon />
								</span>
								Borrow request
							</NavLink>
						</li>
						<li className="font-medium text-center">
							<NavLink
								className="flex ml-8 py-4 gap-2"
								to="/underwriterDashboard/approvalHistory"
								onClick={() => {
									setLinkStatus(false);
								}}
							>
								<span className="ml-7">
									<ApprovalIcon />
								</span>
								Approval history
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default UnderwriterDashboard;
