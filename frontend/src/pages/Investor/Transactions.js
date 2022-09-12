import React, { useEffect, useState } from "react";
import TransactionsCard from "../Investor/components/Cards/TransactionsCard";
import Loader from "../../uiTools/Loading/Loader";
import { getUserWalletAddress } from "../../services/BackendConnectors/userConnectors/commonConnectors";
import { getTokenTransactions } from "../../services/Helpers/transactionsHelper";

const Transactions = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(async () => {
		getUserWalletAddress().then((address) => {
			getTokenTransactions(address, process.env.REACT_APP_TEST_USDCTOKEN).then(
				(trxData) => {
					if (trxData) {
						setTransactions(trxData);
					}
					setLoading(false);
				}
			);
		});
	}, []);

	return (
		<div className={`relative mb-16 ${loading ? "h-[100vh]" : ""}`}>
			{loading && <Loader />}
			<div className={` ${loading ? "filter blur-sm" : ""}`}>
				<h2 className="font-semibold text-[1.4375rem] lg:text-[2.0625rem]">
					Transaction History
				</h2>
				{transactions?.length !== 0 ? (
					<>
						<div className="px-1 mt-8 py-6 gap-4 md:gap-0 md:justify-around flex font-bold border-y border-neutral-300 dark:border-darkmode-500 text-center">
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
							{transactions
								? transactions.map((item) => (
										<TransactionsCard key={transactions.hash} data={item} />
								  ))
								: null}
						</div>
					</>
				) : (
					<div className="flex justify-center">
						<div className="text-neutral-500">No transactions available.</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Transactions;
