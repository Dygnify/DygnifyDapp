import React, { useState, useEffect } from "react";

import UnderwriterCard from "./Components/UnderwriterCard";
import Loader from "../../uiTools/Loading/Loader";
import { getAllUnderwriterOpportunities } from "../../services/BackendConnectors/opportunityConnectors";
import ErrorModal from "../../uiTools/Modal/ErrorModal";

const BorrowRequest = () => {
	const [opportunities, setOpportunities] = useState([]);

	const [errormsg, setErrormsg] = useState({
		status: false,
		msg: "error in underwriter",
	});

	const [loading, setLoading] = useState(true);

	useEffect(async () => {
		await getUnderReviewOpportunity();
		setLoading(false);
	}, []);

	async function getUnderReviewOpportunity() {
		let list = await getAllUnderwriterOpportunities();
		if (list.success) {
			setOpportunities(list.opportunities);
		} else {
			console.log(list.msg);
			setErrormsg({ status: list.success, msg: list.msg });
		}
	}

	return (
		<div className={`relative ${loading ? "h-[100vh]" : ""}`}>
			{loading && <Loader />}
			<ErrorModal errormsg={errormsg} setErrormsg={setErrormsg} />
			<div className={`${loading ? "blur-sm" : ""}`}>
				<div className="md:pl-1 lg:pl-2 xl:pl-2 dark:text-white text-black">
					<div className="mb-2">
						<h2 className="text-left font-medium text-2xl xl:text-3xl lg:mb-8 xl:mb-10 xl:mt-1 ">
							Underwriter's Dashboard
						</h2>
					</div>
				</div>

				{opportunities.length === 0 ? (
					<div className="justify-center  flex ">
						<div className=" text-sm md:text-xl my-10">
							No Borrow requests are present at the moment.
						</div>
					</div>
				) : (
					<div className="mb-16">
						<div className="grid grid-cols-1 space-y-3 md:space-y-0 -mx-1   md:gap-3  md:grid-cols-2  md:mx-0.5 lg:mx-0.5 xl:gap-4 2xl:grid-cols-3 text-base ">
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
