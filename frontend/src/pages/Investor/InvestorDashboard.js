import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import Opportunity from "./Opportunity";
import PieGraph from "../../investor/components/PieChart";
import Graph from "../../mock/components/Graph";
import { useState } from "react";
import { useEffect } from "react";
import { getAllActiveOpportunities } from "../../components/transaction/TransactionHelper";
import JuniorPoolCard from "./JuniorPoolCard";

const InvestorDashboard = () => {

    const [opportunities, setOpportunities] = useState([]);
    const [juniorPool, setJuniorPool] = useState([]);
    const [seniorPool, setSeniorPool] = useState([]);

    useEffect(() => {
        const fetchJSON = async () => {
            let json = await getAllActiveOpportunities();
            setOpportunities(json)
        };

        fetchJSON();
    }, []);

    useEffect(() => {
        fetch('/juniorPool.json')
            .then(res => res.json())
            .then(data => setJuniorPool(data))
    }, [])

    useEffect(() => {
        fetch('/seniorPool.json')
            .then(res => res.json())
            .then(data => setSeniorPool(data))
    }, [])

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
                    <Button
                        sx={{ backgroundColor: "#7165E3" }}
                        variant="contained"
                        size="large"
                    >
                        Connect Wallet
                    </Button>
                </div>
            </Box>
            <Stack sx={{ color: "#ffffff", mt: "28px", textAlign: "center" }}>
                <Typography variant="h4">Investor Dashboard</Typography>
            </Stack>
            <Box
                sx={{
                    width: "1100px",
                    backgroundColor: "#ffffff",
                    mx: "auto",
                    my: "12px",
                    borderRadius: "12px",
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        width: "900px",
                    }}>
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
            </Box>
            <Stack
                sx={{
                    mt: "30px",
                    maxWidth: 1100,
                    py: "10px",
                    textAlign: 'center',
                    mx: 'auto',
                    color: "#ffffff",
                }}
            >
                <Typography variant="h4">Withdrawal Notifications</Typography>
            </Stack>
            <Box>
                {
                    seniorPool.length ?
                        <>
                            <Stack
                                sx={{
                                    mt: "30px",
                                    maxWidth: 1100,
                                    py: "10px",
                                    mx: 'auto',
                                    color: "#ffffff",
                                }}
                            >
                                <Typography variant="h5">Senior Pool</Typography>
                            </Stack>

                            {seniorPool.map((data, index) => <JuniorPoolCard key={index} data={data}></JuniorPoolCard>)}</>
                        :
                        <Stack
                            sx={{
                                mt: "30px",
                                maxWidth: 1100,
                                py: "10px",
                                textAlign: 'center',
                                mx: 'auto',
                                color: "#ffffff",
                            }}
                        >
                            <Typography variant="h4">No Withdrawal Available!!!</Typography>
                        </Stack>
                }
            </Box>
            <Box>
                {
                    juniorPool.length ?
                        <>
                            <Stack
                                sx={{
                                    mt: "30px",
                                    maxWidth: 1100,
                                    py: "10px",
                                    mx: 'auto',
                                    color: "#ffffff",
                                }}
                            >
                                <Typography variant="h5">Junior Pool</Typography>
                            </Stack>

                            {juniorPool.map((data, index) => <JuniorPoolCard key={index} data={data}></JuniorPoolCard>)}</>
                        :
                        <Stack
                            sx={{
                                mt: "30px",
                                maxWidth: 1100,
                                py: "10px",
                                textAlign: 'center',
                                mx: 'auto',
                                color: "#ffffff",
                            }}
                        >
                            <Typography variant="h4">No Withdrawal Available!!!</Typography>
                        </Stack>
                }
            </Box>
            <Box>
                {
                    opportunities.length ?
                        <>
                            <Stack
                                sx={{
                                    mt: "30px",
                                    maxWidth: 1100,
                                    py: "10px",
                                    textAlign: 'center',
                                    mx: 'auto',
                                    color: "#ffffff",
                                }}
                            >
                                <Typography variant="h4">Active Opportunities</Typography>
                            </Stack>
                            {opportunities.map((opportunity, index) => <Opportunity key={index} opportunity={opportunity}></Opportunity>)}</>
                        :
                        <Stack
                            sx={{
                                mt: "30px",
                                maxWidth: 1100,
                                py: "10px",
                                textAlign: 'center',
                                mx: 'auto',
                                color: "#ffffff",
                            }}
                        >
                            <Typography variant="h4">Sorry..No Approved Opportunities!!!</Typography>
                        </Stack>
                }
            </Box>
        </>
    );
};

export default InvestorDashboard;