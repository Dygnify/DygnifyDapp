import React, { useState, useEffect } from "react";
import PrimaryButton from "../../../../uiTools/Button/PrimaryButton";
import RepaymentModal from "../Modal/RepaymentModal";
import { getBinaryFileData } from "../../../../services/fileHelper";
import { retrieveFiles } from "../../../../services/web3storageIPFS";
import DollarImage from "../../../../assets/Dollar-icon.svg";

const RepaymentCard = ({ data, loadRepaymentList }) => {
	const [selected, setSelected] = useState(null);
	const handleRepayment = async () => {
		setSelected(null);
		loadRepaymentList(true);
	};
	const { opportunityInfo, opportunityAmount, loanInterest, isFull } = data;

	const [poolName, setPoolName] = useState(data.poolName);

	useEffect(() => {
		// fetch the opportunity details from IPFS
		retrieveFiles(opportunityInfo, true).then((res) => {
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

	return (
		<div className="my-gradient px-4 py-8 flex flex-col gap-5 rounded-xl md:w-[48%] xl:w-[32%] 2xl:w-[min(32%,30rem)]">
			<h2 className="font-semibold text-[1.4375rem]">{poolName} </h2>

			<div className="flex flex-col gap-2">
				<div className="font-semibold flex gap-1">
					<p>Capital Borrowed</p>

					<img src={DollarImage} className="w-4 ml-auto" />
					<p>{data?.opportunityAmount}</p>
				</div>
				<div className="font-semibold flex gap-1">
					{data?.isOverDue ? (
						<p className="text-error-500">Overdue Amount</p>
					) : (
						<p>Due Amount</p>
					)}

					<img src={DollarImage} className="w-4 ml-auto" />
					<p className={`${data?.isOverDue ? "text-error-500" : ""}`}>
						{data?.repaymentDisplayAmount}
					</p>
				</div>

				<div className="font-semibold flex justify-between">
					<p>Due Date</p>
					<p>{data?.nextDueDate}</p>
				</div>
			</div>

			<div className="text-center">
				<label
					htmlFor="repayment-modal"
					onClick={() => setSelected(data)}
					className="bg-secondary-500 w-[100%] inline-block cursor-pointer py-2 rounded-3xl"
				>
					Make Repayment now
				</label>
			</div>
			{selected && (
				<RepaymentModal
					key={data?.id}
					data={selected}
					handleRepayment={handleRepayment}
					poolName={poolName}
				></RepaymentModal>
			)}
		</div>
	);
};

export default RepaymentCard;
