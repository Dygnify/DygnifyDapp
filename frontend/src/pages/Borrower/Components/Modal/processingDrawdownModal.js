import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProcessingDrawdownModal = ({ processDrawdown, handleDrawdown }) => {
	console.log(processDrawdown, "in fund process modal");

	const navigate = useNavigate();

	return (
		<>
			<input
				type="checkbox"
				id="DrawdownProcessModal"
				className="modal-toggle"
			/>
			<div className="modal backdrop-filter backdrop-brightness-[40%] backdrop-blur-lg px-4">
				<div className="bg-darkmode-800 w-[100%] sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[45%] 2xl:w-[45rem] pb-6 rounded-xl md:pb-8">
					<div className="md:px-8 flex px-4 py-3 text-2xl font-semibold border-b border-neutral-500">
						<h3>Drawdown</h3>

						<label
							for="DrawdownProcessModal"
							className="ml-auto cursor-pointer"
							onClick={() => handleDrawdown()}
						>
							✕
						</label>
					</div>

					<div className="px-4 md:px-8 mt-6">
						<div className=" flex flex-col  gap-4 text-center">
							<p className="text-5xl font-bold">
								{!processDrawdown ? `Yay! 🎉` : "In Progress ⏱"}
							</p>

							<p className="text-xl font-semibold mt-1">
								{processDrawdown
									? "Drawdown is in progress"
									: "Drawdown done successfully"}
							</p>
						</div>

						{/* {processDrawdown ? (
							<p
								className="justify-center"
								style={{ display: "flex", fontSize: 14, marginBottom: 10 }}
							>
								{`Drawdown is in progress.`}
							</p>
						) : (
							<p
								className="justify-center"
								style={{ display: "flex", fontSize: 14, marginBottom: 10 }}
							>
								{`You drawdown is successfully`}
							</p>
						)} */}

						<div className="mt-3 border border-neutral-500 px-4 py-4 rounded-lg flex flex-col gap-4">
							<div className="flex flex-col gap-4 md:flex-row">
								<div className="flex flex-col gap-1">
									<p className="text-neutral-400">Status</p>
									{processDrawdown ? (
										<p className="text-warning-400 font-semibold">Processing</p>
									) : (
										<p className="text-success-500 font-semibold">Completed</p>
									)}
								</div>

								<div className="flex flex-col gap-1 md:mx-auto">
									<p className="text-neutral-400">Transaction ID</p>
									<p className="font-semibold">0msaae8979faweawqt977</p>
								</div>
							</div>

							<div className="flex flex-col gap-1">
								<p className="text-neutral-400">Receipient's wallet address</p>
								<p className="font-semibold">0msaae8979faweawqt977asfsaf8798</p>
							</div>
						</div>

						<div
							className="border-2 border-neutral-500 rounded-[1.8em] mt-8"
							onClick={() => navigate("/borrower_dashboard/transaction")}
						>
							<p className="cursor-pointer font-semibold py-3 text-center">
								View Transaction
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProcessingDrawdownModal;
