import React from "react";
import { useNavigate } from "react-router-dom";

const ProcessingRequestModal = ({
	borrowReqProcess,
	setProcessModal,
	setSelected,
	handleDrawdown,
	processModal,
}) => {
	const data = {
		success: false,
	};
	console.log(borrowReqProcess, "inrequest modal");

	return (
		<>
			<input
				type="checkbox"
				id="ProcessModal"
				className="modal-toggle"
				checked={processModal}
			/>
			<div
				style={{ backdropFilter: "brightness(40%) blur(8px)" }}
				className="modal"
			>
				<div
					style={{ borderRadius: "16px" }}
					className="bg-white dark:bg-darkmode-800 modal-box w-1/3 max-w-5xl p-0"
				>
					<button
						for="ProcessModal"
						className="btn btn-ghost absolute right-2 top-2 pb-2"
						onClick={() => handleDrawdown()}
					>
						✕
					</button>
					<h3
						style={{ borderBottom: "2px solid #292C33" }}
						className="font-bold text-lg py-3 px-4"
					>
						Create borrow request
					</h3>
					<p
						style={{
							display: "flex",
							fontSize: 55,
							fontWeight: 600,
						}}
						className="justify-center"
					>
						{borrowReqProcess ? "In Progress⏱" : `Yay!🎉`}
					</p>
					<p
						style={{
							display: "flex",
							fontSize: 23,
							fontWeight: 600,
						}}
						className="justify-center mb-2"
					>
						{borrowReqProcess
							? "Request is in process"
							: "Borrow request created successfully."}
					</p>

					<div
						className="modal-action mx-[auto] mt-2 mb-4 text-sm py-3 px-4 items-center justify-center"
						style={{
							width: 400,
							height: 45,
							borderRadius: 100,
							borderWidth: 1,
							borderColor: "#64748B",
							alignSelf: "center",
							marginTop: 60,
						}}
					>
						<p
							className=""
							style={{ cursor: "pointer" }}
							onClick={() => {
								console.log("kkkkkk");
								// navigate("/borrower_dashboard/");
								setSelected(false);
								setProcessModal(false);
							}}
						>
							Go to dashboard
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProcessingRequestModal;
