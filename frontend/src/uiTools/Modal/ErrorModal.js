import React from "react";

const ErrorModal = ({ errormsg, setErrormsg }) => {
	return (
		<>
			<input
				type="checkbox"
				className="modal-toggle"
				checked={!errormsg.status}
			/>
			<div
				style={{ backdropFilter: "brightness(40%) blur(8px)" }}
				className="modal"
			>
				<div class="relative p-4 w-full max-w-md h-full md:h-auto">
					<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
						<button
							type="button"
							class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
							data-modal-toggle="popup-modal"
							onClick={() => {
								setErrormsg({ status: true, msg: "" });
							}}
						>
							<svg
								aria-hidden="true"
								class="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span class="sr-only">Close modal</span>
						</button>
						<div class="p-6 text-center">
							<svg
								aria-hidden="true"
								class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
								{errormsg.msg ? errormsg.msg : "No Error"}
							</h3>
							<button
								onClick={() => {
									// navigate("/borrower_dashboard/borrow_list");
									setErrormsg({ status: true, msg: "" });
								}}
								data-modal-toggle="popup-modal"
								type="button"
								className={`py-2 px-6 bg-gradient-to-r from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize font-medium border-none text-white rounded-3xl focus:outline-[#9281FF]`}
							>
								Go to back
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ErrorModal;
