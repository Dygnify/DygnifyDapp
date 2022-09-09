import React, { useState, useEffect } from "react";
import { getBinaryFileData } from "../../../../services/Helpers/fileHelper";
import { retrieveFiles } from "../../../../services/Helpers/web3storageIPFS";
import DoughnutChart from "../../../Components/DoughnutChart";
import DollarImage from "../../../../assets/Dollar-icon.svg";

const OpportunityCardCollapsible = ({ data }) => {
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
				<p className="w-1/3 md:w-1/4  my-auto">{data?.opportunityName}</p>
				<p className="md:flex gap-1 hidden items-center w-1/4  justify-center">
					<img src={DollarImage} className="w-4" />
					{data?.opportunityAmount}
				</p>
				<p className="w-1/3 md:w-1/4  my-auto">{data?.createdOn}</p>
				<p className="w-1/3 md:w-1/4  my-auto">{getStatus(data?.status)}</p>
			</div>

			<div className="collapse-content">
				<div className="outline outline-[coral] w-[100vw] h-[100vh] absolute">
					<div className="outline outline-[lightpink]">
						<DoughnutChart
							data={[data.actualLoanAmount, data.poolBalance]}
							color={["#5375FE", "#ffffff"]}
							width={200}
							labels={["Capital Requested", "Total Raised"]}
							borderWidth={[1, 8]}
							legendStyle={{ display: false }}
						/>

						<div className="outline outline-[hotpink]">
							<div className="outline outline-[lightgreen]">
								<p>Capital requested</p>

								<p className="">
									<img src={DollarImage} className="w-4" />
									{data ? data.opportunityAmount : "--"}
									<span>{process.env.REACT_APP_TOKEN_NAME}</span>
								</p>
							</div>

							<div className="outline outline-[lightblue]">
								<p>Total raised till now</p>
								<p>
									<img src={DollarImage} className="w-4" />
									{data && data.poolDisplayBalance
										? data.poolDisplayBalance
										: "-- "}

									<span>{process.env.REACT_APP_TOKEN_NAME}</span>
								</p>
							</div>
						</div>
					</div>

					<div className="outline outline-[lightcoral]">
						<div className="outline">
							<div>
								<p>Interest Rate</p>
								<p>{data?.loanInterest}</p>
							</div>
							<div>
								<p>Payment Frequency</p>
								<p>{data?.paymentFrequencyInDays}</p>
							</div>
						</div>

						<div className="outline outline-[black]">
							<div>
								<p>Loan Tenure</p>
								<p>{data?.loanTenure}</p>
							</div>
							<div>
								<p>Loan Type</p>
								<p>{data?.loanType === 0 ? "Bullet Loan" : "Term Loan"}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OpportunityCardCollapsible;
