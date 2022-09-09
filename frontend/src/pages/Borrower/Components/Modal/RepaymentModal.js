import React, { useState, useEffect } from "react";
import { repayment } from "../../../../services/BackendConnectors/userConnectors/borrowerConnectors";
import { getWalletBal } from "../../../../services/BackendConnectors/userConnectors/commonConnectors";
import GradientBtnForModal from "../../../../uiTools/Button/GradientBtnForModal";
import WalletImage from "../../../../assets/wallet_white.png";
import DollarImage from "../../../../assets/Dollar-icon.svg";
import approve from "../../../../services/BackendConnectors/approve";

const RepaymentModal = ({
	data,
	handleRepayment,
	setOpenProcessRepayment,
	setProcessRepayment,
}) => {
	const [walletBal, setWalletBal] = useState();
	useEffect(() => {
		getWalletBal().then((data) => setWalletBal(data));
	}, []);

	async function onRepayment() {
		setOpenProcessRepayment(true);
		setProcessRepayment(true);
		await repayment(data.opportunityPoolAddress);
		handleRepayment();

		setProcessRepayment(false);
	}

	return (
		<div>
			<input type="checkbox" id="repayment-modal" className="modal-toggle" />
			<div className="modal backdrop-filter backdrop-brightness-[40%] backdrop-blur-lg">
				<div className="bg-darkmode-800  w-[100vw] h-[100vh] flex flex-col md:block md:h-auto md:w-[70%] lg:w-[50%] xl:w-[45%] 2xl:w-[40%] pb-[6em] md:rounded-xl md:pb-8">
					<div className=" flex justify-between px-4 md:px-8 md:border-b mt-[4em] md:mt-0 py-4">
						<h3 className="font-semibold text-xl">Repayment</h3>

						<label
							for="repayment-modal"
							className="hover:text-primary-600 text-xl"
							onClick={() => handleRepayment()}
						>
							✕
						</label>
					</div>

					<div className="px-4 md:px-8 mt-[4em] md:mt-6 flex flex-col gap-8">
						<img
							src={WalletImage}
							style={{ aspectRatio: 1 / 1 }}
							className="w-[4rem] mx-auto p-4 bg-purple-500 rounded-[50%]"
							alt=""
						/>

						<div className="py-4 px-3 flex gap-1 bg-darkmode-500 rounded-md ">
							<p className="font-semibold text-[1.125rem]">Total Balance</p>

							<img src={DollarImage} className="ml-auto w-[1rem]" />
							<p className="font-semibold text-[1.125rem]">{walletBal}</p>
						</div>
					</div>

					<div className="px-4 md:px-8 mt-10 flex flex-col gap-1">
						<div className="flex justify-between font-semibold">
							<p>Pool Name</p>
							<p>{data?.opportunityName}</p>
						</div>

						<div className="flex gap-1 font-semibold">
							{data?.isOverDue ? (
								<p className="flex justify-start text-error-500">
									Overdue Amount
								</p>
							) : (
								<p className="flex justify-start">Due Amount</p>
							)}

							<img src={DollarImage} className="ml-auto w-[1rem]" />
							<p className="font-semibold text-[1.125rem]">
								{data?.repaymentDisplayAmount}
							</p>
						</div>
						<div className="flex justify-between font-semibold">
							<p>Due Date</p>
							<p>{data?.nextDueDate}</p>
						</div>
					</div>

					<div className="px-4 md:px-8 mt-auto md:mt-8">
						<GradientBtnForModal
							className={"w-full"}
							htmlFor={"RepaymentProcessModal"}
							setOpenProcessRepayment={setOpenProcessRepayment}
							setProcessRepayment={setProcessRepayment}
							onClick={approve(data.opportunityPoolAddress,data.repaymentAmount)}
						>
							Approve
						</GradientBtnForModal>
					</div>
					<div className="px-4 md:px-8 mt-auto md:mt-8">
						<GradientBtnForModal
							className={"w-full"}
							htmlFor={"RepaymentProcessModal"}
							setOpenProcessRepayment={setOpenProcessRepayment}
							setProcessRepayment={setProcessRepayment}
							onClick={onRepayment}
						>
							Make Repayment
						</GradientBtnForModal>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RepaymentModal;
