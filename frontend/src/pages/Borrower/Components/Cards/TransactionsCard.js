import React from "react";
import DollarImage from "../../../../assets/Dollar-icon.svg";
import Website from "../../../SVGIcons/Website";

const TransactionsCard = ({ data }) => {
	return (
		<div className="px-2 bg-darkmode-800 flex justify-around rounded-xl py-3 gap-4 md:gap-6 text-center">
			<p className="w-1/3 md:w-1/6 my-auto ">{data?.opportunity_name}</p>
			<p className="hidden md:block w-1/3 md:w-1/6 my-auto">{data?.date}</p>
			<p className="hidden md:block w-1/3 md:w-1/6 my-auto">{data?.type}</p>
			<p className="flex gap-1 items-center w-1/3 md:w-1/6 my-auto justify-center">
				<img src={DollarImage} className="w-4" />
				{data?.type === "Drawdown" ? "-" : "+"}
				{data?.amount}
			</p>
			{data?.status === "Completed" && (
				<p className="w-1/3 md:w-1/6 my-auto transaction-button">
					<button className="bg-gradient-to-r from-[#51B960] to-[#83DC90]">
						Completed
					</button>
				</p>
			)}
			{data?.status === "Not Completed" && (
				<p className="w-1/3 md:w-1/6 my-auto transaction-button">
					<button className="bg-gradient-to-r from-[#E73838] to-[#FFBABA] text-[0.775rem] xl:text-base">
						Not Completed
					</button>
				</p>
			)}
			{data?.status === "Processing" && (
				<p className="w-1/3 md:w-1/6 my-auto transaction-button">
					<button className="bg-gradient-to-r from-[#FFE202] to-[#F2B24E]">
						Processing
					</button>
				</p>
			)}
			<a
				className="hidden md:flex underline w-1/3 md:w-1/6 my-auto gap-1 items-center justify-center"
				href={data?.link}
			>
				Polygonscan
				<Website />
			</a>
		</div>
	);
};

export default TransactionsCard;
