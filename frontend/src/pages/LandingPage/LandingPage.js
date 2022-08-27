import React from "react";
import GradientButton from "../../uiTools/Button/GradientButton";
import Header from "../Layout/Header";
import { useNavigate } from "react-router-dom";
import BorrowImage from "../../assets/Borrow.png";
import InvestImage from "../../assets/Invest.png";

const LandingPage = () => {
	const path = useNavigate();

	return (
		<div className="bg-[#000000] w-full">
			<Header />

			<div className="flex-col items-center" style={{ display: "flex" }}>
				{/* <div style={{ position: "absolute", overflow: "hidden" }}>
          <GradientDark />
        </div> */}
				<h1
					style={{
						fontSize: 50,
						fontWeight: 700,
						fontSize: 68,
						marginBottom: -18,
						color: "white",
						marginTop: 50,
					}}
				>
					Democratising Credit Flow
				</h1>
				<h1
					style={{
						fontSize: 50,
						fontWeight: 700,
						fontSize: 68,
						letterSpacing: 0.03,
						color: "white",
					}}
				>
					to Small Business
				</h1>
				<div
					style={{
						width: 520,
						height: 69,
						// marginLeft: "31%",
					}}
				>
					<h6
						style={{
							fontSize: 18,
							fontWeight: 500,
							color: "white",

							textAlign: "center",
						}}
					>
						DeFi platform enabling stable, attractive yields for digital asset
						investors via purpose-based investments in emerging market
						opportunities
					</h6>
				</div>
			</div>
			<br />

			<div
				className="flex-row justify-evenly w-full"
				style={{ display: "flex" }}
			>
				<div
					className="w-1/2 flex-col justify-center items-center"
					style={{ display: "flex" }}
				>
					<img src={InvestImage} />
					<h6
						style={{
							fontWeight: 600,
							fontSize: 16,
							textAlign: "center",
							color: "#ffffff",
							width: "70%",
							marginTop: 10,
							marginBottom: 10,
						}}
					>
						Invest USDC in real world assets and earn attractive risk adjusted
						returns.
					</h6>
					<GradientButton
						onClick={() => {
							path("/investor-dashboardN");
						}}
					>
						Invest
					</GradientButton>
				</div>
				<div
					className="w-1/2 flex-col justify-center items-center"
					style={{ display: "flex" }}
				>
					<img src={BorrowImage} />
					<h6
						style={{
							fontWeight: 600,
							fontSize: 16,
							textAlign: "center",
							color: "#ffffff",
							width: "70%",
							marginBottom: 10,
							marginTop: 10,
						}}
					>
						On tap liquidity in a transaparent and hassle free manner at
						competitive prices.
					</h6>
					<GradientButton
						onClick={() => {
							path("/borrower_dashboard");
						}}
					>
						Borrow
					</GradientButton>
				</div>
			</div>
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
		</div>
	);
};

export default LandingPage;