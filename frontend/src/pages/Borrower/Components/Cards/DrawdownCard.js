import React, { useState, useEffect } from "react";
import DrawdownModal from "../Modal/DrawdownModal";
import { getBinaryFileData } from "../../../../services/Helpers/fileHelper";
import { drawdown } from "../../../../services/BackendConnectors/userConnectors/borrowerConnectors";
import { retrieveFiles } from "../../../../services/Helpers/web3storageIPFS";
import DollarImage from "../../../../assets/Dollar-icon.svg";

const DrawdownCard = ({
	data,
	loadDrawdownList,
	setOpenProcessDrawdown,
	setProcessDrawdown,
}) => {
	const [selected, setSelected] = useState(null);
	const [poolName, setPoolName] = useState();

	const handleDrawdown = () => {
		setSelected(null);
	};
	const onDrawdown = async () => {
		setOpenProcessDrawdown(true);
		setProcessDrawdown(true);
		await drawdown(data?.opportunityPoolAddress);
		setSelected(null);
		loadDrawdownList(true);
		setProcessDrawdown(false);
	};

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

	return (
		<div className="my-gradient px-4 py-8 flex flex-col gap-5 rounded-xl md:w-[48%] xl:w-[32%] 2xl:w-[min(32%,30rem)]">
			<h2 className="font-semibold text-[1.4375rem]">{poolName}</h2>

			<div className="flex flex-col gap-2">
				<div className="font-semibold flex gap-1">
					<p>Capital Borrowed</p>
					<img src={DollarImage} className="w-4 ml-auto" />
					<p>{data?.opportunityAmount} </p>
				</div>

				<div className="font-semibold flex gap-1">
					<p>Available for drawdown</p>

					<img src={DollarImage} className="w-4 ml-auto" />
					<p>{data?.opportunityAmount}</p>
				</div>
			</div>
			<div className="text-center">
				<label
					htmlFor="drawdown-modal"
					onClick={() => setSelected(data)}
					className="bg-secondary-500 w-[100%] inline-block cursor-pointer py-2 rounded-3xl"
				>
					Drawdown Funds
				</label>
			</div>
			{selected && (
				<DrawdownModal
					key={data?.id}
					data={{ ...data, poolName }}
					handleDrawdown={handleDrawdown}
					onDrawdown={onDrawdown}
				/>
			)}
		</div>
	);
};

export default DrawdownCard;
