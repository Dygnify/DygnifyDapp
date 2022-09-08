import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { convertDate } from "../../../../services/BackendConnectors/userConnectors/commonConnectors";
import { getDisplayAmount } from "../../../../services/Helpers/displayTextHelper";

const TransactionsCard = ({ data }) => {
	const [link, setLink] = useState();
	const [amount, setAmount] = useState();
	const [date, setDate] = useState();

	useEffect(() => {
		if (data) {
			let amt = ethers.utils.formatUnits(data.value, data.tokenDecimal);
			setAmount(getDisplayAmount(amt));
			setDate(convertDate(data.timeStamp));
			setLink(`${process.env.REACT_APP_POLYGONSCAN_URL}/tx/${data.hash}`);
		}
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
				<p className="w-1/6 text-center">{data?.opportunityName}</p>
				<p className="w-1/6 text-center">{date}</p>
				<p className="w-1/6 text-center">
					{data?.isWithdraw ? "Deposit" : "Withdrawal"}
				</p>

				<p className="flex-row w-1/6 text-center">
					{data?.isWithdraw ? "+" : "-"} {amount}
				</p>

				<p className="w-1/6 text-center">
					<button
						style={{
							borderRadius: "35px",
							padding: "5px 8px",
							background:
								"linear-gradient(97.78deg, #51B960 7.43%, #51B960 7.43%, #51B960 7.43%, #83DC90 90.63%)",
							border: "none",
						}}
						className="btn btn-xs btn-success"
					>
						Completed
					</button>
				</p>

				{/* {data?.status === "Not Completed" && ( */}
				{/* {data?.input === "deprecated" && (
					<p className="w-1/6 text-center">
						<button
							style={{
								borderRadius: "35px",
								padding: "5px 8px",
								background:
									"linear-gradient(97.67deg, #E73838 1.07%, #FFBABA 100%)",
								border: "none",
								marginLeft: 5,
							}}
							className="btn btn-xs btn-error"
						>
							Not Completed
						</button>
					</p>
				)}
				{data?.status === "Processing" && (
					<p className="w-1/6 text-center">
						<button
							style={{
								borderRadius: "35px",
								padding: "5px 8px",
								background:
									"linear-gradient(95.8deg, #FFE202 5%, #F2B24E 95.93%)",
								border: "none",
							}}
							className="btn btn-xs btn-warning"
						>
							Processing
						</button>
					</p>
				)} */}
				<a className="w-1/6 text-center underline" href={link} target="_blank">
					Transaction
				</a>
			</div>
		</div>
	);
};

export default TransactionsCard;
