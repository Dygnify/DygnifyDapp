import React, { useState, useEffect } from "react";
import { getBinaryFileData } from "../../../../services/fileHelper";
import { retrieveFiles } from "../../../../services/web3storageIPFS";
import DoughnutChart from "../../../Components/DoughnutChart";
import DollarImage from "../../../../assets/Dollar-icon.svg";

const OpportunityCardCollapsible = ({ data }) => {
	const [poolName, setPoolName] = useState();

	useEffect(() => {
		// fetch the opportunity details from IPFS
		retrieveFiles(data?.opportunityInfo, true).then((res) => {
			if (res) {
				let read = getBinaryFileData(res);
				read.onloadend = function () {
					let opJson = JSON.parse(read.result);
					if (opJson) {
						setPoolName(opJson.loan_name);
					}
				};
			}
		});
	}, []);

	function getStatus(index) {
		let status = "";
		switch (index) {
			case "0":
				status = "Under Review";
				break;
			case "1":
				status = "Rejected";
				break;
			case "2":
				status = "Approved";
				break;
			case "3":
				status = "Unsure";
				break;
			case "4":
				status = "Collateralized";
				break;
			case "5":
				status = "Active";
				break;
			case "6":
				status = "Drawndown";
				break;
			case "7":
				status = "Repaid";
				break;
		}

		return status;
	}

	return (
		<div className="collapse collapse-arrow bg-darkmode-500 rounded-xl">
			<input type="checkbox" className="peer" />

			<div className="collapse-title flex gap-4 md:gap-8 text-center">
				<p className="w-1/3 md:w-1/4  my-auto">{poolName}</p>
				<p className="md:flex gap-1 hidden items-center w-1/4  justify-center">
					<img src={DollarImage} className="w-4" />
					{data?.opportunityAmount}
				</p>
				<p className="w-1/3 md:w-1/4  my-auto">{data?.createdOn}</p>
				<p className="w-1/3 md:w-1/4  my-auto">{getStatus(data?.status)}</p>
			</div>

			<div className="collapse-content">
				<div
					style={{ display: "flex" }}
					className="justify-around py-10 w-full"
				>
					<div
						style={{ borderRight: "1px solid #292C33", display: "flex" }}
						className="w-1/2 text-center flex-row justify-around items-center"
					>
						<DoughnutChart
							data={[data.actualLoanAmount, data.poolBalance]}
							color={["#5375FE", "#ffffff"]}
							width={200}
							labels={["Capital Requested", "Total Raised"]}
							borderWidth={[1, 8]}
							legendStyle={{ display: false }}
						/>
						<div
							style={{ display: "flex", color: "red" }}
							className="flex-col "
						>
							<div style={{ fontSize: 16, fontWeight: 600, color: "#777E91" }}>
								Capital requested
							</div>
							<div style={{ fontSize: 28, color: "white" }} className="mb-10">
								{data ? data.opportunityAmount : "--"}{" "}
								{process.env.REACT_APP_TOKEN_NAME}
							</div>
							<div style={{ fontSize: 16, fontWeight: 600, color: "#777E91" }}>
								Total raised till now
							</div>

							<div style={{ fontSize: 28, color: "white" }}>
								{data && data.poolDisplayBalance
									? data.poolDisplayBalance
									: "-- "}
								{process.env.REACT_APP_TOKEN_NAME}
							</div>
						</div>
					</div>
					<div
						style={{ borderLeft: "1px solid #292C33", display: "flex" }}
						className="w-1/2 justify-evenly items-center"
					>
						<div style={{ display: "flex" }} className="flex-col">
							<div className="mb-10">
								<p className="font-light text-sm">Interest Rate</p>
								<p className="font-medium text-lg">{data?.loanInterest}</p>
							</div>
							<div>
								<p className="font-light text-sm">Payment Frequency</p>
								<p className="font-medium text-lg">
									{data?.paymentFrequencyInDays}
								</p>
							</div>
						</div>
						<div style={{ display: "flex" }} className="flex-col">
							<div className="mb-10">
								<p className="font-light text-sm">Loan Tenure</p>
								<p className="font-medium text-lg">{data?.loanTenure}</p>
							</div>
							<div>
								<p className="font-light text-sm">Loan Type</p>
								<p className="font-medium text-lg">
									{data?.loanType === 0 ? "Bullet Loan" : "Term Loan"}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OpportunityCardCollapsible;
