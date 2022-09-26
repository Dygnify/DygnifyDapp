import React, { useState, useEffect } from "react";
import GradientButton from "../../uiTools/Button/GradientButtonHeader";
import WalletWhiteSmall from "../SVGIcons/WalletWhiteSmall";
import { useLocation, useNavigate } from "react-router-dom";
import LogoImage from "../../assets/logo.png";
import Wallet from "../../uiTools/Icons/Wallet";
import Hamburger from "../../uiTools/Icons/Hamburger";
import Cross from "../../assets/cross.svg";
import {
	requestAccount,
	isConnected,
} from "../../services/BackendConnectors/userConnectors/commonConnectors";

import Dark from "../../uiTools/Icons/Dark";
import Light from "../../uiTools/Icons/Light";
import ErrorModal from "../../uiTools/Modal/ErrorModal";

const Header = ({ linkStatus, darkMode, setDarkMode }) => {
	const [status, setStatus] = useState(false);
	const [errormsg, setErrormsg] = useState({
		status: false,
		msg: "",
	});
	const location = useLocation();
	const navigate = useNavigate();

	const fetchStatus = async () => {

		const getStatus = await isConnected();

		if (getStatus){
		setStatus(true)
		}else{
		setStatus(false);
		}

	};

	 function hitRequestAccount() {
		console.log("i am clicked")
		fetchStatus();
	}

	useEffect(async () => {
		await fetchStatus();
		darkModeStatus();
	}, [location]);

	function darkModeStatus() {
		if (localStorage.getItem("dark-mode") === "false") {
			setDarkMode(false);
		} else {
			setDarkMode(true);
		}
	}

	const changeTheme = () => {
		setDarkMode((prev) => {
			console.log(prev);
			localStorage.setItem("dark-mode", !prev);

			return !prev;
		});
	};

	return (
		<>
			<div className="flex gap-4 sm:gap-8 px-2  sm:px-4 md:px-6 py-2 relative items-center bg-transparent  text-neutral-700 dark:text-white">
				<div className="">
					<img
						className="md:w-40 h-11 w-28 md:h-16 cursor-pointer"
						src={LogoImage}
						alt="company logo"
						onClick={() => navigate("/")}
					/>
				</div>
				<label
					className="ml-auto p-3 themetoggle-box rounded-full"
					htmlFor="themeToggle"
				>
					<input
						type="checkbox"
						id="themeToggle"
						checked={darkMode}
						onChange={changeTheme}
						className="hidden"
					/>
					<label htmlFor="themeToggle" className="themetoggle">
						{darkMode ? <Light /> : <Dark />}
					</label>
				</label>
				<ErrorModal errormsg={errormsg} setErrormsg={setErrormsg} />

				{!status ? (
					<div className="">
						<GradientButton onClick={hitRequestAccount}>
							<Wallet fill={darkMode ? "white" : "#0D0F11"} /> Connect Wallet
						</GradientButton>
					</div>
				) : (
					<div className="outline outline-[#9281FF] rounded-full  px-4 sm:px-6 md:px-8 flex items-center gap-2 py-2 sm:py-3">
						<WalletWhiteSmall fill={darkMode ? "white" : "#0D0F11"} />
						<div className="font-semibold  text-sm sm:text-base md:text-lg">
							Connected
						</div>
					</div>
				)}

				<div className="lg:hidden">
					{location.pathname !== "/" ? (
						<label htmlFor="dashboard-sidebar">
							{!linkStatus ? (
								<Hamburger />
							) : (
								<img className="w-6" src={Cross} />
							)}
						</label>
					) : (
						""
					)}
				</div>
			</div>
		</>
	);
};

export default Header;
