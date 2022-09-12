import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../uiTools/Button/PrimaryButton";
import {
	getBinaryFileData,
	getDataURLFromFile,
} from "../../../services/Helpers/fileHelper";
import { retrieveFiles } from "../../../services/Helpers/web3storageIPFS";
import dollarIcon from "../../../assets/Dollar-icon.svg";

const UnderwriterCard = ({ data }) => {
	const path = useNavigate();
	const [companyName, setCompanyName] = useState();
	const [poolDetails, setPoolDetails] = useState();
	const [logoImgSrc, setLogoImgSrc] = useState();
	useEffect(() => {
		// fetch the opportunity details from IPFS
		retrieveFiles(data?.opportunityInfo, true).then((res) => {
			let opJson;
			if (res) {
				let read = getBinaryFileData(res);
				read.onloadend = function () {
					opJson = JSON.parse(read.result);

					if (opJson) {
						setPoolDetails({ ...data, ...opJson });
						setCompanyName(opJson.companyDetails?.companyName);
						getCompanyLogo(
							opJson.companyDetails?.companyLogoFile?.businessLogoFileCID
						);
					}
				};
			}
		});
	}, []);

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
						// console.log(read.result);
					};
				}
			});
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="my-gradient dark:text-white text-black max-w-lg md:max-w-full rounded-2xl grid  grid-1 overflow-hidden  pt-7 lg:pt-0 lg:grid-cols-10  xl:pr-5 2xl:gap-3 md:px-2 lg:pr-5">
			{/* section-1 */}
			<div className="flex-row flex space-x-5 px-4 col-span-4 lg:pl-5 lg:pr-1">
				<img
					src={logoImgSrc}
					className="w-28 h-28 lg:my-auto rounded-full xl:w-36  xl:h-36 2xl:w-[7.5rem] 2xl:h-[7.5rem]"
				/>
				<div className="mt-7 -space-y-1 lg:hidden ">
					<p className="font-medium text-2xl">
						{data.opportunityName ? data.opportunityName : "Name of Pool"}
					</p>
					<p className="font-light text-sm">
						{companyName ? companyName : "Name of Company"}
					</p>
				</div>
			</div>
			{/* section-2 */}
			<div className="col-span-6 xl:-ml-4">
				{/* section-2-1  */}
				<div className="mt-5 px-4 lg:pr-4 lg:pl-1 ">
					<div className="hidden -space-y-1 lg:block lg:my-7 ">
						<p className="font-medium text-2xl">
							{data.opportunityName ? data.opportunityName : "Name of Pool"}
						</p>
						<p className="font-light text-sm">
							{companyName ? companyName : "Name of Company"}
						</p>
					</div>
					<div className="flex justify-between space-y-1 font-medium">
						<p>Pool Size</p>
						<p className="flex gap-1 justify-center">
							<p className="w-6 h-6">
								<img src={dollarIcon} alt="" />
							</p>
							{data.opportunityAmount}
						</p>
					</div>
					<div className="flex justify-between space-y-1  font-medium ">
						<p>Interest Rate</p>
						<p>{data.loanInterest}</p>
					</div>
					<div className="flex justify-between space-y-1  font-medium ">
						<p>Created On</p>
						<p>{data.createdOn}</p>
					</div>
				</div>
				{/* section-2-2*/}
				<div className="flex mt-5 justify-center mb-5  px-4  lg:px-1 ">
					{/* add (place-items-center) for button center */}
					<PrimaryButton
						disable={false}
						onClick={() =>
							path("/underwriterDashboard/poolDetail", {
								state: { pool: poolDetails, images: logoImgSrc },
							})
						}
					>
						View details
					</PrimaryButton>
				</div>
			</div>
		</div>
	);
};

export default UnderwriterCard;
