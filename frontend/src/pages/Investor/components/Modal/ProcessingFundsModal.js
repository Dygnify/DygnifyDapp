import React, { useContext } from "react";

//for get data import from paths--
import { UserContext } from "../../../../Paths"; //
//

const ProcessingFundsModal = ({ investProcessing }) => {
	//for get data using useContext--
	const { state, dispatch } = useContext(UserContext); //
	//

	console.log(investProcessing, "in fund process modal");
	return (
		<div className="">
			<input type="checkbox" id="InvestProcessModal" className="modal-toggle" />
			<div
				style={{ backdropFilter: "brightness(40%) blur(8px)" }}
				className="modal"
			>
				<div
					style={{ backgroundColor: "#20232A", borderRadius: "16px" }}
					className="modal-box w-1/3 max-w-5xl p-0"
				>
					<label
						for="InvestProcessModal"
						className="btn btn-ghost absolute right-2 top-2 pb-2"
						// onClick={() => handleDrawdown()}
					>
						✕
					</label>
					<h3
						style={{ borderBottom: "2px solid #292C33" }}
						className="font-bold text-lg py-3 px-4"
					>
						Invest
					</h3>
					<p
						style={{ display: "flex", fontSize: 55, fontWeight: 600 }}
						className="justify-center"
					>
						{!investProcessing ? `Yay!🎉` : "In Progress⏱"}
					</p>
					<p
						style={{ display: "flex", fontSize: 23, fontWeight: 600 }}
						className="justify-center mb-2"
					>
						{investProcessing
							? "Investment is in progress"
							: "Investment was successful"}
					</p>
					{!investProcessing ? (
						<p
							className="justify-center"
							style={{ display: "flex", fontSize: 14, marginBottom: 10 }}
						>
							{`You successfully withdrew ${state}USDC from poolname`}
						</p>
					) : (
						<></>
					)}
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
									{investProcessing ? (
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
										0msaae8979faweawqt977
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
									Contract Address
								</small>
								<p style={{ fontSize: 14, color: "white" }}>
									0msaae8979faweawqt977asfsaf8798
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
					>
						<p>View Transaction</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProcessingFundsModal;
