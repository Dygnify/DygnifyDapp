import React from "react";
import { Box, Button, Typography, Stack, Link } from "@mui/material";
import GradientButton from "../../../tools/Button/GradientButton";

const Header = () => {
  return (
    <div
      style={{
        height: "76px",
        backgroundColor: "#20232A",
        borderEndEndRadius: "12px",
        borderEndStartRadius: "12px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
      }}
    >
      <div>
        <img
          style={{ width: "150px", height: "80px", objectFit: "contain" }}
          src="/assets/logo.png"
          alt="company logo"
        />
      </div>

      <GradientButton>Connect Wallet</GradientButton>
    </div>
  );
};

export default Header;
