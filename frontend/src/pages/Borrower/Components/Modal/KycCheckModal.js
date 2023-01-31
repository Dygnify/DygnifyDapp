import React from "react";
import { useNavigate } from "react-router-dom";

const KycCheckModal = ({ kycStatus, profileStatus }) => {
	const navigate = useNavigate();
	return (
		<>
			<input type="checkbox" id="kycAlertModal" className="modal-toggle" />
			<div className="modal backdrop-filter backdrop-brightness-[100%] backdrop-blur-lg px-4">
				<div className="bg-white rounded-2xl dark:bg-darkmode-800 modal-box w-[100%] sm:w-[75%] md:w-[55%] lg:w-[45%]  xl:w-[35%] 2xl:w-[25%]  p-5">
					<div className="flex justify-between items-center pb-2  border-b border-neutral-300 dark:border-neutral-500">
						<h3>Complete your Profile</h3>
						<label
							htmlFor="kycAlertModal"
							className="btn btn-ghost absolute right-1"
						>
							<svg
								width="16"
								height="17"
								viewBox="0 0 16 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g clipPath="url(#clip0_564_115493)">
									<path
										className="dark:fill-white fill-black"
										d="M14.6262 3.39747C15.0168 3.00695 15.0168 2.37378 14.6262 1.98326L13.8501 1.20711C13.4595 0.816582 12.8264 0.816583 12.4359 1.20711L7.66667 5.9763L2.89747 1.20711C2.50695 0.816582 1.87378 0.816582 1.48326 1.20711L0.707106 1.98326C0.316582 2.37378 0.316582 3.00695 0.707107 3.39747L5.4763 8.16667L0.707107 12.9359C0.316582 13.3264 0.316583 13.9595 0.707107 14.3501L1.48326 15.1262C1.87378 15.5168 2.50695 15.5168 2.89747 15.1262L7.66667 10.357L12.4359 15.1262C12.8264 15.5168 13.4595 15.5168 13.8501 15.1262L14.6262 14.3501C15.0168 13.9595 15.0168 13.3264 14.6262 12.9359L9.85703 8.16667L14.6262 3.39747Z"
										fill="white"
									/>
								</g>
								<defs>
									<clipPath id="clip0_564_115493">
										<rect
											width="16"
											height="16"
											fill="white"
											transform="translate(0 0.5)"
										/>
									</clipPath>
								</defs>
							</svg>
						</label>
					</div>
					<div className="pt-5">
						<p className="justify-center flex text-4xl w-full font-bold ">
							{!kycStatus && profileStatus
								? `Incomplete KYC!`
								: "Incomplete Profile!"}
						</p>

						<p className="justify-center mb-2 flex text-lg w-full font-bold  md:pt-3">
							{!kycStatus && profileStatus
								? "Please complete your KYC."
								: "Please complete your profile."}
						</p>
					</div>

					<div className="border-2 border-neutral-300 dark:border-neutral-500 rounded-[1.8em] mt-8 md:mb-3">
						<p
							className="text-black dark:text-white cursor-pointer font-semibold py-2 sm:py-3 text-center"
							onClick={() =>
								navigate(
									!kycStatus && profileStatus
										? `/borrowerDashboard/borrowerProfile`
										: `/borrowerDashboard/editProfile`
								)
							}
						>
							{!kycStatus && profileStatus ? "Go to Profile" : "Create Profile"}
						</p>
					</div>
				</div>
			</div>
		</>
		// <>
		// 	<input type="checkbox" id="kycAlertModal" className="modal-toggle" />
		// 	<div
		// 		style={{ backdropFilter: "brightness(40%) blur(8px)" }}
		// 		className="modal"
		// 	>
		// 		<div
		// 			style={{ borderRadius: "16px" }}
		// 			className="bg-white dark:bg-darkmode-800   modal-box w-1/3 max-w-5xl p-0"
		// 		>
		// 			<label
		// 				for="kycAlertModal"
		// 				className="btn btn-ghost absolute right-2 top-2 pb-2"
		// 				// onClick={() => handleForm()}
		// 			>
		// 				✕
		// 			</label>
		// 			<h3
		// 				style={{ borderBottom: "2px solid #292C33" }}
		// 				className="font-bold text-lg py-3 px-4"
		// 			>
		// 				Complete your Profile
		// 			</h3>
		// 			<p
		// 				style={{ display: "flex", fontSize: 40, fontWeight: 600 }}
		// 				className="justify-center"
		// 			>
		// 				{!kycStatus && profileStatus
		// 					? `Incomplete KYC!`
		// 					: "Incomplete Profile!"}
		// 			</p>
		// 			<p
		// 				style={{ display: "flex", fontSize: 23, fontWeight: 600 }}
		// 				className="justify-center mb-2"
		// 			>
		// 				{!kycStatus && profileStatus
		// 					? "Please complete your KYC."
		// 					: "Please complete your profile."}
		// 			</p>

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
		// 					marginTop: 60,
		// 					marginInline: "auto",
		// 				}}
		// 				onClick={() =>
		// 					navigate(
		// 						!kycStatus && profileStatus
		// 							? `/borrowerDashboard/borrowerProfile`
		// 							: `/borrowerDashboard/editProfile`
		// 					)
		// 				}
		// 			>
		// 				<p
		// 					className="justify-center"
		// 					style={{ display: "flex", cursor: "pointer" }}
		// 				>
		// 					{!kycStatus && profileStatus ? "Go to Profile" : "Create Profile"}
		// 				</p>
		// 			</div>
		// 		</div>
		// 	</div>
		// </>
	);
};

export default KycCheckModal;
