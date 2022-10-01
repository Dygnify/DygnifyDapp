import React, { useState, useEffect } from "react";
import { getBinaryFileData } from "../../../../services/Helpers/fileHelper";
import { retrieveFiles } from "../../../../services/Helpers/web3storageIPFS";
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

	useEffect(() => {
		// fetch the opportunity details from IPFS
		retrieveFiles(opportunityInfo, true).then((res) => {
			if (res) {
				let read = getBinaryFileData(res);
				read.onloadend = function () {
					let opJson = JSON.parse(read.result);
					if (opJson) {
						setCompanyName(opJson.company_name);
					}
				};
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex flex-col gap-6 px-4 py-6 rounded-xl sm:px-8 lg:flex-row md:w-[48%] 2xl:w-[min(32%,30rem)]  my-gradient">
			<div className="flex items-center gap-6">
				<img
					style={{ borderRadius: "50%", aspectRatio: "1/1" }}
					className="w-[7rem] lg:w-[12rem]"
					src={DygnifyImage}
					alt=""
				/>

				<div className="lg:hidden">
					<p className="text-2xl font-semibold">{data?.opportunityName}</p>
					<p>{companyName}</p>
				</div>
			</div>

			<div className="flex flex-col gap-6 lg:w-[75%]">
				<div className="hidden lg:block">
					<p className="text-2xl font-semibold">{data?.opportunityName}</p>
					<p>{companyName}</p>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex gap-1 font-semibold">
						<p>Pool Size</p>

						<img src={DollarImage} className="ml-auto w-[1rem]" alt="" />
						<p>{opportunityAmount}</p>
					</div>
					<div className="flex gap-1 font-semibold">
						<p>Capital Invested</p>

						<img src={DollarImage} className="ml-auto w-[1rem]" alt="" />
						<p>{capitalInvested}</p>
					</div>
					<div className="flex gap-1 font-semibold">
						<p>Estimated APY</p>

						<p className=" ml-auto">{estimatedAPY}</p>
					</div>
					<div className="flex gap-1 font-semibold">
						<p>Yield Generated</p>

						<img src={DollarImage} className="ml-auto w-[1rem]" alt="" />
						<p>{yieldGenerated}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PoolCard;
