import React, { useState, useEffect } from "react";
import { getBinaryFileData } from "../../../../services/fileHelper";
import { retrieveFiles } from "../../../../services/web3storageIPFS";
import DollarImage from "../../../../assets/Dollar-icon.svg";

const DueDateCard = ({ data }) => {
	const [poolName, setPoolName] = useState(data.poolName);

	useEffect(() => {
		// fetch the opportunity details from IPFS
		retrieveFiles(data?.opportunityInfo, true).then((res) => {
			if (res) {
				let read = getBinaryFileData(res);
				read.onloadend = function () {
					let opJson = JSON.parse(read.result);
					if (opJson) {
						setPoolName(opJson.loan_name);
					}
				};
			}
		});
	}, []);

	return (
		<div className="px-2 bg-darkmode-800 flex justify-around rounded-xl py-3 gap-4 md:gap-6 ">
			<p className="w-1/3 md:w-1/4 my-auto text-center ">{poolName}</p>
			<div className="hidden md:flex md:w-1/4  text-right pr-5 gap-1  justify-center">
				<img src={DollarImage} className="w-4" />
				{data?.opportunityAmount}
			</div>
			<div className="w-1/3 md:w-1/4 my-auto  text-right pr-5 flex gap-1  justify-center">
				<img src={DollarImage} className="w-4" />
				{data?.repaymentDisplayAmount}
			</div>
			<p className="w-1/3 md:w-1/4 text-center ">{data?.nextDueDate}</p>
		</div>
	);
};

export default DueDateCard;
