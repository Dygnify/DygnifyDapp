import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack, TextField, Card } from "@mui/material";
import BorrowChart from "../components/charts/BorrowChart";
import StakeChart from "../components/charts/StakeChart";
import { requestAccount } from "../components/navbar/NavBarHelper";
import {
  approve,
  stake,
  unstake,
  withdrawYield,
  getTotalYield,
  getWalletBal,
  getWithdrawBal,
} from "../components/transaction/TransactionHelper";
import { ethers } from "ethers";


const Wallet = () => {

  const [values, setValues] = useState({
    deposit: "",
    withdraw: "",
    yieldWithdraw: "",
  });

  const { deposit, withdraw, yieldWithdraw } = values;

  const [totalYield, setTotalYield] = useState();
  const [withdrawlBal, setWithdrawlBal] = useState();
  const [walletBalance, setWalletBalance] = useState();

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  useEffect(() => {
    getWalletBal()
      .then((data) => {
        setWalletBalance(Number(data).toFixed(2));
      })
      .catch(() => {
        console.log("Error in getting wallet balance");
      });
  }, [walletBalance, withdrawlBal, totalYield]);

  useEffect(() => {
    getWithdrawBal()
      .then((data) => {
        setWithdrawlBal(Number(data).toFixed(2));
      })
      .catch(() => {
        console.log("Error in getting withdrawl balance");
      });
  }, [withdrawlBal, walletBalance, totalYield]);

  useEffect(() => {
    getTotalYield()
      .then((data) => {
        setTotalYield(Number(data).toFixed(2));
      })
      .catch(() => {
        console.log("Error in getting total yield");
      });
  }, [totalYield, walletBalance, withdrawlBal]);

  const onSubmitApprove = (event) => {
    event.preventDefault();
    setValues({ ...values, deposit: "" });
    const amount = ethers.utils.parseEther(values.deposit);
    console.log("AMOUNT: " + amount);
    approve(amount)
      .then(() => {
      })
      .catch(() => {
        console.log("Can't Approve");
      });
  };

  const onSubmitStake = (event) => {
    event.preventDefault();
    setValues({ ...values, deposit: "" });
    const amount = ethers.utils.parseEther(values.deposit);
    console.log("AMOUNT: " + amount);
    stake(amount)
      .then(() => {
        let temp = walletBalance - values.deposit
        setWalletBalance(temp.toFixed(2));
        // setWithdrawlBal(withdrawlBal + amount);
      })
      .catch(() => {
        console.log("Can't deposit");
      });
  };

  const onSubmitUnstake = (event) => {
    event.preventDefault();
    // console.log(values.withdraw);
    setValues({ ...values, withdraw: "" });
    const amount = ethers.utils.parseEther(values.withdraw);
    unstake(amount)
      .then(() => {
        let temp = withdrawlBal - values.withdraw
        setWithdrawlBal(temp.toFixed(2));
      })
      .catch(() => {
        console.log("Can't withdraw");
      });
  };

  const onSubmitYield = (event) => {
    event.preventDefault();
    // console.log(yieldWithdraw);
    setValues({ ...values, yieldWithdraw: "" });
    withdrawYield()
      .then(() => {
        setTotalYield(0);
      })
      .catch(() => {
        console.log("Can't withdraw yield");
      });
  };

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
        <div>
          <img
            style={{ width: "150px", height: "80px", objectFit: "contain" }}
            src="./logo.png"
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
              USDC
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
      <Stack sx={{ color: "#ffffff", ml: "64px", mt: "28px" }}>
      </Stack>
      <Stack
          sx={{
            color: "#ffffff",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "330px"
          }}
        >
          <Box>
        <Card
          sx={{
            mb: "5px",
            maxWidth: 100,
            py: "2px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            textAlign: "justify",
          }}
        >
          <img
            style={{ width: "88px", height: "77px" }}
            src="./indianWomen.png"
            alt=""
          />
          </Card>
          </Box>
          <Typography ml={2}>Income Generating Loans</Typography>
        </Stack>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          mx: "auto",
          mt: "22px",
          py: "16px",
          px: "16px",
          maxWidth: "900px",
          borderRadius: "12px",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" m={2} sx={{ color: "#5B4ED4" }}>
          Opportunity Statistics
        </Typography>
        <Stack
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Stack>
            <Typography variant="h6">Total Liquidity </Typography>
            <BorrowChart />
          </Stack>
          <Stack>
            <Typography variant="h6">Total Borrowing</Typography>
            <StakeChart />
          </Stack>
        </Stack>
      </Box>
      <Box
        
        sx={{
          backgroundColor: "#ffffff",
          mx: "auto",
          mt: "22px",
          py: "16px",
          px: "16px",
          width: "900px",
          borderRadius: "12px",
        }}
      >  
        <Typography variant="h6" m={2} sx={{ textAlign:"center",color: "#5B4ED4" }}>
          Investor Statistics
        </Typography>
        <Stack
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0px 10px",
            mx: "110px",
          }}
        >
          <Typography variant="subtitle1">Deposit</Typography>
          <Typography variant="subtitle1" style={{marginLeft:"273px"}}>Withdraw</Typography>
          {/* <Typography variant="subtitle1">Withdraw Yield </Typography> */}
        </Stack>
        <Stack
          sx={{
            // display: "flex",
            // gridTemplateColumns: "1fr 1fr 1fr",
            // gap: "0px 10px",
            // mx: "32px",
          }}
        >
          <div style ={{display:"flex"}} >
            <Typography sx={{ color: "#979797", marginLeft:"110px" }} variant="">
            Wallet :{walletBalance}
          </Typography>
          <div style={{display:"flex", flexDirection:"column", marginLeft:"343px" }}><Typography sx={{ color: "#979797" }} variant="">
            Balance :{withdrawlBal}
          </Typography>
          <Typography sx={{ color: "#979797" }} variant="">
            Total Yield :{totalYield}
          </Typography></div>
          </div>
        </Stack>
        <Stack
          sx={{
            // display: "grid",
            // gridTemplateColumns: "1fr 1fr 1fr",
            // gap: "0px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            ml: "32px",
            mr: "60px",
          }}
        ><div style={{display:"flex"}}></div>
          <TextField
            label="Amount"
            variant="outlined"
            margin="normal"
            value={deposit}
            onChange={handleChange("deposit")}
            style={{marginLeft:"110px"}}
          />
          <TextField
            label="Amount"
            variant="outlined"
            margin="normal"
            // value={withdraw}
            // onChange={handleChange("withdraw")}
          />
          {/* <TextField
            label="Amount"
            variant="outlined"
            margin="normal"
            // value={yieldWithdraw}
            // onChange={handleChange("yieldWithdraw")}
          /> */}
        </Stack>
      </Box>
      <Stack
        sx={{
          mx: "auto",
          mt: "12px",
          mb: "48px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Button
          sx={{ backgroundColor: "#ffffff", color: "#7165E3" ,marginLeft:"410px",marginRight:"10px"}}
          variant="contained"
          size="large"
          onClick={onSubmitApprove}
        >
          Approve
        </Button>
        <Button
          sx={{ backgroundColor: "#ffffff", color: "#7165E3" ,marginRight:"35px"}}
          variant="contained"
          size="large"
          onClick={onSubmitStake}
        >
          Approve
        </Button>
        <Button
          sx={{ backgroundColor: "#ffffff", color: "#7165E3" }}
          variant="contained"
          size="large"
        >
          Deposit
        </Button>
        <Button
          sx={{ backgroundColor: "#ffffff", color: "#7165E3" }}
          variant="contained"
          size="large"
          onClick={yieldWithdraw==="" ? onSubmitUnstake : onSubmitYield}
          style={{marginLeft:"160px"}}
        >
          Withdraw
        </Button>
      </Stack>
    </>
  );
};

export default Wallet;
