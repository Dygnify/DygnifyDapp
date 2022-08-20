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
import Loader from "../../tools/Loading/Loader";

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
		retrieveFiles(process.env.REACT_APP_SENIORPOOL_CID, true).then(
			(res) => {
				if (res) {
					let read = getBinaryFileData(res);
					read.onloadend = async function () {
						let spJson = JSON.parse(read.result);
						if (spJson) {
							let seniorInvestmentData = {};
							seniorInvestmentData.poolName = spJson.poolName;
							seniorInvestmentData.opportunityAmount =
								getDisplayAmount(
									await getWalletBal(
										process.env.REACT_APP_SENIORPOOL
									)
								);
							seniorInvestmentData.loanInterest =
								spJson.estimatedAPY + "%";
							seniorInvestmentData.poolDescription =
								spJson.poolDescription;
							seniorInvestmentData.isFull = false;
							setSeniorPool(seniorInvestmentData);
							setSeniorPoolLoading(false);
						}
					};
				}
			}
		);
	}, []);

	const loadingCard = (
		<ViewPoolCard
			onClick={() => console.log("card for loading")}
			data={cardData.current}
		/>
	);

	return (
		<>
			<div className="px-5">
				<div
					style={{ display: "flex" }}
					className="items-center justify-between mb-14 "
				>
					<h2
						className="text-left font-bold text-white"
						style={{ fontSize: 28, marginLeft: -20 }}
					>
						Investment Pools
					</h2>
				</div>
			</div>

			<div className="mb-16 ">
				<h2 style={{ fontSize: 24 }} className=" mb-5">
					Senior pools
				</h2>

				<div className="">
					{seniorPoolLoading && (
						<div className="relative inline-block">
							<Loader />
							<div className="blur-sm">{loadingCard}</div>
						</div>
					)}
					{seniorPool ? (
						<div
							style={{ display: "flex" }}
							className="gap-4 w-1/2"
						>
							<ViewPoolCard
								onClick={() =>
									path(
										"/investor-dashboardN/viewSeniorPool",
										{
											state: {
												...seniorPool,
												kycStatus: kycStatus,
											},
										}
									)
								}
								data={seniorPool}
							/>
						</div>
					) : (
						<div
							style={{ display: "flex" }}
							className="justify-center"
						>
							<div
								style={{
									color: "#64748B",
									fontSize: 18,
									marginTop: 10,
								}}
							>
								{seniorPoolLoading
									? ""
									: "No senior pool investments are available."}
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="mb-16">
				<h2 className="text-xl mb-5" style={{ fontSize: 24 }}>
					Junior pools
				</h2>

				<div
					className={`relative ${
						juniorPoolLoading ? "h-[18rem]" : ""
					}`}
				>
					{juniorPoolLoading && <Loader />}
					{juniorPools.length === 0 ? (
						<div
							style={{ display: "flex" }}
							className="justify-center "
						>
							<div
								style={{
									color: "#64748B",
									fontSize: 18,
									marginTop: 10,
								}}
							>
								{juniorPoolLoading
									? ""
									: "No junior pool investments are available."}
							</div>
						</div>
					) : (
						<div
							style={{ display: "flex" }}
							className=" gap-4 w-1/2"
						>
							{juniorPools.map((item) => (
								<ViewPoolCard
									data={item}
									key={item.id}
									//send data params
									onClick={() =>
										path("/investor-dashboardN/viewPool", {
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
		</>
	);
};

export default Invest;
<h2>Invest</h2>;
