import React, { useState, useEffect } from "react";
import GradientBtnForModal from "../Button/GradientBtnForModal";

import { getWalletBal } from "../../components/transaction/TransactionHelper";
import WalletImage from "../../assets/wallet_white.png";

const DrawdownModal = ({ data, handleDrawdown, onDrawdown }) => {
	const [walletBal, setWalletBal] = useState();
	useEffect(() => {
		getWalletBal().then((data) => setWalletBal(data));
	}, []);

	return (
		<div>
			<input type="checkbox" id="drawdown-modal" className="modal-toggle" />
			<div
				style={{ backdropFilter: "brightness(40%) blur(8px)" }}
				className="modal"
			>
				<div
					style={{ backgroundColor: "#20232A", borderRadius: "16px" }}
					className="modal-box w-1/3 max-w-5xl p-0"
				>
					<label
						for="drawdown-modal"
						className="btn btn-ghost absolute right-2 top-2 pb-2"
						onClick={() => handleDrawdown()}
					>
						✕
					</label>
					<h3
						style={{ borderBottom: "2px solid #292C33" }}
						className="font-bold text-lg py-3 px-4"
					>
						Drawdown
					</h3>
					<div style={{ display: "flex" }} className="justify-center my-6">
						<img
							style={{ borderRadius: "50%" }}
							className="p-4 bg-[#9281FF] opacity-80"
							src={WalletImage}
							alt=""
						/>
					</div>
					<div
						style={{ backgroundColor: "#292C33", borderRadius: "4px" }}
						className="mx-4 mb-3 py-4 px-4 text-base"
					>
						<div style={{ display: "flex" }}>
							<p style={{ display: "flex" }} className="justify-start">
								Total Balance
							</p>
							<p style={{ display: "flex" }} className="justify-end">
								{walletBal} {process.env.REACT_APP_TOKEN_NAME}
							</p>
						</div>
						{/* <small
              style={{ display: "flex", color: "#777E91" }}
              className="justify-end"
            >
              {data?.loan_amount} USDT
            </small> */}
					</div>
					<div className="text-sm py-3 px-5">
						<div style={{ display: "flex" }} className="mb-2">
							<p style={{ display: "flex" }} className="justify-start">
								Pool Name
							</p>
							<p style={{ display: "flex" }} className="justify-end">
								{data?.poolName}
							</p>
						</div>
						<div style={{ display: "flex" }} className="mb-2">
							<p style={{ display: "flex" }} className="justify-start">
								Interest Rate
							</p>
							<p style={{ display: "flex" }} className="justify-end">
								{data?.loanInterest}
							</p>
						</div>
						<div style={{ display: "flex" }} className="mb-2">
							<p style={{ display: "flex" }} className="justify-start">
								Available for drawdown
							</p>
							<p style={{ display: "flex" }} className="justify-end">
								${data?.opportunityAmount}
							</p>
						</div>
					</div>
					<div
						className="modal-action mx-4 mt-2 mb-4 justify-center"
						style={{ display: "flex" }}
					>
						<GradientBtnForModal
							className={"w-full"}
							htmlFor={"DrawdownProcessModal"}
							onClick={onDrawdown}
						>
							Drawdown Funds
						</GradientBtnForModal>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DrawdownModal;
