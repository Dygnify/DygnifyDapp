import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getTrimmedWalletAddress } from "../../../../services/Helpers/displayTextHelper";

const ProcessingRepaymentModal = ({
	processRepayment,
	handleRepayment,
	transactionId,
	walletAddress,
}) => {
	console.log(processRepayment, "in fund process modal");

	const navigate = useNavigate();

	return (
		<>
			<input
				type="checkbox"
				id="RepaymentProcessModal"
				className="modal-toggle"
			/>
			<div
				style={{ backdropFilter: "brightness(40%) blur(8px)" }}
				className="modal"
			>
				<div
					style={{ backgroundColor: "#20232A", borderRadius: "16px" }}
					className="modal-box w-1/3 max-w-5xl p-0"
				>
					<label
						for="RepaymentProcessModal"
						className="btn btn-ghost absolute right-2 top-2 pb-2"
						onClick={() => handleRepayment()}
					>
						✕
					</label>
					<h3
						style={{ borderBottom: "2px solid #292C33" }}
						className="font-bold text-lg py-3 px-4"
					>
						Repayment
					</h3>
					<p
						style={{
							display: "flex",
							fontSize: 55,
							fontWeight: 600,
							margin: "25px 0px",
						}}
						className="justify-center"
					>
						{!processRepayment ? `Yay!🎉` : "In Progress⏱"}
					</p>
					<p
						style={{ display: "flex", fontSize: 14, fontWeight: 600 }}
						className="justify-center mb-2"
					>
						{processRepayment
							? "Repayment of 10,000 USDC of pool poolName is under progress. "
							: "You successfully repaid 10,000 USDC of pool poolName"}
					</p>

					<div
						className="text-sm py-3 px-4 rounder-box items-center "
						style={{
							width: 400,
							height: 169,
							marginLeft: 24,
							borderRadius: 12,
							borderWidth: 1,
							borderColor: "#64748B",
							alignSelf: "center",
						}}
					>
						<div
							class="flex-col grid grid-cols-1 divide-y-2  justify-center divide-[#292C33] "
							style={{ display: "flex" }}
						>
							<div
								className="flex-row justify-between pt-0"
								style={{ display: "flex" }}
							>
								<div style={{ display: "flex" }} className="flex-col">
									<small
										style={{
											fontSize: 14,
											fontWeight: 400,
											color: "#777E91",
										}}
									>
										Status
									</small>
									{processRepayment ? (
										<p style={{ fontSize: 14, color: "#FBBF24" }}>Processing</p>
									) : (
										<p style={{ fontSize: 14, color: "#58BD7D" }}>Completed</p>
									)}
								</div>
								<div style={{ display: "flex" }} className="flex-col">
									<small
										style={{
											fontSize: 14,
											fontWeight: 400,
											color: "#777E91",
										}}
									>
										Transaction ID
									</small>
									<p style={{ fontSize: 14, color: "white" }}>
										{transactionId
											? getTrimmedWalletAddress(transactionId,25)
											: "--"}
									</p>
								</div>
							</div>
							<div>
								<br />
								<small
									style={{
										fontSize: 14,
										fontWeight: 400,
										color: "#777E91",
									}}
								>
									Receipient's wallet address
								</small>
								<p style={{ fontSize: 14, color: "white" }}>
									{walletAddress
										? getTrimmedWalletAddress(walletAddress,25)
										: "--"}
								</p>
							</div>
						</div>
					</div>

					<div
						className="modal-action mx-4 mt-2 mb-4 text-sm py-3 px-4 items-center justify-center"
						style={{
							width: 400,
							height: 45,
							marginLeft: 24,
							borderRadius: 100,
							borderWidth: 1,
							borderColor: "#64748B",
							alignSelf: "center",
							display: "flex",
						}}
						onClick={() => navigate("/borrower_dashboard/transaction")}
					>
						<p>View Transaction</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProcessingRepaymentModal;
