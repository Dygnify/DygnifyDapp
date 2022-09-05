import React, { useEffect, useState } from "react";
import { getTransactionHistory } from "../../components/transactionHistory/TransactionGetter";
import TransactionsCard from "./Components/Cards/TransactionsCard";
import Loader from "../../uiTools/Loading/Loader";

const Transaction = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(async () => {
		console.log("reached");

		setTimeout(() => {
			setLoading(false);
		}, 300);

		let data = await getTransactionHistory();

		// not getting any response
		setTransactions(data);

		setLoading(false);

		console.log(data);
	}, []);

	return (
		<div className={`relative mb-16 ${loading ? "h-[100vh]" : ""}`}>
			{loading && <Loader />}
			<div className={` ${loading ? "filter blur-sm " : ""}`}>
				<h2 className="font-semibold text-[1.4375rem] lg:text-[2.0625rem]">
					Transaction History
				</h2>

				<div className="px-1 mt-8 py-6 gap-4 md:gap-0 md:justify-around flex font-bold border-y border-darkmode-500 text-center">
					<p className="w-1/3 md:w-1/6 my-auto ">Pool</p>
					<p className="hidden md:block w-1/3 md:w-1/6 my-auto ">Date</p>
					<p className="hidden md:block w-1/3 md:w-1/6 my-auto ">
						Transaction Type
					</p>
					<p className=" w-1/3 md:w-1/6 my-auto ">Amount</p>
					<p className="w-1/3 md:w-1/6 my-auto ">Status</p>
					<p className="hidden md:block w-1/3 md:w-1/6 my-auto ">
						View on Explorer
					</p>
				</div>

				<div className="my-5 flex flex-col gap-3">
					{transactions.map((item) => (
						<TransactionsCard key={transactions.id} data={item} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Transaction;
