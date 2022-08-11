import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import InvestModal from "../Investor/components/Modal/InvestModal";
import GradientButton from "../../tools/Button/GradientButton";
import TransactionCard from "./components/Cards/TransactionCard";
import {
  getWalletBal,
  getUserWalletAddress,
} from "../../components/transaction/TransactionHelper";
import axiosHttpService from "../../services/axioscall";
import { kycOptions } from "../../services/KYC/blockpass";
import Alert from "../Components/Alert";
import Twitter from "../SVGIcons/Twitter";
import Website from "../SVGIcons/Website";
import LinkedIn from "../SVGIcons/LinkedIn";

const ViewPool = () => {
  const location = useLocation();
  const poolData = location.state;
  const [dueList, setDueList] = useState([]);
  const [expand, setExpand] = useState(false);

  const [kycStatus, setKycStatus] = useState(1);
  const [error, setError] = useState();

  const [selected, setSelected] = useState(null);

  const handleDrawdown = () => {
    setSelected(null);
  };

  const loadBlockpassWidget = (address) => {
    const blockpass = new window.BlockpassKYCConnect(
      process.env.REACT_APP_CLIENT_ID, // service client_id from the admin console
      {
        refId: address, // assign the local user_id of the connected user
      }
    );

    blockpass.startKYCConnect();

    blockpass.on("KYCConnectSuccess", () => {
      //add code that will trigger when data have been sent.
    });
  };

  const info = [
    {
      label: "Interest Rate",
      value: "10.00%",
    },
    { label: "Payment Tenure", value: "4 Years" },
    { label: "Drawdown Cap", value: "$100,000" },
  ];

  useEffect(() => {
    getUserWalletAddress().then((address) => loadBlockpassWidget(address));
    fetch("/dueList.json")
      .then((res) => res.json())
      .then((data) => setDueList(data));
  }, [dueList]);

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

  return (
    <>
      <div>
        {!kycStatus && (
          <Alert header={"Please Complete Your KYC."} label={error} />
        )}
        {selected ? <InvestModal handleDrawdown={handleDrawdown} /> : null}
        <div
          className="flex-row justify-between items-center"
          style={{ display: "flex" }}
        >
          <div className="flex-col">
            <div style={{ fontSize: 28 }} className="mb-0">
              Name of the Pool
            </div>
            <small style={{ color: "#64748B", fontSize: 14 }}>
              Name of the creator company
            </small>
          </div>
          <div className="mr-10">
            <button
              id="linkedin"
              style={{
                borderRadius: "100px",
                padding: "3px 16px",
                border: "1px solid #64748B",
              }}
              className="ml-3 btn btn-xs btn-outline text-white"
            >
              <LinkedIn />
              <div style={{ marginLeft: 2 }}>LinkedIn</div>
            </button>

            <button
              id="linkedin"
              style={{
                borderRadius: "100px",
                padding: "3px 16px",
                border: "1px solid #64748B",
              }}
              className="ml-3 btn btn-xs btn-outline text-white"
            >
              <Website />
              <div style={{ marginLeft: 2 }}>Website</div>
            </button>
            <button
              id="twitter"
              style={{
                borderRadius: "100px",
                padding: "3px 16px",
                border: "1px solid #64748B",
              }}
              className="ml-3 btn btn-xs btn-outline text-white"
            >
              <Twitter />
              <div style={{ marginLeft: 2 }}>twitter</div>
            </button>
          </div>
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
                Deals Overview
              </div>
            </div>
            <div>
              Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis
              ullamco cillum dolor. Voluptate exercitation incididunt aliquip
              deserunt reprehenderit elit laborum. Nulla Lorem mollit cupidatat
              irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate
              exercitation incididunt aliquip deserunt reprehenderit elit
              laborum.Nulla Lorem mollit cupidatat irure. Laborum magna nulla
              duis ullamco cillum dolor. Voluptate exercitation incididunt
              aliquip deserunt reprehenderit elit laborum. Nulla Lorem mollit
              cupidatat irure. Laborum magna nulla duis ullamco cillum dolor.
              Voluptate exercitation incididunt aliquip deserunt reprehenderit
              elit laborum.Voluptate exercitation incididunt aliquip deserunt
              reprehenderit elit laborum. Voluptate exercitation incididunt
              aliquip deserunt reprehenderit elit laborum.Voluptate exercitation
              incididunt aliquip deserunt reprehenderit...
              <a
                style={{ fontWeight: 600, cursor: "pointer" }}
                onClick={() => setExpand(true)}
              >
                {expand ? null : "view more"}
              </a>
              {expand ? (
                <div>
                  Laborum magna nulla duis ullamco cillum dolor. Voluptate
                  exercitation incididunt aliquip deserunt reprehenderit elit
                  laborum.Nulla Lorem mollit cupidatat irure. Laborum magna
                  nulla duis ullamco cillum dolor. Voluptate exercitation
                  incididunt aliquip deserunt reprehenderit elit laborum. Nulla
                  Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco
                  cillum dolor. Voluptate
                </div>
              ) : null}
              <a
                style={{ fontWeight: 600, cursor: "pointer" }}
                onClick={() => setExpand(false)}
              >
                {expand ? "view less" : null}
              </a>
            </div>
          </div>
          <div className="w-1/2">
            <div
              style={{
                height: 290,
                background: `linear-gradient(285.83deg, rgba(32, 35, 42, 0) 0%, #20232A 103.08%)`,
              }}
              className="rounded-box p-5 mt-10 ml-24"
            >
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2"
              >
                <h2 style={{ fontSize: 19 }}>Estimated APY.</h2>
                <h2 style={{ fontSize: 28 }}>24%</h2>
              </div>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2"
              >
                <h2 style={{ fontSize: 19 }}>Pool Limit</h2>
                <h2 style={{ fontSize: 28 }}>$10,000,000</h2>
              </div>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2"
              >
                <h2 style={{ fontSize: 19 }}>Total supplied</h2>
                <h2 style={{ fontSize: 28 }}>$8,000,000</h2>
              </div>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2"
              >
                <h2 style={{ fontSize: 19 }}>Payment terms</h2>
                <h2 style={{ fontSize: 28 }}>4 Years</h2>
              </div>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2"
              >
                <h2 style={{ fontSize: 19 }}>Payment frequency</h2>
                <h2 style={{ fontSize: 28 }}>30 Days</h2>
              </div>

              <GradientButton
                id="blockpass-kyc-connect"
                className={"w-full mt-20"}
                onClick={() => {
                  setSelected(true);
                  console.log(selected);
                }}
              >
                Invest KYC
              </GradientButton>
              {/* <GradientButton
                className={"w-full mt-20"}
                onClick={() => {
                  setSelected(true);
                  console.log(selected);
                }}
              >
                Invest modal
              </GradientButton> */}
              <label
                htmlFor="InvestModal"
                style={{
                  borderRadius: "100px",
                  padding: "12px 24px",
                  color: "white",
                }}
                className={`btn btn-wide bg-gradient-to-r from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize font-medium border-none `}
                onClick={() => setSelected(true)}
              >
                Invest
              </label>
            </div>
          </div>
        </div>

        {/* Deal Terms */}

        <div style={{ display: "flex" }} className="flex-col w-1/2">
          <div
            style={{ display: "flex" }}
            className="flex-row justify-between mt-10 mb-3"
          >
            <div style={{ fontSize: 19 }} className="mb-0">
              Deals terms
            </div>
            <div
              style={{
                width: 119,
                height: 36,
                background: "#292C33",
                display: "flex",
                fontSize: 14,
              }}
              className="rounded-box items-center justify-center ml-20"
            >
              Contracts
            </div>
          </div>

          <div
            className=" flex-col  justify-center w-full rounded-box"
            style={{
              display: "flex",
              background: " #20232A",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex" }} className="w-full">
              {info.map((e, i) => {
                return (
                  <div
                    className="justify-center w-1/3 flex-col items-center "
                    style={{
                      display: "flex",
                      borderRight: "0.5px solid   #292C33",
                      borderBottom: "0.5px solid   #292C33",
                      padding: "40px 0",
                    }}
                  >
                    <div style={{ fontSize: 14, color: "#A0ABBB" }}>
                      {e.label}
                    </div>
                    <div style={{ fontSize: 20 }}>{e.value}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex" }} className="w-full">
              {info.map((e, i) => {
                return (
                  <div
                    className="justify-center w-1/3 flex-col items-center "
                    style={{
                      display: "flex",
                      borderRight: "0.5px solid   #292C33",
                      padding: "40px 0",
                    }}
                  >
                    <div style={{ fontSize: 14, color: "#A0ABBB" }}>
                      {e.label}
                    </div>
                    <div style={{ fontSize: 20 }}>{e.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "50px", fontSize: 19, marginBottom: "20px" }}>
          Recent Activity
        </div>

        <div>
          {dueList.map((item) => (
            <TransactionCard key={dueList.id} data={item} />
          ))}
        </div>

        <div style={{ display: "flex" }} className="flex-col w-1/2">
          <div
            style={{ display: "flex" }}
            className="flex-row justify-between mt-10 mb-3"
          >
            <div style={{ fontSize: 19 }} className="mb-0">
              Name of Company
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                background: "#292C33",
                display: "flex",
              }}
              className="rounded-box items-center justify-center ml-20"
            >
              in
            </div>
          </div>
          <div>
            Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco
            cillum dolor. Voluptate exercitation incididunt aliquip deserunt
            reprehenderit elit laborum. Nulla Lorem mollit cupidatat irure.
            Laborum magna nulla duis ullamco cillum dolor. Voluptate
            exercitation incididunt aliquip deserunt reprehenderit elit
            laborum.Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis
            ullamco cillum dolor. Voluptate exercitation incididunt aliquip
            deserunt reprehenderit elit laborum. Nulla Lorem mollit cupidatat
            irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate
            exercitation incididunt aliquip deserunt reprehenderit elit
            laborum.Voluptate exercitation incididunt aliquip deserunt
            reprehenderit elit laborum. Voluptate exercitation incididunt
            aliquip deserunt reprehenderit elit laborum.Voluptate exercitation
            incididunt aliquip deserunt reprehenderit...view more{" "}
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </>
  );
};

export default ViewPool;
