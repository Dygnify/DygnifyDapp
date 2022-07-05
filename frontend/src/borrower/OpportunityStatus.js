import {React,useState} from "react";
import { ethers } from 'ethers';
import { Box, Button, Typography, Stack, Divider, Card } from "@mui/material";
import { Link } from "react-router-dom";
import { uploadFileToIPFS } from '../services/PinataIPFSOptions';
import { border } from "@mui/system";

const OpportunityStatus = (props) => {

  return (
    <>
    <Box
        sx={{
          mb: "20px",
          maxWidth: 1100,
          py: "20px",
          mx: "auto",
          backgroundColor:"white",
          display:"flex",
          flexDirection : "column",
          alignItems : "center",
          marginTop : "30px"
        }}
      >
        <Box
        sx={{
          mb: "40px",
          maxWidth: 1050,
          width : "100%",
          display: "flex",
          px:"30px",
          justifyContent : "space-between",
          backgroundColor:"white",
          alignItems : "center",
        }}
      >
        
          <div style={{display:"flex" }}>
            <img
              style={{ width: "88px", height: "77px" }}
              src="./assets/supply-chain.png"
              alt=""
            />
            <div>
              <Typography mb={1} variant="h6" >
                {props.opportunityName}
              </Typography> 
              <Typography mb={1} fontSize="14px" >
                Product : Term Loan
              </Typography>
            </div>
          </div>

          <div style={{display:"flex", alignItems : "center"}}>
            
              <Typography mb={1} fontSize="14px" style={{ marginRight:"10px"}} >
                Maturity  Date  : {props.mDate} 
              </Typography> 
              <Box
                sx={{ 
                  backgroundColor: "White" ,
                  width:"180px" , 
                  height: "45px", 
                  border: `${props.status=="Funded" ? "1.5px solid #7165e3" : (props.status==="Active" ? "1.5px solid green" : "1.5px solid grey" ) }` , 
                  color : `${props.status=="Funded" ? "#7165e3" : (props.status=="Active" ? "green" : "grey" ) }`,
                  display:"flex" ,
                  alignItems:"center", 
                  justifyContent:"center" 
                }}
              >
              {props.status === "Funded" ? `${props.percentage} Funded` : props.status} 
              </Box> 
          </div>

          
          </Box>         

          <Box>
        <Card
          sx={{
            width:"1000px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            textAlign: "center",
            marginTop : "20px",
          }}
        >
          <div style={{width:"20%"}}>
            <Typography  variant="subtitle2">
              10%
            </Typography>
            <Typography variant="overline">Interest Rate </Typography>
          </div>
          <div style={{width:"25%"}}>
            <Typography variant="subtitle2">Monthly</Typography>
            <Typography variant="overline">Interest Repayment Frequency  </Typography>
          </div>
          <div style={{width:"20%"}}> 
            <Typography variant="subtitle2">Bullet</Typography>
            <Typography variant="overline">Principal Repayment</Typography>
          </div>
          <div style={{width:"20%"}}>
            <Typography variant="subtitle2">36 months</Typography>
            <Typography variant="overline">Tenor</Typography>
          </div>
          <div style={{width:"20%"}}>
            <Typography variant="subtitle2">10,00,000 {process.env.REACT_APP_TOKEN_NAME}</Typography>
            <Typography variant="overline">Total Limit</Typography>
          </div>
        </Card>
      </Box>
      </Box>
      
    </>
  );
};
 
export default OpportunityStatus;
