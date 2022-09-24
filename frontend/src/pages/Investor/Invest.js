import React, { useState, useEffect, useRef } from "react";
import ViewPoolCard from "./components/Cards/ViewPoolCard";
import { useNavigate } from "react-router-dom";
import { getAllActiveOpportunities } from "../../services/BackendConnectors/opportunityConnectors";
import {
	getUserWalletAddress,
	getWalletBal,
} from "../../services/BackendConnectors/userConnectors/commonConnectors";
import { retrieveFiles } from "../../services/Helpers/web3storageIPFS";
import { getBinaryFileData } from "../../services/Helpers/fileHelper";
import { getDisplayAmount } from "../../services/Helpers/displayTextHelper";
import axiosHttpService from "../../services/axioscall";
import { kycOptions } from "../../services/KYC/blockpass";
import Loader from "../../uiTools/Loading/Loader";
import ErrorModal from "../../uiTools/Modal/ErrorModal";

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
	const [errormsg, setErrormsg] = useState({
		status: false,
		msg: "",
	});

	useEffect(() => {
		getUserWalletAddress().then((res) => {
			if (res.success) {
				checkForKyc(res.address);
			} else {
				console.log(res.msg);
				setErrormsg({
					status: !res.success,
					msg: res.msg,
				});
			}
		});
	}, []);

	const checkForKyc = async (refId) => {
		try {
			console.log("reached");
			const result = await axiosHttpService(kycOptions(refId));
			console.log(result, result.res.status);
			if (
				result.res.status === "success" &&
				result.res.data.status === "approved"
			) {
				setKycStatus(true);
			}
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
			getAllActiveOpportunities().then((res) => {
				console.log("*****", res);
				if (res.opportunities && res.opportunities.length) {
					setJuniorPools(res.opportunities);
					setJuniorPoolLoading(false);
				} else {
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
						seniorInvestmentData.opportunityName = spJson.poolName;
						const res = await getWalletBal(process.env.REACT_APP_SENIORPOOL);

						if (res.success) {
							seniorInvestmentData.opportunityAmount = getDisplayAmount(
								res.balance
							);
							seniorInvestmentData.loanInterest = spJson.estimatedAPY + "%";
							seniorInvestmentData.poolDescription = spJson.poolDescription;
							seniorInvestmentData.isFull = false;
							setSeniorPool(seniorInvestmentData);
						} else {
							console.log(res.msg);
							setErrormsg({
								status: !res.success,
								msg: res.msg,
							});
						}

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
			<ErrorModal errormsg={errormsg} setErrormsg={setErrormsg} />
			<div className="mb-4">
				<h2 className="font-semibold text-[1.4375rem] lg:text-[2.0625rem] ">
					Investment pools
				</h2>
			</div>

			<div className="py-4">
				<div className="flex flex-col gap-5 mb-[3rem] md:mb-[4rem]">
					<h2 className="font-semibold text-[1.4375rem] md:text-[1.75rem]">
						Senior pool
					</h2>

					<div className="">
						{seniorPoolLoading && (
							<div className="relative">
								<Loader />
								<div className="blur-sm">{loadingCard}</div>
							</div>
						)}
						{seniorPool ? (
							<ViewPoolCard
								onClick={() =>
									path("/investorDashboard/viewSeniorPool", {
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
					<h2 className="font-semibold text-[1.4375rem] md:text-[1.75rem]">
						Junior pools
					</h2>

					<div className={`relative ${juniorPoolLoading ? "h-[18rem]" : ""}`}>
						{juniorPoolLoading && <Loader />}
						{juniorPools.length === 0 ? (
							<div className="text-center">
								<p className="text-neutral-500 text-lg">
									{juniorPoolLoading
										? ""
										: "No junior pool investments are available."}
								</p>
							</div>
						) : (
							<div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
								{juniorPools.map((item) => (
									<ViewPoolCard
										data={item}
										key={item.id}
										onClick={() =>
											path("/investorDashboard/viewPool", {
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
