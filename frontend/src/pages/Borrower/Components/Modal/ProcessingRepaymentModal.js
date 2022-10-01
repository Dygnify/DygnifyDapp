import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getTrimmedWalletAddress } from "../../../../services/Helpers/displayTextHelper";
import { getDisplayAmount } from "../../../../services/Helpers/displayTextHelper";

const ProcessingRepaymentModal = ({
	processRepayment,
	transactionId,
	walletAddress,
	poolName,
	amounts,
}) => {
	console.log(processRepayment, "in fund process modal");

	const navigate = useNavigate();

	return (
		// <>
		// 	<input
		// 		type="checkbox"
		// 		id="RepaymentProcessModal"
		// 		className="modal-toggle"
		// 	/>
		// 	<div
		// 		style={{ backdropFilter: "brightness(40%) blur(8px)" }}
		// 		className="modal"
		// 	>
		// 		<div
		// 			style={{ backgroundColor: "#20232A", borderRadius: "16px" }}
		// 			className="modal-box w-1/3 max-w-5xl p-0"
		// 		>
		// 			<label
		// 				for="RepaymentProcessModal"
		// 				className="btn btn-ghost absolute right-2 top-2 pb-2"
		// 			>
		// 				✕
		// 			</label>
		// 			<h3
		// 				style={{ borderBottom: "2px solid #292C33" }}
		// 				className="font-bold text-lg py-3 px-4"
		// 			>
		// 				Repayment
		// 			</h3>
		// 			<p
		// 				style={{
		// 					display: "flex",
		// 					fontSize: 55,
		// 					fontWeight: 600,
		// 					margin: "25px 0px",
		// 				}}
		// 				className="justify-center"
		// 			>
		// 				{!processRepayment ? `Yay!🎉` : "In Progress⏱"}
		// 			</p>
		// 			<p
		// 				style={{ display: "flex", fontSize: 14, fontWeight: 600 }}
		// 				className="justify-center mb-2"
		// 			>
		// 				{processRepayment
		// 					? `Repayment of ${getDisplayAmount(
		// 							amounts
		// 					  )} USDC of pool ${poolName} is under progress. `
		// 					: `You successfully repaid ${getDisplayAmount(
		// 							amounts
		// 					  )} USDC of pool ${poolName}`}
		// 			</p>

		// 			<div
		// 				className="text-sm py-3 px-4 rounder-box items-center "
		// 				style={{
		// 					width: 400,
		// 					height: 169,
		// 					marginLeft: 24,
		// 					borderRadius: 12,
		// 					borderWidth: 1,
		// 					borderColor: "#64748B",
		// 					alignSelf: "center",
		// 				}}
		// 			>
		// 				<div
		// 					class="flex-col grid grid-cols-1 divide-y-2  justify-center divide-[#292C33] "
		// 					style={{ display: "flex" }}
		// 				>
		// 					<div
		// 						className="flex-row justify-between pt-0"
		// 						style={{ display: "flex" }}
		// 					>
		// 						<div style={{ display: "flex" }} className="flex-col">
		// 							<small
		// 								style={{
		// 									fontSize: 14,
		// 									fontWeight: 400,
		// 									color: "#777E91",
		// 								}}
		// 							>
		// 								Status
		// 							</small>
		// 							{processRepayment ? (
		// 								<p style={{ fontSize: 14, color: "#FBBF24" }}>Processing</p>
		// 							) : (
		// 								<p style={{ fontSize: 14, color: "#58BD7D" }}>Completed</p>
		// 							)}
		// 						</div>
		// 						<div style={{ display: "flex" }} className="flex-col">
		// 							<small
		// 								style={{
		// 									fontSize: 14,
		// 									fontWeight: 400,
		// 									color: "#777E91",
		// 								}}
		// 							>
		// 								Transaction ID
		// 							</small>
		// 							<p style={{ fontSize: 14, color: "white" }}>
		// 								{transactionId
		// 									? getTrimmedWalletAddress(transactionId, 25)
		// 									: "--"}
		// 							</p>
		// 						</div>
		// 					</div>
		// 					<div>
		// 						<br />
		// 						<small
		// 							style={{
		// 								fontSize: 14,
		// 								fontWeight: 400,
		// 								color: "#777E91",
		// 							}}
		// 						>
		// 							Receipient's wallet address
		// 						</small>
		// 						<p style={{ fontSize: 14, color: "white" }}>
		// 							{walletAddress
		// 								? getTrimmedWalletAddress(walletAddress, 25)
		// 								: "--"}
		// 						</p>
		// 					</div>
		// 				</div>
		// 			</div>

		// 			<div
		// 				className="modal-action mx-4 mt-2 mb-4 text-sm py-3 px-4 items-center justify-center"
		// 				style={{
		// 					width: 400,
		// 					height: 45,
		// 					marginLeft: 24,
		// 					borderRadius: 100,
		// 					borderWidth: 1,
		// 					borderColor: "#64748B",
		// 					alignSelf: "center",
		// 					display: "flex",
		// 				}}
		// 				onClick={() => navigate("/borrowerDashboard/transaction")}
		// 			>
		// 				<p>View Transaction</p>
		// 			</div>
		// 		</div>
		// 	</div>
		// </>

		<>
			<input
				type="checkbox"
				id="RepaymentProcessModal"
				className="modal-toggle"
			/>
			<div className="modal backdrop-filter backdrop-brightness-[40%] backdrop-blur-lg px-4">
				<div className="bg-neutral-50 dark:bg-darkmode-800 w-[100%] sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[45%] 2xl:w-[45rem] pb-6 rounded-xl md:pb-8">
					<div className="md:px-8 flex px-4 py-3 text-2xl font-semibold border-b border-neutral-300 dark:border-neutral-500">
						<h3>Repayment</h3>

						<label
							htmlFor="RepaymentProcessModal"
							className="ml-auto cursor-pointer"
						>
							✕
						</label>
					</div>

					<div className="px-4 md:px-8 mt-6">
						<div className=" flex flex-col  gap-4 text-center">
							<p className="text-5xl font-bold">
								{!processRepayment ? `Yay! 🎉` : "In Progress ⏱"}
							</p>
							<div className="flex justify-center items-center gap-2">
								<p className="text-lg font-semibold mt-1 flex">
									{processRepayment
										? `Repayment of ${getDisplayAmount(amounts)} ${
												process.env.REACT_APP_TOKEN_NAME
										  }  of pool ${poolName} is under progress. `
										: `You successfully repaid ${getDisplayAmount(amounts)} ${
												process.env.REACT_APP_TOKEN_NAME
										  } of pool ${poolName}`}
									<span
										className={
											processRepayment
												? "ml-1 animate-spin border-solid border-[3px] border-t-[#14171F] border-r-[#14171F] border-[#fff] w-[1.5rem] h-[1.5rem] rounded-full p-2"
												: ""
										}
									></span>
								</p>
							</div>
						</div>

						<div className="mt-3 border border-neutral-700 dark:border-neutral-500 px-4 py-4 rounded-lg flex flex-col gap-4">
							<div className="flex flex-col gap-4 md:flex-row md:justify-between">
								<div className="flex flex-col gap-1">
									<p className="text-neutral-400">Status</p>
									{processRepayment ? (
										<p className="text-warning-400 font-semibold">Processing</p>
									) : (
										<p className="text-success-500 font-semibold">Completed</p>
									)}
								</div>

								<div className="flex flex-col gap-1 md:mx-auto">
									<p className="text-neutral-400">Transaction ID</p>
									<p className="font-semibold pl-1">
										{transactionId
											? getTrimmedWalletAddress(transactionId, 25)
											: "--"}
									</p>
								</div>
							</div>

							<div className="flex flex-col gap-1">
								<p className="text-neutral-400">Receipient's wallet address</p>
								<p className="font-semibold overflow-hidden">
									{walletAddress
										? getTrimmedWalletAddress(walletAddress, 25)
										: "--"}
								</p>
							</div>
						</div>

						<div className="border-2 border-neutral-300 dark:border-neutral-500 rounded-[1.8em] mt-8">
							<p className="text-black dark:text-white cursor-pointer font-semibold py-3 text-center">
								<span
									onClick={() => {
										navigate("/borrowerDashboard/transaction");
									}}
								>
									View Transaction
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProcessingRepaymentModal;
