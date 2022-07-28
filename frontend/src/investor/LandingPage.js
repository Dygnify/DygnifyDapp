import React from "react";
import { Box, Button, Typography, Stack, Link } from "@mui/material";
import Company from "./components/Company";
import LockedValueChart from "./components/LockedValueChart";
import GradientButton from "../tools/Button/GradientButton";

const LandingPage = () => {
  return (
    <div className="bg-[#000000]">
      <Box
        sx={{
          height: "90px",
          backgroundColor: "#000000",
          borderEndEndRadius: "12px",
          borderEndStartRadius: "12px",
          px: "40px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <img
            style={{ width: "150px", height: "80px", objectFit: "contain" }}
            src="./assets/logo.png"
            alt="company logo"
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            textAlign: "center",
          }}
        >
          <div>
            <Typography variant="body2">Switch to</Typography>
            <Button
              size="small"
              sx={{ backgroundColor: "#E5E5E5", borderRadius: "120px" }}
            >
              {process.env.REACT_APP_TOKEN_NAME}
            </Button>
          </div>
          <GradientButton>Connect Wallet</GradientButton>
        </div>
      </Box>

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
          <GradientButton>Invest</GradientButton>
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
    </div>
  );
};

export default LandingPage;
