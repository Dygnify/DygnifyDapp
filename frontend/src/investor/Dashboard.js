import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Divider,
  Card,
} from "@mui/material";
import PieGraph from "./components/PieChart";
import Graph from "../mock/components/Graph";

const Dashboard = () => {
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
        </div>
      </Box>
      <Stack sx={{ color: "#ffffff", mt: "28px", textAlign : "center" }}>
        <Typography variant="h4">Investor Dashboard</Typography>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          backgroundColor: "#ffffff",
          width: "900px",
          mx: "auto",
          my: "12px",
          borderRadius: "12px",
        }}
      >
        <PieGraph />
        <Stack
          sx={{
            py: "38px",
            width: 400,
          }}
        >
          <Graph />
        </Stack>
      </Box>
      <Box>
        <Card
          sx={{
            my: "20px",
            maxWidth: 900,
            height: 80,
            mx: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <Typography style={{marginLeft:"36px"}} variant="subtitle2">
              Income Generating Loans{" "}
            </Typography>
            <Typography variant="overline">Opportunity</Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />
          <div>
            <Typography variant="subtitle2">10.45 </Typography>
            <Typography variant="overline">APR %</Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />{" "}
          <div>
            <Typography variant="subtitle2">5,00,000 {process.env.REACT_APP_TOKEN_NAME}</Typography>
            <Typography variant="overline">Amount Invested</Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />{" "}
          <div>
            <Typography variant="subtitle2">52,250 {process.env.REACT_APP_TOKEN_NAME}</Typography>
            <Typography variant="overline">Yield Generated</Typography>
          </div>
        </Card>
      </Box>
      <Box>
        <Card
          sx={{
            my: "20px",
            maxWidth: 900,
            height: 80,
            mx: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <Typography variant="subtitle2">
              EVs : New-age delivery partners
            </Typography>
            <Typography variant="overline">Opportunity</Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />
          <div>
            <Typography variant="subtitle2">12.15 </Typography>
            <Typography variant="overline">APR %</Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />
          <div>
            <Typography variant="subtitle2">2,00,000 {process.env.REACT_APP_TOKEN_NAME}</Typography>
            <Typography variant="overline">Amount Invested</Typography>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />
          <div>
            <Typography variant="subtitle2">48,600 {process.env.REACT_APP_TOKEN_NAME}</Typography>
            <Typography variant="overline">Yield Generated</Typography>
          </div>
        </Card>
      </Box>
    </>
  );
};

export default Dashboard;
