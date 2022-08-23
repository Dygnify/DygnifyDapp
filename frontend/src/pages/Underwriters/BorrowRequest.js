import React, { useState, useEffect } from "react";

import UnderwriterCard from "./Components/UnderwriterCard";
import { getAllUnderwriterOpportunities } from "../../components/transaction/TransactionHelper";
import Loader from "../../uiTools/Loading/Loader";

const BorrowRequest = () => {
	const [opportunities, setOpportunities] = useState([]);

	const [loading, setLoading] = useState(true);

	useEffect(async () => {
		await getUnderReviewOpportunity();

		setLoading(false);
	}, []);

	async function getUnderReviewOpportunity() {
		let list = await getAllUnderwriterOpportunities();
		if (list) {
			setOpportunities(list);
		}
	}

	return (
		<div className={`relative ${loading ? "h-[100vh]" : ""}`}>
			{loading && <Loader />}
			<div className={`${loading ? "blur-sm" : ""}`}>
				<div className="px-5">
					<div
						style={{ display: "flex" }}
						className="items-center justify-between mb-14 "
					>
						<h2
							className="text-left font-bold text-white"
							style={{ fontSize: 28, marginLeft: -20 }}
						>
							Underwriter's Dashboard
						</h2>
					</div>
				</div>

				{opportunities.length === 0 ? (
					<div style={{ display: "flex" }} className="justify-center">
						<div
							style={{
								color: "#64748B",
								fontSize: 18,
								marginTop: 10,
							}}
						>
							No Borrow requests are present at the moment.
						</div>
					</div>
				) : (
					<div className="mb-16 ">
						<div style={{ display: "grid" }} className="gap-4 grid-cols-2">
							{opportunities &&
								opportunities.map((item) => (
									<UnderwriterCard data={item} key={item.id} />
								))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default BorrowRequest;
<h2>Invest</h2>;
