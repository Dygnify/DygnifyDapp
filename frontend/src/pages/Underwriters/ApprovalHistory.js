import React, { useEffect, useState } from "react";
import TransactionsCard from "../Underwriters/Components/TransactionsCard";
import { getApprovalHistory } from "../../services/BackendConnectors/userConnectors/underwriterConnectors";
import Loader from "../../uiTools/Loading/Loader";

const ApprovalHistory = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(async () => {
		await getHistory();
		setLoading(false);
	}, []);

	async function getHistory() {
		let list = await getApprovalHistory();
		console.log(list);
		setTransactions(list);
	}

	return (
		<div className={`mb-16 ${loading ? "relative h-[80vh]" : ""}`}>
			{loading && <Loader />}
			<div className={`${loading ? "blur-sm" : ""}`}>
				<h2 className="text-2xl mb-2 md:mb-10 md:-mt-1">Approval history</h2>
				{transactions.length == 0 ? (
					<div className="felx justify-center">
						<div className="text-[#64748B] text-xl mt-3">
							No Borrow requests are present at the moment.
						</div>
					</div>
				) : (
					<div>
						<div className="collapse mb-3">
							<input type="checkbox" className="peer" />
							<div className="flex collapse-title  border-t-2 border-b-2 border-t-[#20232A] border-b-[#20232A]  justify-between w-full items-center font-bold flex-wrap pr-1 pl-1 md:pr-3">
								<p className="w-1/3 md:w-1/6 text-start pl-7">Pool Name</p>
								<p className="w-1/3 md:w-1/6 text-start pl-7">Company Name</p>
								<p className="w-1/3 md:w-1/6 text-center  hidden md:block">
									Created On
								</p>
								<p className="w-1/3 md:w-1/6 text-center">Decision</p>
							</div>
						</div>
						<div className="space-y-3">
							{transactions
								? transactions.map((item) => (
										<TransactionsCard key={transactions.id} data={item} />
								  ))
								: null}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ApprovalHistory;
