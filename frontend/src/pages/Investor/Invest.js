import React, { useState, useEffect, useRef } from "react";
import ViewPoolCard from "./components/Cards/ViewPoolCard";
import { useNavigate } from "react-router-dom";
import {
	getAllActiveOpportunities,
	getUserWalletAddress,
	getWalletBal,
} from "../../components/transaction/TransactionHelper";
import { retrieveFiles } from "../../services/web3storageIPFS";
import { getBinaryFileData } from "../../services/fileHelper";
import { getDisplayAmount } from "../../services/displayTextHelper";
import axiosHttpService from "../../services/axioscall";
import { kycOptions } from "../../services/KYC/blockpass";
import Loader from "../../uiTools/Loading/Loader";

const Invest = () => {
	const path = useNavigate();
	const [juniorPools, setJuniorPools] = useState([]);
	const [seniorPool, setSeniorPool] = useState();

	const [kycStatus, setKycStatus] = useState();

	const [seniorPoolLoading, setSeniorPoolLoading] = useState(true);
	const [juniorPoolLoading, setJuniorPoolLoading] = useState(true);
	const cardData = useRef({
		opportunityInfo: "",
		opportunityAmount: "",
		loanInterest: "",
		isFull: "",
	});

	useEffect(() => {
		getUserWalletAddress().then((address) => checkForKyc(address));
	}, []);

	const checkForKyc = async (refId) => {
		try {
			console.log("reached");
			const result = await axiosHttpService(kycOptions(refId));
			console.log(result, result.res.status);
			if (result.res.status === "success") setKycStatus(true);
			if (result.res.status === "error") {
				setKycStatus(false);
			}

			console.log(kycStatus);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		try {
			getAllActiveOpportunities().then((juniorPool) => {
				if (juniorPool && juniorPool.length) {
					setJuniorPools(juniorPool);
					setJuniorPoolLoading(false);
				}
			});
		} catch (error) {
			console.log(error);
			setJuniorPoolLoading(false);
		}
	}, []);

	useEffect(() => {
		// fetch data from IPFS
		retrieveFiles(process.env.REACT_APP_SENIORPOOL_CID, true).then((res) => {
			if (res) {
				let read = getBinaryFileData(res);
				read.onloadend = async function () {
					let spJson = JSON.parse(read.result);
					if (spJson) {
						let seniorInvestmentData = {};
						seniorInvestmentData.poolName = spJson.poolName;
						seniorInvestmentData.opportunityAmount = getDisplayAmount(
							await getWalletBal(process.env.REACT_APP_SENIORPOOL)
						);
						seniorInvestmentData.loanInterest = spJson.estimatedAPY + "%";
						seniorInvestmentData.poolDescription = spJson.poolDescription;
						seniorInvestmentData.isFull = false;
						setSeniorPool(seniorInvestmentData);
						setSeniorPoolLoading(false);
					}
				};
			}
		});
	}, []);

	const loadingCard = (
		<ViewPoolCard
			onClick={() => console.log("card for loading")}
			data={cardData.current}
		/>
	);

	return (
		<div className="">
			<div className="mb-4">
				<h2 className="text-white font-semibold text-3xl md:text-4xl lg:text-5xl">
					Investment pools,
				</h2>
			</div>

			<div className="py-4">
				<div className="flex flex-col gap-5 mb-[3rem] md:mb-[4rem]">
					<h2 className="text-2xl font-semibold">Senior pool</h2>

					<div className="">
						{seniorPoolLoading && (
							<div className="relative inline-block">
								<Loader />
								<div className="blur-sm">{loadingCard}</div>
							</div>
						)}
						{seniorPool ? (
							<ViewPoolCard
								onClick={() =>
									path("/investor-dashboard/viewSeniorPool", {
										state: {
											...seniorPool,
											kycStatus: kycStatus,
										},
									})
								}
								data={seniorPool}
							/>
						) : (
							<div className="text-center">
								<p className="text-neutral-500 text-lg">
									{seniorPoolLoading
										? ""
										: "No senior pool investments are available."}
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-5">
					<h2 className="text-2xl font-semibold">Junior pools</h2>

					<div className={`relative ${juniorPoolLoading ? "h-[18rem]" : ""}`}>
						{juniorPoolLoading && <Loader />}
						{juniorPools.length === 0 ? (
							<div className="text-center">
								<p className="text-neutral-500 text-lg">
									{juniorPoolLoading
										? ""
										: "No senior pool investments are available."}
								</p>
							</div>
						) : (
							<div className="flex flex-col md:flex-row flex-wrap gap-5 md:gap-[1.8vw]">
								{juniorPools.map((item) => (
									<ViewPoolCard
										data={item}
										key={item.id}
										onClick={() =>
											path("/investor-dashboard/viewPool", {
												state: {
													...item,
													kycStatus: kycStatus,
												},
											})
										}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Invest;
<h2>Invest</h2>;
