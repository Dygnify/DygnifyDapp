import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../../services/BackendConnectors/multiSignConnectors";
import GradientButton from "../../uiTools/Button/GradientButton";
import TokenInput from "./TokenInput";

const MultiSign = () => {
	// dummy infomation
	const queueData = [
		{
			transactionID: 1,
			to: "0xdf48d3104768f8EF759a39BEEd08B3f1a0896d2C",
			confirmationCounter: "0/4",
			status: "pending",
		},
		{
			transactionID: 2,
			to: "0xdf48d3104768f8EF759a39BEEd08B3f1a0896d2C",
			confirmationCounter: "1/4",
			status: "pending",
		},
		{
			transactionID: 3,
			to: "0xdf48d3104768f8EF759a39BEEd08B3f1a0896d2C",
			confirmationCounter: "3/4",
			status: "pending",
		},
	];
	const historyData = [
		{
			transactionID: 1,
			to: "0xdf48d3104768f8EF759a39BEEd08B3f1a0896d2C",
			status: "success",
		},
		{
			transactionID: 2,
			to: "0xdf48d3104768f8EF759a39BEEd08B3f1a0896d2C",
			status: "success",
		},
		{
			transactionID: 3,
			to: "0xdf48d3104768f8EF759a39BEEd08B3f1a0896d2C",
			status: "success",
		},
	];

	const [info, setInfo] = useState(null);
	useEffect(()=>{
		async function fnc(){
			let res = await getAllTransactions();
			console.log("🎈🎈11", res);	
		}
		fnc();
	},[])
	
	// async function demoFnc(){
	// 	let res = await getAllTransactions();
	// 	console.log("🎈🎈", res);
	// }
	// demoFnc();
	// console.log('🎈🎈', info);

	return (
		<div className="p-4 pl-8">
			<section className="">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					Transaction Queue
				</h2>
				<div>
					<div className="px-1 mt-8 py-2 gap-4 md:gap-0 md:justify-around flex font-bold border-y border-darkmode-500 text-center">
						<p className="w-1/3 md:w-1/12 my-auto ">
							Transaction ID
						</p>
						<p className=" md:block w-1/3 md:w-5/12 my-auto ">To</p>
						<p className=" md:block w-1/3 md:w-2/12 my-auto ">
							Number of Confirmations
						</p>
						<p className="w-1/3 md:w-1/12 my-auto ">Status</p>
						<p className=" md:block w-1/3 md:w-2/12 my-auto ">
							Action
						</p>
					</div>
					<div className="my-5 flex flex-col gap-4">
						{queueData.map((data, i) => (
							<div
								key={i}
								className="px-1 bg-lightmode-200 dark:bg-darkmode-800 flex justify-around rounded-xl py-3 gap-4 md:gap-0 text-center"
							>
								<p className="w-1/3 md:w-1/12 my-auto ">
									{data.transactionID}
								</p>
								<p className=" md:block w-1/3 md:w-5/12 my-auto ">
									{data.to}
								</p>
								<p className=" md:block w-1/3 md:w-2/12 my-auto ">
									{data.confirmationCounter}
								</p>
								<p className="w-1/3 md:w-1/12 my-auto ">
									{data.status}
								</p>
								<p className=" w-1/3 md:w-2/12 my-auto transaction-button flex gap-x-2 justify-center">
									<button className="bg-gradient-to-r from-[#51B960] to-[#83DC90]">
										Confirm
									</button>
									<button className="bg-gradient-to-r from-[#d36855] to-[#e29f91]">
										Revoke
									</button>
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="mt-20">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					Transaction History
				</h2>
				<div>
					<div className="px-1 mt-8 py-4 gap-4 md:gap-0 md:justify-around flex font-bold border-y border-darkmode-500 text-center">
						<p className="w-1/3 md:w-2/12 my-auto ">
							Transaction ID
						</p>
						<p className=" md:block w-1/3 md:w-6/12 my-auto ">To</p>
						<p className="w-1/3 md:w-2/12 my-auto ">Status</p>
						<p className=" md:block w-1/3 md:w-2/12 my-auto ">
							View on Explorer
						</p>
					</div>
					<div className="my-5 flex flex-col gap-4">
						{historyData.map((data, i) => (
							<div
								key={i}
								className="px-1 bg-lightmode-200 dark:bg-darkmode-800 flex justify-around rounded-xl py-3 gap-4 md:gap-0 text-center"
							>
								<p className="w-1/3 md:w-2/12 my-auto ">
									{data.transactionID}
								</p>
								<p className=" md:block w-1/3 md:w-6/12 my-auto ">
									{data.to}
								</p>
								<p className="w-1/3 md:w-2/12 my-auto ">
									{data.status}
								</p>
								<a
									className="hidden md:flex underline w-1/3 md:w-2/12 my-auto gap-1 items-center justify-center"
									href="https://www.google.com/"
									target="_blank"
									rel="noopener noreferrer"
								>
									Transaction
								</a>
							</div>
						))}
					</div>
				</div>
			</section>

			<section  className="mt-20">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					New Owner Address
				</h2>
				<div className="-mt-1 divider"></div>
				<div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput placeholder="Enter owner address" />
					<GradientButton>Submit</GradientButton>
				</div>
			</section>

			<section  className="mt-20">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					Remove Owner
				</h2>
				<div className="-mt-1 divider"></div>
				<div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput placeholder="Enter owner address" />
					<GradientButton>Submit</GradientButton>
				</div>
			</section>

			<section  className="mt-20">
				<h2 className="text-center font-semibold text-[1.4375rem] md:text-[1.75rem]">
					Update Number of confirmations Required
				</h2>
				<div className="-mt-1 divider"></div>
				<div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center gap-y-2 sm:gap-x-8 mb-4 my-gradient px-4 py-8 md:w-[60%] mx-auto rounded-xl">
					<TokenInput placeholder="Number of confirmations" />
					<GradientButton>Submit</GradientButton>
				</div>
			</section>
		</div>
	);
};

export default MultiSign;
