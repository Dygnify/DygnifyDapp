import React from "react";
import { Box, Button, Typography, Stack, Link } from "@mui/material";
import Company from "./components/Company";
import LockedValueChart from "./components/LockedValueChart";
import GradientButton from "../tools/Button/GradientButton";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const path = useNavigate();

  return (
    <div className="bg-[#000000]">
      <Header />

      <div className="flex-col items-center" style={{ display: "flex" }}>
        <h1
          style={{
            fontSize: 50,
            fontWeight: 700,
            fontSize: 68,
            marginBottom: -18,
            color: "white",
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
          <img src="./assets/Invest.png" />
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
            Invest USDC in real-world-assets and earn attractive, risk adjusted
            returns.
          </h6>
          <GradientButton onClick={() => path("/investor-dashboardN")}>
            Invest
          </GradientButton>
        </div>
        <div
          className="w-1/2 flex-col justify-center items-center"
          style={{ display: "flex" }}
        >
          <img src="./assets/Borrow.png" />
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
            Invest USDC in real-world-assets and earn attractive, risk adjusted
            returns.
          </h6>
          <GradientButton>Borrow</GradientButton>
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default LandingPage;
