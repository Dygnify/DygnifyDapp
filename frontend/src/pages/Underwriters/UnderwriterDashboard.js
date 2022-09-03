import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import Header from "../Layout/Header";
import BorrowIcon from "../../uiTools/Icons/BorrowIcon";
import ApprovalIcon from "../../uiTools/Icons/ApprovalIcon";

const UnderwriterDashboard = () => {
	const [borrow, setborrow] = useState(true);
	const [approval, setapproval] = useState(false);
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
					<ul className=" h-full overflow-y-auto w-60  text-white bg-darkmode-900 -mr-5">
						<li
							className={`font-medium text-center ${
								borrow ? "bg-[#3A3C43]" : ""
							} ${borrow ? "text-[#9281FF] " : "text-[#64748B]"}`}
						>
							<NavLink
								className="flex ml-9 py-4 gap-2"
								to="/underwriterDashboard"
								onClick={() => {
									if (borrow) {
										setborrow(false);
									} else {
										setborrow(true);
										setapproval(false);
									}
								}}
							>
								<span>
									<BorrowIcon color={borrow} />
								</span>
								Borrow request
							</NavLink>
						</li>
						<li
							className={`font-medium ${approval ? "bg-[#3A3C43]" : ""} ${
								approval ? "text-[#9281FF]" : "text-[#64748B]"
							}`}
						>
							<NavLink
								className="flex ml-9 py-4 gap-2"
								to="/underwriterDashboard/approvalHistory"
								onClick={() => {
									if (approval) {
										setapproval(false);
									} else {
										setapproval(true);
										setborrow(false);
									}
								}}
							>
								<span>
									<ApprovalIcon color={approval} />
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
