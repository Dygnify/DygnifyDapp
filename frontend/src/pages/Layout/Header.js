import React, { useState, useEffect } from "react";
import GradientButton from "../../uiTools/Button/GradientButtonHeader";
import WalletWhiteSmall from "../SVGIcons/WalletWhiteSmall";
import { useLocation } from "react-router-dom";
import LogoImage from "../../assets/logo.png";
import { Link } from "react-router-dom";
import Wallet from "../../uiTools/Icons/Wallet";
import Hamburger from "../../uiTools/Icons/Hamburger";
import Cross from "../../assets/cross.svg";
import {
	requestAccount,
	isConnected,
} from "../../services/BackendConnectors/userConnectors/commonConnectors";

import Dark from "../../uiTools/Icons/Dark";
import Light from "../../uiTools/Icons/Light";

const Header = ({ linkStatus, darkMode, setDarkMode }) => {
	const [status, setStatus] = useState(false);
	const location = useLocation();

	const fetchStatus = async () => {
		const getStatus = await isConnected();
		if (getStatus) return setStatus(true);
		setStatus(false);
	};

	async function hitRequestAccount() {
		await requestAccount(true);
		fetchStatus();
	}

	useEffect(() => {
		fetchStatus();
	}, [location]);

	return (
		<>
			<div className="flex gap-4 sm:gap-8 px-2 sm:px-4 md:px-6 py-4 relative items-center">
				<div className="">
					<img
						className="md:w-40 h-11  w-28 md:h-16"
						src={LogoImage}
						alt="company logo"
					/>
				</div>
				<div className="ml-auto p-3 bg-darkmode-500 rounded-md">
					<input
						type="checkbox"
						id="themeToggle"
						checked={darkMode}
						onChange={() => setDarkMode((prev) => !prev)}
						className="hidden"
					/>
					<label htmlFor="themeToggle">{darkMode ? <Light /> : <Dark />}</label>
				</div>

				{!status ? (
					<div className="">
						<GradientButton onClick={hitRequestAccount}>
							<Wallet /> Connect Wallet
						</GradientButton>
					</div>
				) : (
					<div className="outline outline-[#9281FF] rounded-full  px-4 sm:px-6 md:px-8 flex items-center gap-2 py-2 sm:py-3">
						<WalletWhiteSmall />
						<div className="font-semibold text-white text-sm sm:text-base md:text-lg">
							Connected
						</div>
					</div>
				)}

				<div className="lg:hidden">
					<label htmlFor="dashboard-sidebar">
						{!linkStatus ? <Hamburger /> : <img className="w-6" src={Cross} />}
					</label>
				</div>
			</div>
		</>
	);
};

export default Header;
