import React, { useState, useEffect } from "react";

import PrimaryButton from "../../../../uiTools/Button/PrimaryButton";
import {
	getBinaryFileData,
	getDataURLFromFile,
} from "../../../../services/fileHelper";
import { retrieveFiles } from "../../../../services/web3storageIPFS";

import DygnifyImage from "../../../../assets/Dygnify_Image.png";
import DollarImage from "../../../../assets/Dollar-icon.svg";

const ViewPoolCard = ({ onClick, data, kycStatus, className }) => {
	const { opportunityInfo, opportunityAmount, loanInterest, isFull } = data;

	const [companyName, setCompanyName] = useState();
	const [poolName, setPoolName] = useState(data?.poolName);
	const [logoImgSrc, setLogoImgSrc] = useState();

	useEffect(() => {
		// fetch the opportunity details from IPFS
		retrieveFiles(opportunityInfo, true).then((res) => {
			if (res) {
				let read = getBinaryFileData(res);
				read.onloadend = function () {
					let opJson = JSON.parse(read.result);
					if (opJson) {
						setCompanyName(opJson.company_name);
						setPoolName(opJson.loan_name);
						getCompanyLogo(
							opJson.companyDetails?.companyLogoFile?.businessLogoFileCID
						);
					}
				};
			}
		});
	}, []);

	const StatusButton = ({ className, isFullStatus }) => {
		return (
			<div
				style={{
					backgroundImage:
						"linear-gradient(97.78deg, #51B960 7.43%, #51B960 7.43%, #51B960 7.43%, #83DC90 90.63%)",
				}}
				className={`${className} text-black px-3 rounded-2xl`}
			>
				<p>{isFullStatus ? "Full" : "Open"}</p>
			</div>
		);
	};

	async function getCompanyLogo(cid) {
		if (!cid) {
			return;
		}
		try {
			retrieveFiles(cid, true).then((res) => {
				if (res) {
					let read = getDataURLFromFile(res);
					read.onloadend = function () {
						setLogoImgSrc(read.result);
						console.log(read.result);
					};
				}
			});
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div
			style={{
				backgroundImage:
					"linear-gradient(302.85deg, rgba(168, 154, 255, 0) -1.23%, rgba(168, 154, 255, 0.260833) 99.99%, rgba(168, 154, 255, 0.8) 100%)",
				boxShadow: "inset -1px -1px 1px rgba(185, 185, 185, 0.1)",
			}}
			className={`flex flex-col gap-6 px-4 py-6 rounded-xl sm:px-8 lg:flex-row ${className}`}
		>
			<div className="flex items-center gap-6">
				<img
					style={{ borderRadius: "50%", aspectRatio: "1/1" }}
					className="w-[7rem] lg:w-[12rem]"
					src={logoImgSrc ? logoImgSrc : DygnifyImage}
				/>

				<div className="lg:hidden">
					<p className="text-xl font-semibold">{poolName}</p>
					<p className="text-lg">{companyName}Dignify</p>
				</div>
			</div>

			<div className="flex flex-col gap-6 lg:w-[75%]">
				<div className="hidden lg:block">
					<p className="text-xl font-semibold">{poolName}</p>
					<p className="text-lg">{companyName}Dignify</p>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex gap-1">
						<p className="text-lg font-medium">Pool Size</p>
						<img src={DollarImage} className="ml-auto w-[1rem]" />
						<p className="text-lg font-medium">
							{opportunityAmount} {process.env.REACT_APP_TOKEN_NAME}
						</p>
					</div>

					<div className="flex">
						<p className="text-lg font-medium">Estimated APY</p>
						<p className="ml-auto text-lg font-medium">{loanInterest}</p>
					</div>
					<div className="flex">
						<p className="text-lg font-medium">Status</p>

						<StatusButton
							className="ml-auto text-lg font-medium"
							isFullStatus={isFull}
						/>
					</div>
				</div>

				<div className="">
					<PrimaryButton
						className="w-[100%] md:w-[70%] md:mx-auto lg:w-[100%]"
						onClick={onClick}
					>
						View Pool
					</PrimaryButton>
				</div>
			</div>
		</div>
	);
};

export default ViewPoolCard;
