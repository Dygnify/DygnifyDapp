import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { convertDate } from "../../../../services/BackendConnectors/userConnectors/commonConnectors";
import {
	getTrimmedWalletAddress,
	getDisplayAmount,
} from "../../../../services/Helpers/displayTextHelper";

const TransactionCard = ({ data, address }) => {
	const [userAddress, setUserAddress] = useState();
	const [isWithdraw, setIsWithdraw] = useState();
	const [amount, setAmount] = useState();
	const [date, setDate] = useState();

	function getUserAddress() {
		if (data.from.toUpperCase() === address.toUpperCase()) {
			setUserAddress(getTrimmedWalletAddress(data.to));
			setIsWithdraw(true);
		} else {
			setUserAddress(getTrimmedWalletAddress(data.from));
			setIsWithdraw(false);
		}
	}

	useEffect(() => {
		if (data && address) {
			getUserAddress();
			let amt = ethers.utils.formatUnits(data.value, data.tokenDecimal);
			setAmount(getDisplayAmount(amt));
			setDate(convertDate(data.timeStamp));
		}
	}, []);
	return (
		<div className="bg-darkmode-800 flex p-3 gap-4 rounded-lg justify-start">
			<p className=" w-1/3 md:w-1/4">{userAddress ? userAddress : ""}</p>
			<p className=" w-1/3 md:w-1/4 pl-4 sm:pl-10 md:pl-2 xl:pl-5 2xl-8">
				{isWithdraw ? "Withdrawal" : "Deposit"}
			</p>
			<p className=" w-1/3 md:w-1/4 text-right pr-4 sm:pr-10 md:pr-2 xl:pr-5 2xl:pr-8">
				{amount ? (
					<>
						{isWithdraw ? "-" : "+"} {amount}
					</>
				) : (
					""
				)}
			</p>
			<p className=" hidden md:block w-1/4 text-right">{date ? date : ""}</p>
		</div>
	);
};

export default TransactionCard;
