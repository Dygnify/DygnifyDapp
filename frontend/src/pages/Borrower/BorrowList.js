import React, { useEffect, useState } from "react";
import { getBorrowerDetails } from "../../services/BackendConnectors/userConnectors/borrowerConnectors";
import {
	getDrawdownOpportunities,
	getOpportunitysOf,
} from "../../services/BackendConnectors/opportunityConnectors";
import DrawdownCard from "./Components/Cards/DrawdownCard";
import OpportunityCardCollapsible from "./Components/Cards/OpportunityCardCollapsible";
import DashboardHeader from "./DashboardHeader";
import LoanFormModal from "./Components/Modal/LoanFormModal";
import axiosHttpService from "../../services/axioscall";
import { kycOptions } from "../../services/KYC/blockpass";

const BorrowList = () => {
	const [data, setData] = useState([]);
	const [opportunities, setOpportunities] = useState([]);
	const [selected, setSelected] = useState(null);

	const [loading, setLoading] = useState();
	const [kycStatus, setKycStatus] = useState();
	const [profileStatus, setProfileStatus] = useState();

	const handleForm = () => {
		setSelected(null);
	};

	useEffect(() => {
		const fetchData = async () => {
			let op = await getDrawdownOpportunities();
			if (op && op.length) {
				setData(op);
			}

			setLoading(false);
		};
		fetchData();
	}, []);

	useEffect(() => {
		getOpportunitysOf()
			.then((opportunityList) => {
				if (opportunityList && opportunityList.length) {
					opportunityList.sort(sortByProperty("epochCreationDate"));
					setOpportunities(opportunityList);
				}
				console.log(opportunityList);
			})
			.catch((error) => console.log(error));
	}, []);

	function sortByProperty(property) {
		return function (a, b) {
			if (a[property] < b[property]) return 1;
			else if (a[property] > b[property]) return -1;

			return 0;
		};
	}

	const checkForKycAndProfile = async (refId) => {
		try {
			const result = await axiosHttpService(kycOptions(refId));

			if (result.res.status === "success") setKycStatus(true);
			if (result.res.status === "error") {
				setKycStatus(false);
			}

			getBorrowerDetails().then((borrowerCID) => {
				console.log(borrowerCID);
				if (borrowerCID) setProfileStatus(true);
				else setProfileStatus(false);
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="">
			<DashboardHeader setSelected={setSelected} />
			{selected && (
				<LoanFormModal
					// key={drawdownList?.id}
					// data={drawdownList}
					handleForm={handleForm}
				></LoanFormModal>
			)}
			<div className="mt-8">
				<h2 className="font-semibold text-[1.4375rem] mb-4">Drawdown Funds</h2>
				{data.length === 0 ? (
					<div className="h-[10rem] flex items-center justify-center">
						<p className="text-lg font-semibold text-neutral-500">
							No drawdown available.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
						{data.map((item) => (
							<DrawdownCard key={item?.id} data={item} />
						))}
					</div>
				)}
			</div>

			<div className="my-16">
				<h2 className="font-semibold text-[1.4375rem]">Borrow Request</h2>

				<div className="collapse">
					<input type="checkbox" className="peer" />
					<div className="collapse-title my-4 font-bold flex gap-4 md:gap-8 text-center py-6 border-y border-darkmode-500">
						<p className="w-1/3 md:w-1/4 ">Pool name</p>
						<p className="hidden md:block w-1/4 ">Capital requested</p>
						<p className="w-1/3  md:w-1/4 ">Created on</p>
						<p className="w-1/3  md:w-1/4 ">Status</p>
					</div>
				</div>
				{opportunities.length === 0 ? (
					<div className="h-[10rem] flex items-center justify-center">
						<p className="text-lg font-semibold text-neutral-500">
							No borrow request available.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{opportunities
							? opportunities.map((item) => (
									<OpportunityCardCollapsible key={item.id} data={item} />
							  ))
							: null}
					</div>
				)}
			</div>
		</div>
	);
};

export default BorrowList;
