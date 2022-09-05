import React, { useState, useEffect } from "react";
import { getBinaryFileData } from "../../../../services/Helpers/fileHelper";
import { retrieveFiles } from "../../../../services/Helpers/web3storageIPFS";
const DueDateCard = ({ data }) => {
	const [poolName, setPoolName] = useState(data.poolName);

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
			style={{ backgroundColor: "#20232A", borderRadius: "12px" }}
			className=" mb-2"
		>
			<div
				style={{ display: "flex" }}
				className="collapse-title text-md font-light justify-around w-full"
			>
				<p className="w-1/4 text-center">{poolName}</p>
				<p className="w-1/4 text-center">
					{data?.opportunityAmount} {process.env.REACT_APP_TOKEN_NAME}
				</p>
				<p className="w-1/4 text-center">
					{data?.repaymentDisplayAmount} {process.env.REACT_APP_TOKEN_NAME}{" "}
					{/* <sup
            style={{ backgroundColor: "#323A46", borderRadius: "50%" }}
            className="ml-1 tooltip p-2"
            data-tip={`Principle - ${data?.principal_amount} ${process.env.REACT_APP_TOKEN_NAME}, Interest - ${data?.interest_amount} ${process.env.REACT_APP_TOKEN_NAME}`}
          >
            <button>i</button>
          </sup> */}
				</p>
				<p className="w-1/4 text-center">{data?.nextDueDate}</p>
			</div>
		</div>
	);
};

export default DueDateCard;
