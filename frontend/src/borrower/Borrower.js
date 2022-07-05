import {React,useState} from "react";
import { ethers } from 'ethers';
import { Box, Button, Typography, Stack, Divider, Card } from "@mui/material";
import { Link } from "react-router-dom";
import { uploadFileToIPFS } from '../services/PinataIPFSOptions';
import { border } from "@mui/system";
import OpportunityTable from "./OpportunityTable.js"
import DrawdownCard from "./DrawdownCard.js"
import OpportunityStatus from "./OpportunityStatus.js"


const Borrower = () => {

  const [opportunity, setOpportunity] = useState([
    {mDate : "12/05/2020", name : "Opportunity 1", status : "Active", percentage : "100%"},
    {mDate : "12/05/2020", name : "Opportunity 2", status : "Closed", percentage : "100%"},
    {mDate : "12/05/2020", name : "Opportunity 3", status : "Funded", percentage : "50%"}
  ]);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
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
            onClick={requestAccount}
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
          
          <Typography variant="h6" ml={2}>ABC Ltd</Typography>
          <Typography ml={2}>Jane Doe</Typography>
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
          height : "200px",
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign : "center",
            py: "16px",
            px: "30px",
          }}
        >
          <Typography variant="h6">1</Typography>
          
          <Typography variant="h6" color="#979797">Active Loan</Typography>
          
        </Card>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: "16px",
            px: "30px",
            textAlign : "center",
          }}
        >
          <Typography variant="h6">45,00,000 {process.env.REACT_APP_TOKEN_NAME}</Typography>
          <Typography variant="h6" color="#979797">Total Loan</Typography>
          
        </Card>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: "16px",
            px: "30px",
            textAlign : "center",
          }}
        >
          <Typography variant="h6">15,00,000 {process.env.REACT_APP_TOKEN_NAME}</Typography>
          
          <Typography variant="h6" color="#979797">Ready to Drawdown</Typography>
          
        </Card>
      </Box>
      
      <OpportunityTable />
       
      <DrawdownCard/>        
      <br/>
      {
        opportunity.map((opportunity,i)=>{

          return(<OpportunityStatus opportunityName={opportunity.name} status={opportunity.status} percentage={opportunity.percentage} mDate={opportunity.mDate}/>)
        })
      }

      <br/><br/><br/>
    </>
  );
};
 
export default Borrower;
