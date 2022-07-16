import {React,useState} from "react";
import { ethers } from 'ethers';
import { Box, Button, Typography, Stack, Divider, Card } from "@mui/material";
import { Link } from "react-router-dom";
import { uploadFileToIPFS } from '../services/PinataIPFSOptions';
import { border } from "@mui/system";

const DrawdownCard = () => {

  return (
    <>
    <Box
        sx={{
          mb: "20px",
          maxWidth: 1100,
          height :"320px",
          py: "20px",
          mx: "auto",
          backgroundColor:"white",
          display:"flex",
          flexDirection : "column",
          alignItems : "center"
        }}
      >
        <Box
        sx={{
          mb: "40px",
          maxWidth: 1100,
          display: "grid",
          px:"30px",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "240px",
          backgroundColor:"white",
          alignItems : "center"
        }}
      >
        <img
            style={{ width: "88px", height: "77px" }}
            src="./assets/supply-chain.png"
            alt=""
          />
          <div style={{width:"160px", textAlign:"center"}}>
            <Typography mb={1} variant="h6" >
              Opportunity 4
            </Typography> 
            <Typography mb={1} fontSize="14px" >
              Product : Term Loan
            </Typography>
            <Typography mb={1} fontSize="14px" >
              Maturity  Date  :  __/__/____
            </Typography>
          </div>

          <Button
                sx={{ backgroundColor: "White" ,width:"180px" , height: "45px", border:"1px solid #7165E3", color : "#7165E3"}}
                variant="contained"
                size="large"
              >
                Ready to Draw 
          </Button> 
          </Box>
          <div>
          <div style={{display:"flex",flexDirection:"column", alignItems:"center",width: "1100px"}} >
            <div style={{width:"75%",height:"10px", backgroundColor:"grey" }}> <div style={{width:"100%",height:"10px", backgroundColor:"#7165E3" }}></div> </div>
          </div>

          <div style={{padding:"0px 8em", textAlign:"right"}}>
            <Typography mb={1} variant="subtitle2" >
              15,00,000 {process.env.REACT_APP_TOKEN_NAME}
            </Typography> 
            <Typography mb={1} fontSize="14px" >
                Total Limit
            </Typography>
          </div>
          </div>
          <Button
                sx={{ backgroundColor: "#7165E3" ,width:"200px", }}
                variant="contained"
                size="large"
              >
                Drawdown
          </Button> 

          <Box>
        <Card
          sx={{
            width:"900px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            textAlign: "center",
            marginTop : "20px",
            boxShadow: "2px 4px 4px darkgrey",
            border : "1px solid grey"
          }}
        >
          <div>
            <Typography style={{}} variant="subtitle2">
              10%
            </Typography>
            <Typography variant="overline">Interest Rate </Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />
          <div>
            <Typography variant="subtitle2">Monthly</Typography>
            <Typography variant="overline">Interest Repayment Frequency  </Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />{" "}
          <div>
            <Typography variant="subtitle2">Bullet</Typography>
            <Typography variant="overline">Principal Repayment</Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />{" "}
          <div>
            <Typography variant="subtitle2">36 months</Typography>
            <Typography variant="overline">Tenor</Typography>
          </div>
        </Card>
      </Box>

      </Box>
      
    </>
  );
};
 
export default DrawdownCard;
