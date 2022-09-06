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
		<div className={`relative ${loading ? "h-[100vh]" : ""}`}>
			{loading && <Loader />}
			<div className={`mb-16 ${loading ? "blur-sm" : ""}`}>
				<h2 className="text-2xl mb-6">Transaction History</h2>
				{transactions.length !== 0 ? (
					<>
						<div className="collapse mb-3">
							<input type="checkbox" className="peer" />
							<div
								style={{
									display: "flex",
									borderTop: "1px solid #20232A",
									borderBottom: "1px solid #20232A",
								}}
								className="collapse-title text-md font-normal justify-around w-full"
							>
								<p className="w-1/6 text-center">Pool</p>
								<p className="w-1/6 text-center">Date</p>
								<p className="w-1/6 text-center">Transaction Type</p>
								<p className="w-1/6 text-center">Amount</p>
								<p className="w-1/6 text-center">Status</p>
								<p className="w-1/6 text-center">View on Explorer</p>
							</div>
						</div>
						<div>
							{transactions
								? transactions.map((item) => (
										<TransactionsCard key={transactions.id} data={item} />
								  ))
								: null}
						</div>
					</>
				) : (
					<div style={{ display: "flex" }} className="justify-center">
						<div style={{ color: "#64748B", fontSize: 18 }}>
							No transactions available.
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Transactions;
