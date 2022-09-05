import React, { useState, useEffect } from "react";
import DrawdownModal from "../Modal/DrawdownModal";
import { getBinaryFileData } from "../../../../services/Helpers/fileHelper";
import { drawdown } from "../../../../services/BackendConnectors/userConnectors/borrowerConnectors";
import { retrieveFiles } from "../../../../services/Helpers/web3storageIPFS";

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
		<div
			style={{ boxShadow: `1px 1px 1px rgba(185, 185, 185, 0.1)` }}
			className="card text-white w-1/3"
		>
			<div
				style={{
					background: `linear-gradient(302.85deg, rgba(168, 154, 255, 0) -1.23%, rgba(168, 154, 255, 0.260833) 99.99%, rgba(168, 154, 255, 0.8) 100%`,
					borderRadius: "16px",
				}}
				className="card-body"
			>
				<h2 className="card-title mb-4">{poolName}</h2>
				<div className="text-sm">
					<div style={{ display: "flex" }} className="mb-2">
						<p style={{ display: "flex" }} className="justify-start">
							Capital Borrowed
						</p>
						<p style={{ display: "flex" }} className="justify-end">
							{data?.opportunityAmount} {process.env.REACT_APP_TOKEN_NAME}
						</p>
					</div>
					<div style={{ display: "flex" }} className="mb-2">
						<p style={{ display: "flex" }} className="justify-start">
							Available for drawdown
						</p>
						<p style={{ display: "flex" }} className="justify-end">
							{data?.opportunityAmount} {process.env.REACT_APP_TOKEN_NAME}
						</p>
					</div>
				</div>
				<div className="justify-center w-full mt-6">
					<label
						htmlFor="drawdown-modal"
						color="none"
						style={{
							borderRadius: "100px",
							padding: "12px 24px",
							color: "white",
						}}
						className={`btn btn-secondary w-full bg-blue-500 hover:bg-blue-500 capitalize font-medium border-none`}
						onClick={() => setSelected(data)}
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
		</div>
	);
};

export default DrawdownCard;
