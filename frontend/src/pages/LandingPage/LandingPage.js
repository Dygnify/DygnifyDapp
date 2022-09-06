import React from "react";
import GradientButton from "../../uiTools/Button/GradientButton";
import Header from "../Layout/Header";
import { useNavigate } from "react-router-dom";
import BorrowImage from "../../assets/Borrow.png";
import InvestImage from "../../assets/Invest.png";

const LandingPage = () => {
	const path = useNavigate();

	return (
		<div className="bg-[#000000] dark:bg-white w-full pb-10">
			<Header />

			<div className="flex-col items-center flex">
				{/* <div style={{ position: "absolute", overflow: "hidden" }}>
                   <GradientDark />
                   </div> */}
				<h1
					className="text-7xl font-bold text-white mt-20 mb-2"
					// style={
					// 	{
					// fontSize: 50,
					// fontWeight: 700,
					// fontSize: 68,
					// marginBottom: -18,
					// color: "white",
					// marginTop: 50,
					// 	}
					// }
				>
					Democratising Credit Flow
				</h1>
				<h1
					className="text-7xl font-bold text-white"
					// style={{
					// 	fontSize: 50,
					// 	fontWeight: 700,
					// 	fontSize: 68,
					// 	letterSpacing: 0.03,
					// 	color: "white",
					// }}
				>
					to Small Business
				</h1>
				<div
					className="w-[33rem] h-16 mt-5"
					style={
						{
							// width: 520,
							// height: 69,
						}
					}
				>
					<h6
						className="text-lg font-medium text-white text-center"
						// style={{
						// 	fontSize: 18,
						// 	fontWeight: 500,
						// 	color: "white",

						// 	textAlign: "center",
						// }}
					>
						DeFi platform enabling stable, attractive yields for digital asset
						investors via purpose-based investments in emerging market
						opportunities
					</h6>
				</div>
			</div>
			<br />
			<div className="flex flex-row w-full">
				<div className="flex w-1/2 flex-col justify-center items-center">
					<img src={InvestImage} />
					<h6 className="font-semibold text-base text-center text-[#ffffff] w-[33%] my-3">
						Invest USDC in real world assets and earn attractive risk adjusted
						returns.
					</h6>
					<GradientButton
						onClick={() => {
							path("/investor-dashboard/overview");
						}}
					>
						Invest
					</GradientButton>
				</div>
				<div className="flex w-1/2 flex-col justify-center items-center">
					<img src={BorrowImage} />
					<h6 className="font-semibold text-base text-center text-[#ffffff] w-[33%] my-3">
						On tap liquidity in a transaparent and hassle free manner at
						competitive prices.
					</h6>
					<GradientButton
						onClick={() => {
							path("/borrower_dashboard/overview");
						}}
					>
						Borrow
					</GradientButton>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
