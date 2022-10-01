import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getBinaryFileData } from "../../../services/Helpers/fileHelper";
import { retrieveFiles } from "../../../services/Helpers/web3storageIPFS";
const TransactionsCard = ({ data }) => {
	const [companyName, setCompanyName] = useState();

	useEffect(() => {
		// fetch the opportunity details from IPFS
		retrieveFiles(data?.opportunityInfo, true).then((res) => {
			if (res) {
				let read = getBinaryFileData(res);
				read.onloadend = function () {
					let opJson = JSON.parse(read.result);
					if (opJson) {
						setCompanyName(opJson.companyDetails?.companyName);
					}
				};
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex collapse-title pr-0 justify-between w-full flex-wrap overflow-hidden dark:bg-[#20232A] bg-[#E7EAEE] rounded-xl mb-2 items-center">
			<p className="w-1/3 md:w-1/6 font-light text-lg text-start">
				{data?.opportunityName}
			</p>
			<p className="w-1/3 md:w-1/6 font-light text-lg text-start">
				{companyName}
			</p>
			<p className="w-1/3 md:w-1/6 font-light text-lg text-center hidden md:block">
				{data?.createdOn}
			</p>

			{(data?.status === "2" || data?.status >= "4") && (
				<p className="w-1/3 md:w-1/6 text-center">
					<div className="btn btn-xs btn-success approved-btn border-none px-2 text-base font-medium pb-6 pt-0 rounded-full capitalize">
						Approved
					</div>
				</p>
			)}
			{data?.status === "1" && (
				<p className="w-1/3 md:w-1/6 text-center ">
					<div className="btn btn-xs btn-success rejected-btn border-none px-2 text-base font-medium pb-6 pt-0 rounded-full capitalize">
						Rejected
					</div>
				</p>
			)}
			{data?.status === "3" && (
				<p className="w-1/3 md:w-1/6 text-center ">
					<div className="btn btn-xs btn-success unsured-btn border-none px-2 text-base font-medium pb-6 pt-0 rounded-full capitalize">
						Unsure
					</div>
				</p>
			)}
		</div>
	);
};

export default TransactionsCard;
