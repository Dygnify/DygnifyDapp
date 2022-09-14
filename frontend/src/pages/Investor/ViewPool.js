import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import InvestModal from "../Investor/components/Modal/InvestModal";
import TransactionCard from "./components/Cards/TransactionCard";
import {
	getUserWalletAddress,
	getWalletBal,
} from "../../services/BackendConnectors/userConnectors/commonConnectors";
import axiosHttpService from "../../services/axioscall";
import Twitter from "../SVGIcons/Twitter";
import Website from "../SVGIcons/Website";
import LinkedIn from "../SVGIcons/LinkedIn";
import {
	getBinaryFileData,
	getDataURLFromFile,
} from "../../services/Helpers/fileHelper";
import { retrieveFiles } from "../../services/Helpers/web3storageIPFS";
import { getExtendableTextBreakup } from "../../services/Helpers/displayTextHelper";
import { getDisplayAmount } from "../../services/Helpers/displayTextHelper";
import { tokenTransactions } from "../../services/ApiOptions/blockchainTransactionDataOptions";
import Loader from "../../uiTools/Loading/Loader";
import ProcessingFundsModal from "./components/Modal/ProcessingFundsModal";
import DygnifyImage from "../../assets/Dygnify_Image.png";
import UpArrow from "../SVGIcons/UpArrow";
import DollarImage from "../../assets/Dollar-icon.svg";

const ViewPool = () => {
	const location = useLocation();
	const [poolData, setPoolData] = useState();
	const [transactionData, setTransactionData] = useState([]);
	const [expand, setExpand] = useState(false);
	const [companyDetails, setCompanyDetails] = useState();
	const [kycStatus, setKycStatus] = useState();
	const [error, setError] = useState();
	const [poolBal, setPoolBal] = useState();
	const [info, setInfo] = useState([]);
	const [info2, setInfo2] = useState([]);
	const [loanPurpose, setLoanPurpose] = useState({
		isSliced: false,
		firstText: "",
		secondText: "",
	});
	const [selected, setSelected] = useState(null);
	const [logoImgSrc, setLogoImgSrc] = useState();
	const [processFundModal, setProcessFundModal] = useState();
	const [investProcessing, setInvestProcessing] = useState();

	const [loading, setLoading] = useState(true);
	const [invest, setInvest] = useState(12);
	const [transactionList, setTransactionList] = useState(13);

	const handleDrawdown = () => {
		setSelected(null);
	};

	const loadBlockpassWidget = (address) => {
		const blockpass = new window.BlockpassKYCConnect(
			process.env.REACT_APP_CLIENT_ID, // service client_id from the admin console
			{
				refId: address, // assign the local user_id of the connected user
			}
		);

		blockpass.startKYCConnect();

		blockpass.on("KYCConnectSuccess", () => {
			//add code that will trigger when data have been sent.
		});
	};

	useEffect(() => {
		getUserWalletAddress()
			.then((address) => loadBlockpassWidget(address))
			.finally(() => setLoading(false));
		if (location?.state) {
			setPoolData(location.state);
			setKycStatus(
				location.state?.kycStatus ? location.state?.kycStatus : false
			);
		}
	}, []);

	useEffect(() => {
		if (poolData) {
			console.log("************", poolData);
			loadInfo();
			console.log(poolData);
			// get pool balance
			getWalletBal(poolData.opportunityPoolAddress).then((amt) => {
				if (amt) {
					setPoolBal(getDisplayAmount(amt));
				}
			});

			// fetch the opportunity details from IPFS
			retrieveFiles(poolData.opportunityInfo, true).then((res) => {
				if (res) {
					let read = getBinaryFileData(res);
					read.onloadend = function () {
						let opJson = JSON.parse(read.result);
						if (opJson) {
							setCompanyDetails(opJson.companyDetails);
							getCompanyLogo(
								opJson.companyDetails?.companyLogoFile?.businessLogoFileCID
							);
							// get the loan purpose
							const { isSliced, firstText, secondText } =
								getExtendableTextBreakup(opJson.loan_purpose, 200);

							if (isSliced) {
								setLoanPurpose({
									firstText: firstText,
									secondText: secondText,
									isSliced: isSliced,
								});
							} else {
								setLoanPurpose({
									firstText: firstText,
									isSliced: isSliced,
								});
							}
						}
					};
				}
			});
		}
	}, [poolData, invest]);

	useEffect(() => {
		if (poolData) {
			// get Pool Transaction Data
			axiosHttpService(tokenTransactions(poolData.opportunityPoolAddress))
				.then((transactionDetails) => {
					if (transactionDetails && transactionDetails.res) {
						setTransactionData(transactionDetails.res.result);
					}
				})
				.catch((error) => console.log(error));
		}
	}, [poolData, transactionList]);

	function loadInfo() {
		if (poolData) {
			setInfo([
				{
					label: "Interest Rate",
					value: poolData.loanInterest ? poolData.loanInterest : "--",
				},
				{
					label: "Payment Tenure",
					value: poolData.loanTenure ? poolData.loanTenure : "--",
				},
				{
					label: "Drawdown Cap",
					value: poolData.opportunityAmount ? poolData.opportunityAmount : "--",
				},
			]);

			setInfo2([
				{
					label: "Opening Date",
					value: poolData.createdOn ? poolData.createdOn : "--",
				},
				{
					label: "Payment Frequency",
					value: poolData.paymentFrequencyInDays
						? poolData.paymentFrequencyInDays
						: "--",
				},
				{
					label: "Borrower Address",
					value: poolData.borrowerDisplayAdd
						? poolData.borrowerDisplayAdd
						: "--",
				},
			]);
		}
	}

	const redirectToURl = (event) => {
		let url;
		switch (event.target.id) {
			case "twitter":
				url = poolData.twitter;
				break;
			case "linkedin":
				url = poolData.linkedin;
				break;
			case "website":
				url = poolData.website;
				break;
		}

		if (url) {
			let protocol = "https://";
			let position = url.search(protocol);
			// if there is no "https://" in the url then it is not opened correctly
			if (position === -1) {
				url = protocol + url;
			}
			window.open(url, "_blank");
		}
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
		<div>
			{loading && <Loader />}
			<div className={`${loading ? "blur-sm" : ""}`}>
				{selected ? (
					<InvestModal
						handleDrawdown={handleDrawdown}
						isSenior={false}
						poolAddress={poolData?.opportunityPoolAddress}
						poolName={poolData?.opportunityName}
						poolLimit={poolData?.opportunityAmount}
						estimatedAPY={poolData?.loanInterest}
						setProcessFundModal={setProcessFundModal}
						setInvestProcessing={setInvestProcessing}
						setSelected={setSelected}
						setInvest={setInvest}
						setTransactionList={setTransactionList}
					/>
				) : null}

				{processFundModal ? (
					<ProcessingFundsModal investProcessing={investProcessing} />
				) : (
					<></>
				)}

				<div className=" flex items-center">
					<div className="flex items-center gap-3 md:gap-5">
						<img
							src={DygnifyImage}
							style={{ aspectRatio: "1/1" }}
							className="rounded-[50%] w-[4em] sm:w-[5em] md:w-[6em]"
						/>

						<div>
							<p className="text-lg font-semibold">
								{poolData?.opportunityName}
							</p>
							<p className="text-neutral-500">
								{companyDetails ? companyDetails.companyName : ""}
							</p>
						</div>
					</div>

					{/* social links */}
					<div className="ml-auto flex items-center gap-3 sm:gap-6 md:gap-4 text-white">
						{companyDetails && companyDetails.linkedin ? (
							<button
								id="linkedin"
								onClick={redirectToURl}
								className="flex items-center gap-2 md:py-[0.5em] md:px-4 md:rounded-[1.8em] md:bg-darkmode-500 cursor-pointer"
							>
								<LinkedIn className="w-6" />
								<p className="hidden md:block font-medium ">LinkedIn</p>
							</button>
						) : (
							<></>
						)}

						{companyDetails && companyDetails.website ? (
							<button
								id="website"
								onClick={redirectToURl}
								className="flex items-center gap-2 md:py-[0.5em] md:px-4 md:rounded-[1.8em] md:bg-darkmode-500 cursor-pointer"
							>
								<Website className="w-6" />
								<p className="hidden md:block font-medium">Website</p>
							</button>
						) : (
							<></>
						)}
						{companyDetails && companyDetails.twitter ? (
							<button
								id="twitter"
								onClick={redirectToURl}
								className="flex items-center gap-2 md:py-[0.5em] md:px-4 md:rounded-[1.8em] md:bg-darkmode-500 cursor-pointer"
							>
								<Twitter className="w-6" />
								<p className="hidden md:block font-medium">Twitter</p>
							</button>
						) : (
							<></>
						)}
					</div>
				</div>

				<div className="mt-[2.5em] md:mt-[3.5em] flex flex-col gap-[1.5em] md:flex-row md:items-start xl:gap-[5em] 2xl:gap-[8em]">
					<div className="md:w-[60%]">
						<div className="flex items-center mb-4">
							<h2 className="text-xl font-semibold md:text-2xl">
								Deals Overview
							</h2>
							{/* <div className="ml-auto flex gap-2 items-center px-3 py-1 rounded-[1.5em] bg-darkmode-500 cursor-pointer">
								View Details <UpArrow />
							</div> */}
						</div>

						{loanPurpose.isSliced ? (
							<div className="text-neutral-700 dark:text-neutral-200">
								{loanPurpose.firstText}
								<a
									onClick={() => setExpand(true)}
									className="cursor-pointer font-semibold"
								>
									{expand ? null : " ...view more"}
								</a>
								{expand ? <span>{loanPurpose.secondText}</span> : null}
								<a
									onClick={() => setExpand(false)}
									className="cursor-pointer font-semibold"
								>
									{expand ? " view less" : null}
								</a>
							</div>
						) : (
							<div className="text-neutral-700 dark:text-neutral-200">
								{loanPurpose.firstText}{" "}
							</div>
						)}
					</div>

					<div className="rounded-md px-4 py-6 border dark:border-[#363637] flex flex-col gap-6 md:w-[22rem] xl:w-[25rem] bg-gradient-to-tl from-[#ffffff00] dark:from-[#20232a00] to-[#D1D1D1] dark:to-[#20232A]">
						<div className="flex ">
							<div className="flex flex-col justify-start text-neutral-500 dark:text-neutral-200">
								<p className=" font-bold text-md mb-2">Estimated APY.</p>

								<p className=" font-bold text-md mb-2">Pool Limit</p>

								<p className=" font-bold text-md mb-2">Total supplied</p>

								<p className=" font-bold text-md mb-2">Payment terms</p>
								<p className=" font-bold text-md mb-2">Payment frequency</p>
							</div>
							<div className="ml-auto flex flex-col justify-start">
								<p className="font-semibold text-xl mb-1">
									{poolData ? poolData.loanInterest : "--"}
								</p>

								<p className="font-semibold text-xl mb-1 flex gap-1 items-center">
									<img src={DollarImage} className="w-4" />
									{poolData ? poolData.opportunityAmount : "--"}
								</p>
								<p className="font-semibold text-xl mb-1 flex gap-1 items-center">
									<img src={DollarImage} className="w-4" />
									{poolBal ? poolBal : "--"}
								</p>
								<p className="font-semibold text-xl mb-1">
									{poolData ? poolData.loanTenure : "--"}
								</p>
								<p className="font-semibold text-xl mb-1">
									{poolData ? poolData.paymentFrequencyInDays : "--"}
								</p>
							</div>
						</div>

						<label
							htmlFor={kycStatus ? "InvestModal" : ""}
							id={kycStatus ? "" : "blockpass-kyc-connect"}
							onClick={() => {
								if (kycStatus) return setSelected(true);
								else return null;
							}}
							className="cursor-pointer text-center py-2 bg-gradient-to-r from-[#4b74ff] to-[#9281ff] rounded-[1.8em] sm:w-[50%] sm:mx-auto md:w-[100%] text-white"
						>
							{kycStatus ? "Invest" : "Complete your KYC"}
						</label>
					</div>
				</div>

				{/* Deal Terms */}

				{/* <div style={{ display: "flex" }} className="flex-col w-1/2">
					<div
						style={{ display: "flex" }}
						className="flex-row justify-between mt-10 mb-3"
					>
						<div style={{ fontSize: 19, fontWeight: "600" }} className="mb-0">
							Deals terms
						</div>
					</div>

					<div
						className=" flex-col  justify-center w-full rounded-box"
						style={{
							display: "flex",
							background: " #20232A",
							borderRadius: "12px",
						}}
					>
						<div style={{ display: "flex" }} className="w-full">
							{info.map((e) => {
								<div
									key={e.label}
									className="justify-center w-1/3 flex-col items-center "
									style={{
										display: "flex",
										borderRight: "0.5px solid   #292C33",
										borderBottom: "0.5px solid   #292C33",
										padding: "40px 0",
									}}
								>
									<div
										style={{
											fontSize: 14,
											color: "#A0ABBB",
										}}
									>
										{e.label}
									</div>
									<div style={{ fontSize: 20 }}>{e.value}</div>
								</div>;
							})}
						</div>

						<div style={{ display: "flex" }} className="w-full">
							{info2.map((e) => {
								<div
									key={e.label}
									className="justify-center w-1/3 flex-col items-center "
									style={{
										display: "flex",
										borderRight: "0.5px solid   #292C33",
										padding: "40px 0",
									}}
								>
									<div
										style={{
											fontSize: 14,
											color: "#A0ABBB",
										}}
									>
										{e.label}
									</div>
									<div style={{ fontSize: 20 }}>{e.value}</div>
								</div>;
							})}
						</div>
					</div>
				</div> */}

				<div className="mt-[3em] md:mt-[4em] md:w-[58%]">
					<h2 className="text-xl font-semibold md:text-2xl">Recent Activity</h2>

					<div className="mt-6 flex flex-col gap-3">
						{transactionData?.length ? (
							<>
								{transactionData.map((item) => (
									<TransactionCard
										key={item.hash}
										data={item}
										address={poolData.opportunityPoolAddress}
									/>
								))}
							</>
						) : (
							<p>Transaction details are not available at this moment</p>
						)}
					</div>
				</div>

				<div className="mt-[5em] md:w-[58%]">
					<h2 className="text-xl font-semibold md:text-2xl mb-6">
						Borrower Details
					</h2>

					<div>
						<div className=" flex items-center">
							<div className="flex items-center gap-3 md:gap-5">
								<img
									src={logoImgSrc}
									style={{ aspectRatio: "1/1" }}
									className="rounded-[50%] w-[4em] sm:w-[5em] md:w-[6em]"
								/>

								<div>
									<p className="text-lg font-semibold">
										{companyDetails?.companyName}
									</p>
								</div>
							</div>

							<div className="ml-auto flex items-center gap-3 sm:gap-6 md:gap-4 text-white">
								{companyDetails && companyDetails.linkedin ? (
									<div className="flex items-center gap-2 md:py-[0.5em] md:px-4 md:rounded-[1.8em] md:bg-darkmode-500 cursor-pointer">
										<LinkedIn className="w-6" />
										<p className="hidden md:block font-medium">LinkedIn</p>
									</div>
								) : (
									<></>
								)}

								{companyDetails && companyDetails.website ? (
									<div className="flex items-center gap-2 md:py-[0.5em] md:px-4 md:rounded-[1.8em] md:bg-darkmode-500 cursor-pointer">
										<Website className="w-6 " />
										<p className="hidden md:block font-medium">Website</p>
									</div>
								) : (
									<></>
								)}

								{companyDetails && companyDetails.twitter ? (
									<div className="flex items-center gap-2 md:py-[0.5em] md:px-4 md:rounded-[1.8em] md:bg-darkmode-500 cursor-pointer">
										<Twitter className="w-6" />
										<p className="hidden md:block font-medium">Twitter</p>
									</div>
								) : (
									<></>
								)}
							</div>
						</div>
						<div className="mt-4 text-neutral-700 dark:text-neutral-200">
							{companyDetails
								? companyDetails.companyBio
								: "Unable to fetch company profile"}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewPool;
