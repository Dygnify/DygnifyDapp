import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { convertDate } from "../../../../components/transaction/TransactionHelper";
import {
	getTrimmedWalletAddress,
	getDisplayAmount,
} from "../../../../services/displayTextHelper";

const TransactionCard = ({ data, address }) => {
	const [userAddress, setUserAddress] = useState();
	const [isWithdraw, setIsWithdraw] = useState();
	const [amount, setAmount] = useState();
	const [date, setDate] = useState();

	function getUserAddress() {
		if (data.from == address) {
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
		<div className="bg-darkmode-800 flex gap-2 p-3 rounded-lg justify-between">
			<p className="">{userAddress ? userAddress : ""}</p>
			<p className="">{isWithdraw ? "Withdrawal" : "Deposit"}</p>
			<p className="">
				{amount ? (
					<>
						{isWithdraw ? "-" : "+"} {amount}
					</>
				) : (
					""
				)}
			</p>
			<p className=" hidden md:block">{date ? date : ""}</p>
		</div>
	);
};

export default TransactionCard;
