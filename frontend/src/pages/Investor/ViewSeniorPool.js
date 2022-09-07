import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TransactionCard from "./components/Cards/TransactionCard";
import axiosHttpService from "../../services/axioscall";
import { tokenTransactions } from "../../services/ApiOptions/blockchainTransactionDataOptions";
import InvestModal from "./components/Modal/InvestModal";
import {
	getUserWalletAddress,
	getWalletBal,
} from "../../services/BackendConnectors/userConnectors/commonConnectors";
import { getDisplayAmount } from "../../services/Helpers/displayTextHelper";
import Loader from "../../uiTools/Loading/Loader";
import ProcessingFundsModal from "./components/Modal/ProcessingFundsModal";
import DygnifyImage from "../../assets/Dygnify_Image.png";
import DollarImage from "../../assets/Dollar-icon.svg";

const ViewSeniorPool = () => {
	const location = useLocation();
	const defaultPoolName = "Senior Pool";
	const defaultAPY = "10";
	const defaultPoolAmount = 0;
	const [transactionData, setTransactionData] = useState([]);
	const [poolName, setPoolName] = useState(defaultPoolName);
	const [poolDescription, setPoolDescription] = useState();
	const [estimatedAPY, setEstimatedAPY] = useState(defaultAPY);
	const [poolAmount, setPoolAmount] = useState(defaultPoolAmount);
	const [selected, setSelected] = useState(null);
	const [processFundModal, setProcessFundModal] = useState();
	const [investProcessing, setInvestProcessing] = useState();
	const [kycStatus, setKycStatus] = useState(1);
	const [loading, setLoading] = useState(true);

	const handleDrawdown = () => {
		setSelected(null);
	};
	useEffect(() => {
		if (location.state) {
			setPoolName(
				location.state.opportunityName
					? location.state.opportunityName
					: defaultPoolName
			);
			setPoolDescription(
				location.state.poolDescription ? location.state.poolDescription : ""
			);
			setEstimatedAPY(
				location.state.estimatedAPY ? location.state.estimatedAPY : defaultAPY
			);
			setKycStatus(location.state.kycStatus ? location.state.kycStatus : false);
		}
	}, []);

	useEffect(() => {
		if (!kycStatus) {
			getUserWalletAddress()
				.then((address) => loadBlockpassWidget(address))
				.finally(() => setLoading(false));
		} else setLoading(false);
	}, []);

	const loadBlockpassWidget = (address) => {
		const blockpass = new window.BlockpassKYCConnect(
			process.env.REACT_APP_CLIENT_ID,
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
		axiosHttpService(tokenTransactions(process.env.REACT_APP_SENIORPOOL)).then(
			(transactionDetails) => {
				if (transactionDetails && transactionDetails.res) {
					setTransactionData(transactionDetails.res.result);
				}
			}
		);

		getWalletBal(process.env.REACT_APP_SENIORPOOL).then((amt) => {
			setPoolAmount(getDisplayAmount(amt));
		});
	}, []);

	return (
		<div className="">
			{loading && <Loader />}
			<div className={`${loading ? "blur-sm" : ""}`}>
				{selected ? (
					<InvestModal
						handleDrawdown={handleDrawdown}
						isSenior={true}
						poolName={poolName}
						estimatedAPY={estimatedAPY}
						setProcessFundModal={setProcessFundModal}
						setInvestProcessing={setInvestProcessing}
						setSelected={setSelected}
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
							<p className="text-lg font-semibold">{poolName}</p>
						</div>
					</div>
				</div>

				<div className="mt-[2.5em] md:mt-[3.5em] flex flex-col gap-[1.5em] md:flex-row md:items-start xl:gap-[5em] 2xl:gap-[8em]">
					<div className="md:w-[60%] ">
						<div className="flex items-center mb-4">
							<h2 className="text-xl font-semibold md:text-2xl">
								Pool Overview
							</h2>
						</div>

						<div className="text-neutral-200">{poolDescription}</div>
					</div>

					<div
						style={{
							backgroundImage:
								" linear-gradient(285.83deg, rgba(32, 35, 42, 0) 0%, #20232A 103.08%)",
						}}
						className="rounded-md px-4 py-6 border border-[#363637] flex flex-col gap-6 md:w-[22rem] xl:w-[25rem]"
					>
						<div className="flex">
							<div className="flex flex-col justify-start">
								<p className="text-neutral-200 font-bold text-md mb-2">
									Estimated APY.
								</p>
								<p className="text-neutral-200 font-bold text-md">
									Total Pool Balance
								</p>
							</div>

							<div className="ml-auto flex flex-col justify-start">
								<p className=" font-semibold text-xl mb-1 text-right">
									{estimatedAPY}%
								</p>
								<div className="flex gap-1 text-right">
									<img src={DollarImage} className="w-4" />
									<p className="font-semibold text-xl">{poolAmount}</p>
								</div>
							</div>
						</div>

						<label
							htmlFor={kycStatus ? "InvestModal" : ""}
							id={kycStatus ? "" : "blockpass-kyc-connect"}
							onClick={() => {
								if (kycStatus) return setSelected(true);
								else return null;
							}}
							style={{
								backgroundImage:
									"linear-gradient(81.75deg, #4B74FF 0%, #9281FF 100%)",
							}}
							className="cursor-pointer text-center py-2 rounded-[1.8em] sm:w-[50%] sm:mx-auto md:w-[100%]"
						>
							{kycStatus ? "Invest" : "Complete your KYC"}
						</label>
					</div>
				</div>

				<div className="mt-[3em] md:mt-[4em] md:w-[58%]">
					<h2 className="text-xl font-semibold md:text-2xl">Recent Activity</h2>
					{transactionData.length > 0 ? (
						<div className="mt-6 flex flex-col gap-3">
							{transactionData ? (
								transactionData.map((item) => (
									<TransactionCard
										key={transactionData.blockHash}
										data={item}
										address={process.env.REACT_APP_SENIORPOOL}
									/>
								))
							) : (
								<></>
							)}
						</div>
					) : (
						<p>Transaction details are not available at this moment</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ViewSeniorPool;
