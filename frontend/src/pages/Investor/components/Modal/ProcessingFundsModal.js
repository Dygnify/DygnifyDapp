import React, { useContext } from "react";

//for get data import from paths--
import { UserContext } from "../../../../Paths"; //

const ProcessingFundsModal = ({ investProcessing }) => {
	//for get data using useContext--
	const { state, dispatch } = useContext(UserContext); //

	console.log(investProcessing, "in fund process modal");

	return (
		<div className="">
			<input type="checkbox" id="InvestProcessModal" className="modal-toggle" />
			<div className="modal backdrop-filter backdrop-brightness-[40%] backdrop-blur-lg px-4">
				<div className="bg-darkmode-800 w-[100%] sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[45%] 2xl:w-[45rem] pb-6 rounded-xl md:pb-8">
					<div className="md:px-8 flex px-4 py-3 text-2xl font-semibold border-b border-neutral-500">
						<h3>Invest</h3>

						<label
							for="InvestProcessModal"
							// onClick={() => handleDrawdown()}
							className="ml-auto cursor-pointer"
						>
							✕
						</label>
					</div>

					<div className="px-4 md:px-8 mt-6">
						<div className=" flex flex-col  gap-4 text-center">
							<p className="text-5xl font-bold">
								{!investProcessing ? `Yay! 🎉` : "In Progress ⏱"}
							</p>

							<p className="text-xl font-semibold mt-1">
								{investProcessing
									? "Investment is in progress"
									: "Investment was successful"}
							</p>

							{!investProcessing ? (
								<p className="font-semibold text-base">
									You successfully withdrew
									<span className="text-success-500">
										{" "}
										{state}100 USDC
									</span>{" "}
									from poolname
								</p>
							) : (
								<></>
							)}
						</div>

						<div className="mt-3 border border-neutral-500 px-4 py-4 rounded-lg flex flex-col gap-4">
							<div className="flex flex-col gap-4 md:flex-row">
								<div className="flex flex-col gap-1">
									<p className="text-neutral-400">Status</p>
									{investProcessing ? (
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
								<p className="text-neutral-400">Contract Address</p>
								<p className="font-semibold">0msaae8979faweawqt977asfsaf8798</p>
							</div>
						</div>

						<div className="border-2 border-neutral-500 rounded-[1.8em] mt-8">
							<p className="cursor-pointer font-semibold py-3 text-center">
								View Transaction
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProcessingFundsModal;
