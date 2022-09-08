import { React, useState, useEffect, useContext } from "react";
import WalletImage from "../../../../assets/wallet_white.png";
import DollarImage from "../../../../assets/Dollar-icon.svg";
import { getWalletBal } from "../../../../services/BackendConnectors/userConnectors/commonConnectors";
import {
	investInJuniorPool,
	investInSeniorPool,
} from "../../../../services/BackendConnectors/userConnectors/investorConncector";

//for send data import from paths--
import { UserContext } from "../../../../Paths"; //
//

const InvestModal = ({
	isSenior,
	poolAddress,
	poolName,
	poolLimit,
	estimatedAPY,
	setProcessFundModal,
	setInvestProcessing,
	setSelected,
}) => {
	const [amount, setAmount] = useState("");
	const [walletBal, setWalletBal] = useState();
	const [error, setError] = useState({
		err: false,
		msg: "",
	});

	//for send data using useContext--
	const { state, dispatch } = useContext(UserContext); //
	dispatch({ type: "USER", payload: amount }); //
	//

	useEffect(() => {
		getWalletBal().then((data) => setWalletBal(data));
	}, []);

	async function investSenior() {
		setProcessFundModal(true);
		setInvestProcessing(true);
		await investInSeniorPool(amount);
		setSelected(null);
		setInvestProcessing(false);
		console.log("done");
	}

	async function investJunior() {
		setProcessFundModal(true);
		setInvestProcessing(true);

		await investInJuniorPool(poolAddress, amount);
		setSelected(null);
		setInvestProcessing(false);
	}

	const handleAmount = (e) => {
		const value = e.target.value;

		const defaultErr = {
			err: false,
			msg: "",
		};

		const errObj = {
			err: true,
			msg: "Insufficient USDC to initiate transfer",
		};

		if (walletBal) {
			if (+value > +walletBal) {
				setError(errObj);
			} else {
				setError(defaultErr);
			}
		}

		setAmount(value);
	};

	return (
		<>
			<input type="checkbox" id="InvestModal" className="modal-toggle" />
			<div className="modal backdrop-filter backdrop-brightness-[40%] backdrop-blur-lg">
				<div className="bg-neutral-50 dark:bg-darkmode-800  w-[100vw] h-[100vh] flex flex-col md:block md:h-auto md:w-[70%] lg:w-[50%] xl:w-[45%] 2xl:w-[40%] pb-[6em] md:rounded-xl md:pb-8">
					<div className="flex justify-between px-4 md:px-8 md:border-b md:border-neutral-300 md:dark:border-darkmode-500 mt-[4em] md:mt-0 py-4">
						<h3 className="font-semibold text-xl">Invest</h3>

						<label
							for="InvestModal"
							// onClick={() => handleDrawdown()}
							className=" hover:text-primary-600 text-xl"
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

						<div className="py-4 px-3 flex gap-1 bg-neutral-200 dark:bg-darkmode-500 rounded-md">
							<p className="font-semibold text-[1.125rem]">Total Balance</p>

							<img src={DollarImage} className="ml-auto w-[1rem]" />
							<p className="font-semibold text-[1.125rem]">
								{walletBal ? walletBal : 0}
							</p>
						</div>
					</div>

					<div className="px-4 md:px-8 mt-8 flex flex-col gap-1">
						<div className="flex justify-between font-semibold">
							<p className="">Pool Name</p>
							<p className="">{poolName}</p>
						</div>

						{poolLimit ? (
							<div className="flex gap-1 font-semibold">
								<p className="">Pool Limit</p>

								<img src={DollarImage} className="ml-auto w-[1rem]" />
								<p className="">{poolLimit}</p>
							</div>
						) : (
							<></>
						)}

						<div className="flex justify-between font-semibold">
							<p className="">Estimated APY</p>
							<p className="">{estimatedAPY}%</p>
						</div>
					</div>

					<div className="relative px-4 md:px-8 mt-8 flex flex-col gap-1">
						<label for="investModalAmount" className="font-semibold">
							Enter Amount
						</label>
						<input
							type="number"
							id="investModalAmount"
							placeholder="0.0"
							onChange={handleAmount}
							value={amount}
							className="bg-neutral-100 dark:bg-darkmode-700 border-2 border-neutral-300 dark:border-darkmode-50 outline-none px-2 py-3 pr-14 rounded-md placeholder:text-neutral-500 placeholder:font-semibold"
						/>
						<span className="absolute right-7 md:right-11 text-neutral-500 top-10 font-semibold">
							{process.env.REACT_APP_TOKEN_NAME}
						</span>

						{error.err && (
							<p className="text-[0.875rem] text-error-500">{error.msg}</p>
						)}
					</div>

					<div className="px-4 md:px-8 mt-auto md:mt-8">
						<label
							htmlFor={`${error.err ? "" : "InvestProcessModal"}`}
							onClick={() => {
								if (!error.err) isSenior ? investSenior() : investJunior();
							}} //if condition not true then investJunior will execute
							className={`block font-semibold text-white ${
								error.err
									? "bg-neutral-400 cursor-not-allowed"
									: "bg-gradient-to-r from-[#4B74FF] to-primary-500 w-[100%] cursor-pointer"
							}  text-center py-2 rounded-[1.8em] select-none`}
						>
							Invest
						</label>
					</div>
				</div>
			</div>
		</>
	);
};

export default InvestModal;
