import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box, Button, Typography, Stack, Divider, Card } from "@mui/material";
import { Link } from "react-router-dom";
import { uploadFileToIPFS } from "../services/PinataIPFSOptions";
import { border } from "@mui/system";
import OpportunityTable from "./OpportunityTable.js";
import DrawdownCard from "./DrawdownCard.js";
import OpportunityStatus from "./OpportunityStatus.js";
import { LogDescription } from "ethers/lib/utils";
import { getOpportunitysOf } from "../components/transaction/TransactionHelper";

const Borrower = () => {
  // const [opportunity, setOpportunity] = useState([
  //   {
  //     mDate: "12/05/2020",
  //     name: "Opportunity 1",
  //     status: "Active",
  //     percentage: "100%",
  //   },
  //   {
  //     mDate: "12/05/2020",
  //     name: "Opportunity 2",
  //     status: "Closed",
  //     percentage: "100%",
  //   },
  //   {
  //     mDate: "12/05/2020",
  //     name: "Opportunity 3",
  //     status: "Funded",
  //     percentage: "50%",
  //   },
  // ]);

  const [userInfo, setUserInfo] = useState({
    companyName: "Hector Ltd",
    name: "Jane Hector",
    activeLoan: "1",
    totalLoan: "84,00,000",
    amountReadyToWithdraw: "48,00,000",
  });
  const [opportunity, setOpportunity] = useState([
    {
      borrower: "0xC78810A9EDb753C3FdC71EEe6998A68d3B823705",
      capitalLoss: "12",
      collateralDocument: "doc",
      loanAmount: "12",
      loanInterest: "12",
      loanTenure: "12",
      loanType: "Bullet",
      oppurtunityStatus: "0",
      paymentFrequency: "12",
    },
    {
      borrower: "0xC78810A9EDb753C3FdC71EEe6998A68d3B823705",
      capitalLoss: "12",
      collateralDocument: "doc",
      loanAmount: "12",
      loanInterest: "12",
      loanTenure: "12",
      loanType: "Bullet",
      oppurtunityStatus: "0",
      paymentFrequency: "12",
    },
  ]);

  // const [opportunity, setOpportunity] = useState();

  // useEffect(() => {
  //   setOpportunity(getOpportunities());
  // }, []);

  async function getOpportunities() {
    let opportunities = await getOpportunitysOf();
    console.log(opportunities);
    return opportunities;
    // setOpportunity(opportunities);
  }

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  return (
    <>
      <style>{"body { background-color: #7165e3 }"}</style>
      <Box
        sx={{
          height: "90px",
          backgroundColor: "#ffffff",
          borderEndEndRadius: "12px",
          borderEndStartRadius: "12px",
          px: "40px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <img
            style={{ width: "150px", height: "80px", objectFit: "contain" }}
            src="./assets/logo.png"
            alt="company logo"
          />
        </Box>
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
          <Button
            sx={{ backgroundColor: "#7165E3" }}
            variant="contained"
            size="large"
            //onClick={requestAccount}
            onClick={getOpportunities}
          >
            Connect Wallet
          </Button>
        </div>
      </Box>

      <Stack
        sx={{
          my: "20px",
          mx: "auto",
          maxWidth: 1150,
          height: 80,
          py: "10px",
          px: "30px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" ml={2}>
            {userInfo.companyName}
          </Typography>
          <Typography ml={2}>{userInfo.name}</Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          mb: "30px",
          maxWidth: 1100,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "0px 16px",
          height: "200px",
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            py: "16px",
            px: "30px",
          }}
        >
          <Typography variant="h6">{userInfo.activeLoan}</Typography>

          <Typography variant="h6" color="#979797">
            Active Loan
          </Typography>
        </Card>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: "16px",
            px: "30px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            {`\u20B9`}
            {userInfo.totalLoan} {process.env.REACT_APP_TOKEN_NAME}
          </Typography>
          <Typography variant="h6" color="#979797">
            Total Loan
          </Typography>
        </Card>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: "16px",
            px: "30px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            {`\u20B9`}
            {userInfo.amountReadyToWithdraw} {process.env.REACT_APP_TOKEN_NAME}
          </Typography>

          <Typography variant="h6" color="#979797">
            Ready to Drawdown
          </Typography>
        </Card>
      </Box>

      {/* <OpportunityTable />

      <DrawdownCard /> */}
      <br />

      {opportunity.map((data, i) => {
        return (
          <OpportunityStatus
            opportunityName="Opportunity 1"
            loanAmount={data.loanAmount}
            loanInterest={data.loanInterest}
            loanType={data.loanType}
            loanTenure={data.loanTenure}
            //opportunityStatus={data.oppurtunityStatus}
            opportunityStatus="0"
            mDate="12/05/2022"
          />
        );
      })}

      <br />
      <br />
      <br />
    </>
  );
};

export default Borrower;
