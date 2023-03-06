import React, { useEffect, useState } from "react";
import {
	addOwner,
	confirmTransaction,
	getAllTransactions,
	getNumConfirmationsRequired,
	removeOwner,
	revokeConfirmation,
	updateNumConfirmationsRequired,
} from "../../services/BackendConnectors/multiSignConnectors";
import GradientButton from "../../uiTools/Button/GradientButton";
import TokenInput from "./TokenInput";
import Loader from "../../uiTools/Loading/Loader";

const MultiSign = () => {
	const [allTransactions, setAllTransactions] = useState([]);
	const [transactionQueue, setTransactionQueue] = useState([]);
	const [transactionHistory, setTransactionHistory] = useState([]);
	const [numConfirmationsRequired, setNumConfirmationsRequired] = useState('');
	const [totalConfirmations, setTotalConfirmations] = useState(0);
	const [newOwnerAddress, setNewOwnerAddress] = useState("");
	const [removeOwnerAddress, setRemoveOwnerAddress] = useState("");
	const [statusUpdated, setStatusUpdated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		getAllTransactions()
			.then((res) => {
				if (res.success) {
					setAllTransactions(
						res.traxactions.map((transaction, id) => {
							console.log(transaction);
							return {
								...transaction,
								transactionId: id,
							};
						})
					);
					setIsLoading(false);
				} else {
					console.log("all transactions: ", res);
				}
			})
			.catch((error) => console.log(error));
	}, [statusUpdated]);

	useEffect(() => {
		setTransactionHistory(
			allTransactions?.filter((transaction) => {
				if (
					transaction.numConfirmations.toString() >=
					totalConfirmations
				) {
					return transaction;
				}
			})
		);

		setTransactionQueue(
			allTransactions?.filter((transaction) => {
				if (
					transaction.numConfirmations.toString() <
					totalConfirmations
				) {
					return transaction;
				}
			})
		);
	}, [allTransactions, statusUpdated, totalConfirmations]);

	useEffect(() => {
		setIsLoading(true);
		getNumConfirmationsRequired()
			.then((res) => {
				console.log(res);
				if (res.success) {
					setTotalConfirmations(res.transaction.toString());
					setIsLoading(false);
				} else {
					console.log("all confirmation: ", res);
				}
			})
			.catch((error) => console.log(error));
	}, [statusUpdated]);

	const updateStatus = (result, resType) => {
		if (result.success) {
			setStatusUpdated(!statusUpdated);
		} else {
			console.log(`${resType} error: `, result.msg);
		}

	}

	async function confirmHandler(id) {
		let res = await confirmTransaction(id);
		updateStatus(res, "confirm Transaction");
	}

	async function revokeHandler(id) {
		let res = await revokeConfirmation(id);
		updateStatus(res, "revoke Transaction");
	}

	async function addOwnerHandler() {
		let res = await addOwner(newOwnerAddress);
		updateStatus(res, "add owner");
	}

	async function removeOwnerHandler() {
		let res = await removeOwner(removeOwnerAddress);
		updateStatus(res, "remove owner");
	}
	async function updateConfirmations() {
		let res = await updateNumConfirmationsRequired(numConfirmationsRequired);
		updateStatus(res, "update confirmation");
	}

	return (
		<div className="p-4">
			<section className="">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					Transaction Queue
				</h2>
				<div className="relative">
					{isLoading && <Loader />}
					<div className={`${isLoading && "blur-sm"}`}>
						<div className="px-1 mt-8 py-2 gap-4 md:gap-0 md:justify-around flex font-bold border-y border-darkmode-500 text-center">
							<p className="w-1/3 md:w-1/12 my-auto ">
								Transaction ID
							</p>
							<p className=" md:block w-1/3 md:w-5/12 my-auto ">
								To
							</p>
							<p className=" md:block w-1/3 md:w-2/12 my-auto ">
								Number of Confirmations
							</p>
							<p className="w-1/3 md:w-1/12 my-auto ">Status</p>
							<p className=" md:block w-1/3 md:w-2/12 my-auto ">
								Action
							</p>
						</div>
						<div className="p-1 rounded-xl border border-darkmode-500 my-5 flex flex-col gap-4 max-h-[350px] overflow-y-auto">
							{transactionQueue.map((transaction, i) => (
								<div
									key={i}
									className="px-1 bg-lightmode-200 dark:bg-darkmode-800 flex justify-around rounded-xl py-3 gap-4 md:gap-0 text-center"
								>
									<p className="w-1/3 md:w-1/12 my-auto ">
										{transaction.transactionId}
									</p>
									<p className=" md:block w-1/3 md:w-5/12 my-auto ">
										{transaction.to}
									</p>
									<p className=" md:block w-1/3 md:w-2/12 my-auto ">
										{transaction.numConfirmations.toString()}
										/{totalConfirmations}
									</p>
									<p className="w-1/3 md:w-1/12 my-auto ">
										pending
									</p>
									<p className=" w-1/3 md:w-2/12 my-auto transaction-button flex gap-x-2 justify-center">
										<button
											onClick={() =>
												confirmHandler(
													transaction.transactionId
												)
											}
											className="bg-gradient-to-r from-[#51B960] to-[#83DC90]"
										>
											Confirm
										</button>
										<button
											onClick={() =>
												revokeHandler(
													transaction.transactionId
												)
											}
											className="bg-gradient-to-r from-[#d36855] to-[#e29f91]"
										>
											Revoke
										</button>
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="mt-20">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					Transaction History
				</h2>
				<div className="relative">
					{isLoading && <Loader />}
					<div className={`${isLoading && "blur-sm"}`}>
						<div className="px-1 mt-8 py-4 gap-4 md:gap-0 md:justify-around flex font-bold border-y border-darkmode-500 text-center">
							<p className="w-1/3 md:w-2/12 my-auto">
								Transaction ID
							</p>
							<p className=" md:block w-1/3 md:w-8/12 my-auto ">
								To
							</p>
							<p className="w-1/3 md:w-2/12 my-auto ">Status</p>
							{/* <p className=" md:block w-1/3 md:w-2/12 my-auto ">
								View on Explorer
							</p> */}
						</div>
						<div className="p-1 rounded-xl border border-darkmode-500 my-5 flex flex-col gap-4 max-h-[350px] overflow-y-auto">
							{transactionHistory.map((transaction, i) => (
								<div
									key={i}
									className="px-1 bg-lightmode-200 dark:bg-darkmode-800 flex justify-around rounded-xl py-3 gap-4 md:gap-0 text-center"
								>
									<p className="w-1/3 md:w-2/12 my-auto ">
										{transaction.transactionId}
									</p>
									<p className=" md:block w-1/3 md:w-8/12 my-auto ">
										{transaction.to}
									</p>
									<p className="w-1/3 md:w-2/12 my-auto ">
										success
									</p>
									{/* <a
										className="hidden md:flex underline w-1/3 md:w-2/12 my-auto gap-1 items-center justify-center"
										href="https://www.google.com/"
										target="_blank"
										rel="noopener noreferrer"
									>
										Transaction
									</a> */}
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="mt-20">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					New Owner Address
				</h2>
				<div className="-mt-1 divider"></div>
				<div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						value={newOwnerAddress}
						placeholder="Enter owner address"
						onChange={(event) =>
							setNewOwnerAddress(event.target.value)
						}
					/>
					<GradientButton
						onClick={() => {
							addOwnerHandler();
							setNewOwnerAddress("");
						}}
					>
						Submit
					</GradientButton>
				</div>
			</section>

			<section className="mt-20">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					Remove Owner
				</h2>
				<div className="-mt-1 divider"></div>
				<div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						value={removeOwnerAddress}
						placeholder="Enter owner address"
						onChange={(event) =>
							setRemoveOwnerAddress(event.target.value)
						}
					/>
					<GradientButton
						onClick={() => {
							removeOwnerHandler();
							setRemoveOwnerAddress("");
						}}
					>
						Submit
					</GradientButton>
				</div>
			</section>

			<section className="mt-20">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					Update Number of confirmations Required
				</h2>
				<div className="-mt-1 divider"></div>
				<div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput
						onChange={(event) =>
							setNumConfirmationsRequired(event.target.value)
						}
						value={numConfirmationsRequired}
						type="number"
						placeholder="Number of confirmations"
					/>
					<GradientButton
						onClick={() => {
							updateConfirmations();
							setNumConfirmationsRequired("");
						}}
					>
						Submit
					</GradientButton>
				</div>
			</section>
		</div>
	);
};

export default MultiSign;
