import React, { useState, useEffect } from "react";
import { getBinaryFileData } from "../../../../services/fileHelper";
import { retrieveFiles } from "../../../../services/web3storageIPFS";
import DygnifyImage from "../../../../assets/Dygnify_Image.png";
import DollarImage from "../../../../assets/Dollar-icon.svg";

const PoolCard = ({ data }) => {
	const {
		opportunityInfo,
		opportunityAmount,
		estimatedAPY,
		capitalInvested,
		yieldGenerated,
	} = data;

	const [companyName, setCompanyName] = useState();
	const [poolName, setPoolName] = useState(data.poolName);

	useEffect(() => {
		// fetch the opportunity details from IPFS
		retrieveFiles(opportunityInfo, true).then((res) => {
			if (res) {
				let read = getBinaryFileData(res);
				read.onloadend = function () {
					let opJson = JSON.parse(read.result);
					if (opJson) {
						setCompanyName(opJson.company_name);
						setPoolName(opJson.loanName);
					}
				};
			}
		});
	}, []);

	return (
		<div className="flex flex-col gap-6 px-4 py-6 rounded-xl sm:px-8 lg:flex-row md:w-[49%] lg:w-[100%] xl:w-[48%] my-gradient">
			<div className="flex items-center gap-6">
				<img
					style={{ borderRadius: "50%", aspectRatio: "1/1" }}
					className="w-[7rem] lg:w-[12rem]"
					src={DygnifyImage}
				/>

				<div className="lg:hidden">
					<p className="text-xl font-semibold">{poolName}</p>
					<p className="text-lg">{companyName}Dygnify</p>
				</div>
			</div>

			<div className="flex flex-col gap-6 lg:w-[75%]">
				<div className="hidden lg:block">
					<p className="text-xl font-semibold">{poolName}</p>
					<p className="text-lg">{companyName}Dygnify</p>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex gap-1">
						<p className="text-lg font-medium">Pool Size</p>

						<img src={DollarImage} className="ml-auto w-[1rem]" />
						<p className="text-lg font-medium">{opportunityAmount}</p>
					</div>
					<div className="flex gap-1">
						<p className="text-lg font-medium">Capital Invested</p>

						<img src={DollarImage} className="ml-auto w-[1rem]" />
						<p className="text-lg font-medium">{capitalInvested}</p>
					</div>
					<div className="flex gap-1">
						<p className="text-lg font-medium">Estimated APY</p>

						<p className="text-lg font-medium ml-auto">{estimatedAPY}</p>
					</div>
					<div className="flex gap-1">
						<p className="text-lg font-medium">Yield Generated</p>

						<img src={DollarImage} className="ml-auto w-[1rem]" />
						<p className="text-lg font-medium">{yieldGenerated}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PoolCard;
