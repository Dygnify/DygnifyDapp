import React, { useState, useEffect } from "react";
import { getBinaryFileData } from "../../../../services/Helpers/fileHelper";
import { retrieveFiles } from "../../../../services/Helpers/web3storageIPFS";
import DygnifyImage from "../../../../assets/Dygnify_Image.png";
import DollarImage from "../../../../assets/Dollar-icon.svg";

const WithdrawCard = ({ data, isSeniorPool, setSelected, setShowModal }) => {
	const {
		opportunityInfo,
		opportunityAmount,
		estimatedAPY,
		capitalInvested,
		withdrawableAmt,
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
					<p className="text-[1.4375rem] font-semibold">{poolName}</p>
					<p className="">{companyName}</p>
				</div>
			</div>

			<div className="flex flex-col gap-6 lg:w-[75%]">
				<div className="hidden lg:block">
					<p className="text-[1.4375rem] font-semibold">{poolName}</p>
					<p className="">{companyName}</p>
				</div>

				<div className="flex flex-col gap-1 font-semibold">
					<div className="flex gap-1">
						<p className="">Pool Size</p>

						<img src={DollarImage} className="ml-auto w-[1rem]" />
						<p className="">{opportunityAmount}</p>
					</div>

					<div className="flex gap-1">
						<p className="">Capital Invested</p>

						<img src={DollarImage} className="ml-auto w-[1rem]" />
						<p className="">{capitalInvested}</p>
					</div>

					<div className="flex gap-1">
						<p className="">Estimated APY</p>
						<p className=" ml-auto">{estimatedAPY}</p>
					</div>

					<div className="flex gap-1">
						<p className="">Available for Withdrawal</p>

						<img src={DollarImage} className="ml-auto w-[1rem]" />
						<p className="">{withdrawableAmt ? withdrawableAmt : "- -"}</p>
					</div>
				</div>

				<div>
					<button
						disable={false}
						onClick={() => {
							setSelected({ ...data, poolName, isSeniorPool });
							setShowModal(true);
						}}
						style={{
							borderRadius: "100px",
							padding: "12px 24px",
							color: "white",
						}}
						className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full py-[0.4rem] font-semibold flex fill-white  items-center justify-center w-[100%] sm:w-[60%] mx-auto md:w-[70%] md:mx-auto xl:w-[100%] 2xl:w-[60%]"
					>
						Withdraw Funds
					</button>
				</div>
			</div>
		</div>
	);
};

export default WithdrawCard;
