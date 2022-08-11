import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GradientButton from "../../tools/Button/GradientButton";
import TransactionCard from "./components/Cards/TransactionCard";
import axiosHttpService from "../../services/axioscall";
import { tokenTransactions } from "../../services/blockchainTransactionDataOptions";
import { kycOptions } from "../../services/KYC/blockpass";
import Alert from "../Components/Alert";

const ViewSeniorPool = () => {
  const location = useLocation();
  const defaultPoolName = "Senior Pool";
  const defaultAPY = "10";
  const defaultPoolAmount = 0;
  const [transactionData, setTransactionData] = useState([]);
  const [poolName, setPoolName] = useState(defaultPoolName);
  const [poolDescription, setPoolDescription] = useState();
  const [estimatedAPY, setEstimatedAPY] = useState(defaultAPY);
  const [poolAmount, setPoolAmount] = useState(defaultPoolAmount);

  const [kycStatus, setKycStatus] = useState(1);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const transactionDetails = await axiosHttpService(
        tokenTransactions(process.env.REACT_APP_SENIORPOOL)
      );
      if (transactionDetails && transactionDetails.res) {
        setTransactionData(transactionDetails.res.result);
      }
    };
    fetchData();
  }, []);

  const checkForKyc = async (refId) => {
    console.log("reached");
    const result = await axiosHttpService(kycOptions(refId));
    console.log(result, result.res.status);
    if (result.res.status === "success") setKycStatus(true);
    if (result.res.status === "error") {
      setError(result.res.message);
      setKycStatus(false);
    }

    console.log(kycStatus);
  };

  useEffect(() => {
    if (location.state) {
      setPoolName(
        location.state.poolName ? location.state.poolName : defaultPoolName
      );
      setPoolDescription(
        location.state.poolDescription ? location.state.poolDescription : ""
      );
      setEstimatedAPY(
        location.state.estimatedAPY ? location.state.estimatedAPY : defaultAPY
      );
      setPoolAmount(
        location.state.opportunityAmount
          ? location.state.opportunityAmount
          : defaultPoolAmount
      );
    }
  }, []);

  return (
    <>
      {!kycStatus && (
        <Alert header={"Please Complete Your KYC."} label={error} />
      )}
      <div style={{ fontSize: 28 }} className="mb-0">
        {poolName}
      </div>

      <div
        className="flex-row justify-between items w-full"
        style={{ display: "flex" }}
      >
        <div style={{ display: "flex" }} className="flex-col w-1/2 ">
          <div
            style={{ display: "flex" }}
            className="flex-row justify-between mt-10 mb-3"
          >
            <div style={{ fontSize: 19 }} className="mb-0">
              Pool Overview
            </div>
          </div>
          <div>{poolDescription}</div>
        </div>
        <div className="w-1/2">
          <div
            style={{
              background: `linear-gradient(285.83deg, rgba(32, 35, 42, 0) 0%, #20232A 103.08%)`,
            }}
            className="rounded-box p-5 mt-10 ml-24"
          >
            <div
              style={{ display: "flex" }}
              className="flex-row justify-between pb-2"
            >
              <h2 style={{ fontSize: 19 }}>Estimated APY.</h2>
              <h2 style={{ fontSize: 28 }}>{estimatedAPY}%</h2>
            </div>
            <div
              style={{ display: "flex" }}
              className="flex-row justify-between pb-2"
            >
              <h2 style={{ fontSize: 19 }}>Total Pool Balance</h2>
              <h2 style={{ fontSize: 28 }}>{poolAmount}</h2>
            </div>

            <GradientButton
              className={"w-full mt-20"}
              onClick={() =>
                checkForKyc("0xC78810A9EDb753C3FdC71EEe6998A68d3B823705")
              }
            >
              Invest
            </GradientButton>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "50px", fontSize: 19, marginBottom: "20px" }}>
        Recent Activity
      </div>
      {transactionData.length > 0 ? (
        <div className="w-1/2">
          {transactionData ? (
            transactionData.map((item) => (
              <TransactionCard
                key={transactionData.blockHash}
                data={item}
                address={process.env.REACT_APP_SENIORPOOL}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      ) : (
        <p>Transaction details are not available at this moment</p>
      )}
    </>
  );
};

export default ViewSeniorPool;
