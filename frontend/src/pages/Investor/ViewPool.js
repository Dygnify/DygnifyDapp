import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import InvestModal from "../Investor/components/Modal/InvestModal";
import GradientButton from "../../tools/Button/GradientButton";
import TransactionCard from "./components/Cards/TransactionCard";
import {
  getWalletBal,
  getUserWalletAddress,
  getBorrowerDetails,
} from "../../components/transaction/TransactionHelper";
import axiosHttpService from "../../services/axioscall";
import { kycOptions } from "../../services/KYC/blockpass";
import Alert from "../Components/Alert";
import Twitter from "../SVGIcons/Twitter";
import Website from "../SVGIcons/Website";
import LinkedIn from "../SVGIcons/LinkedIn";
import {
  getBinaryFileData,
  getDataURLFromFile,
} from "../../services/fileHelper";
import { retrieveFiles } from "../../services/web3storageIPFS";
import { getExtendableTextBreakup } from "../../services/displayTextHelper";
import { getDisplayAmount } from "../../services/displayTextHelper";
import { tokenTransactions } from "../../services/blockchainTransactionDataOptions";
import Loader from "../../tools/Loading/Loader";
import ProcessingFundsModal from "./components/Modal/ProcessingFundsModal";

const ViewPool = () => {
  const location = useLocation();
  const [poolData, setPoolData] = useState();
  const [transactionData, setTransactionData] = useState([]);
  const [expand, setExpand] = useState(false);
  const [companyDetails, setCompanyDetails] = useState();
  const [poolName, setPoolName] = useState();
  const [kycStatus, setKycStatus] = useState();
  const [error, setError] = useState();
  const [poolBal, setPoolBal] = useState();
  const [info, setInfo] = useState([]);
  const [info2, setInfo2] = useState([]);
  const [loanPurpose, setLoanPurpose] = useState({
    isSliced: false,
    firstText: "",
    secondText: "",
  });
  const [selected, setSelected] = useState(null);
  const [logoImgSrc, setLogoImgSrc] = useState();
  const [processFundModal, setProcessFundModal] = useState();
  const [investProcessing, setInvestProcessing] = useState();

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getUserWalletAddress()
      .then((address) => loadBlockpassWidget(address))
      .finally(() => setLoading(false));
    if (location?.state) {
      setPoolData(location.state);
      setKycStatus(
        location.state?.kycStatus ? location.state?.kycStatus : false
      );
    }
  }, []);

  useEffect(() => {
    if (poolData) {
      loadInfo();
      // get pool balance
      getWalletBal(poolData.opportunityPoolAddress).then((amt) => {
        if (amt) {
          setPoolBal(getDisplayAmount(amt));
        }
      });

      // get Pool Transaction Data
      axiosHttpService(tokenTransactions(poolData.opportunityPoolAddress))
        .then((transactionDetails) => {
          if (transactionDetails && transactionDetails.res) {
            setTransactionData(transactionDetails.res.result);
          }
        })
        .catch((error) => console.log(error));

      // fetch the opportunity details from IPFS
      retrieveFiles(poolData.opportunityInfo, true).then((res) => {
        if (res) {
          let read = getBinaryFileData(res);
          read.onloadend = function () {
            let opJson = JSON.parse(read.result);
            if (opJson) {
              setPoolName(opJson.loan_name);
              setCompanyDetails(opJson.companyDetails);
              getCompanyLogo(
                opJson.companyDetails?.companyLogoFile?.businessLogoFileCID
              );
              // get the loan purpose
              const { isSliced, firstText, secondText } =
                getExtendableTextBreakup(opJson.loan_purpose, 200);

              if (isSliced) {
                setLoanPurpose({
                  firstText: firstText,
                  secondText: secondText,
                  isSliced: isSliced,
                });
              } else {
                setLoanPurpose({
                  firstText: firstText,
                  isSliced: isSliced,
                });
              }
            }
          };
        }
      });
    }
  }, [poolData]);

  function loadInfo() {
    if (poolData) {
      setInfo([
        {
          label: "Interest Rate",
          value: poolData.loanInterest ? poolData.loanInterest : "--",
        },
        {
          label: "Payment Tenure",
          value: poolData.loanTenure ? poolData.loanTenure : "--",
        },
        {
          label: "Drawdown Cap",
          value: poolData.opportunityAmount ? poolData.opportunityAmount : "--",
        },
      ]);

      setInfo2([
        {
          label: "Opening Date",
          value: poolData.createdOn ? poolData.createdOn : "--",
        },
        {
          label: "Payment Frequency",
          value: poolData.paymentFrequencyInDays
            ? poolData.paymentFrequencyInDays
            : "--",
        },
        {
          label: "Borrower Address",
          value: poolData.borrowerDisplayAdd
            ? poolData.borrowerDisplayAdd
            : "--",
        },
      ]);
    }
  }

  const redirectToURl = (event) => {
    let url;
    switch (event.target.id) {
      case "twitter":
        url = poolData.twitter;
        break;
      case "linkedin":
        url = poolData.linkedin;
        break;
      case "website":
        url = poolData.website;
        break;
    }

    if (url) {
      let protocol = "https://";
      let position = url.search(protocol);
      // if there is no "https://" in the url then it is not opened correctly
      if (position === -1) {
        url = protocol + url;
      }
      window.open(url, "_blank");
    }
  };

  async function getCompanyLogo(cid) {
    if (!cid) {
      return;
    }
    try {
      retrieveFiles(cid, true).then((res) => {
        if (res) {
          let read = getDataURLFromFile(res);
          read.onloadend = function () {
            setLogoImgSrc(read.result);
            console.log(read.result);
          };
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {loading && <Loader />}
      <div className={`${loading ? "blur-sm" : ""}`}>
        {selected ? (
          <InvestModal
            handleDrawdown={handleDrawdown}
            isSenior={false}
            poolAddress={poolData?.opportunityPoolAddress}
            poolName={poolName}
            poolLimit={poolData?.opportunityAmount}
            estimatedAPY={poolData?.loanInterest}
            setProcessFundModal={setProcessFundModal}
            setInvestProcessing={setInvestProcessing}
          />
        ) : null}

        {processFundModal ? (
          <ProcessingFundsModal investProcessing={investProcessing} />
        ) : (
          <></>
        )}

        <div
          className="flex-row justify-between items-center"
          style={{ display: "flex" }}
        >
          <div className="flex-col">
            <div style={{ fontSize: 28 }} className="mb-0">
              {poolName}
            </div>
            <small style={{ color: "#64748B", fontSize: 14 }}>
              {companyDetails ? companyDetails.companyName : ""}
            </small>
          </div>
          <div className="mr-10">
            {companyDetails && companyDetails.linkedin ? (
              <button
                id="linkedin"
                style={{
                  borderRadius: "100px",
                  padding: "3px 16px",
                  border: "1px solid #64748B",
                }}
                className="ml-3 btn btn-xs btn-outline text-white"
                onClick={redirectToURl}
              >
                <LinkedIn />
                <div style={{ marginLeft: 2 }}>LinkedIn</div>
              </button>
            ) : (
              <></>
            )}

            {companyDetails && companyDetails.website ? (
              <button
                id="website"
                style={{
                  borderRadius: "100px",
                  padding: "3px 16px",
                  border: "1px solid #64748B",
                }}
                className="ml-3 btn btn-xs btn-outline text-white"
                onClick={redirectToURl}
              >
                <Website />
                <div style={{ marginLeft: 2 }}>Website</div>
              </button>
            ) : (
              <></>
            )}
            {companyDetails && companyDetails.twitter ? (
              <button
                id="twitter"
                style={{
                  borderRadius: "100px",
                  padding: "3px 16px",
                  border: "1px solid #64748B",
                }}
                className="ml-3 btn btn-xs btn-outline text-white"
                onClick={redirectToURl}
              >
                <Twitter />
                <div style={{ marginLeft: 2 }}>twitter</div>
              </button>
            ) : (
              <></>
            )}
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
              <div style={{ fontSize: 19, fontWeight: "600" }} className="mb-0">
                Deals Overview
              </div>
            </div>
            {loanPurpose.isSliced ? (
              <div>
                {loanPurpose.firstText}
                <a
                  style={{
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => setExpand(true)}
                >
                  {expand ? null : "... view more"}
                </a>
                {expand ? <div>{loanPurpose.secondText}</div> : null}
                <a
                  style={{
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => setExpand(false)}
                >
                  {expand ? "view less" : null}
                </a>
              </div>
            ) : (
              <div>{loanPurpose.firstText} </div>
            )}
          </div>
          <div className="w-1/2 flex-col  " style={{ display: "flex" }}>
            <div
              style={{
                background: `linear-gradient(285.83deg, rgba(32, 35, 42, 0) 0%, #20232A 103.08%)`,
              }}
              className="rounded-box p-5 mt-10 ml-24 "
            >
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2 "
              >
                <h2 style={{ fontSize: 19, marginBottom: 2 }}>
                  Estimated APY.
                </h2>
                <h2 style={{ fontSize: 28 }}>
                  {poolData ? poolData.loanInterest : "--"}
                </h2>
              </div>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2"
              >
                <h2 style={{ fontSize: 19 }}>Pool Limit</h2>
                <h2 style={{ fontSize: 28 }}>
                  {poolData ? poolData.opportunityAmount : "--"}
                </h2>
              </div>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2"
              >
                <h2 style={{ fontSize: 19 }}>Total supplied</h2>
                <h2 style={{ fontSize: 28 }}>{poolBal ? poolBal : "--"}</h2>
              </div>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2"
              >
                <h2 style={{ fontSize: 19 }}>Payment terms</h2>
                <h2 style={{ fontSize: 28 }}>
                  {poolData ? poolData.loanTenure : "--"}
                </h2>
              </div>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-between pb-2"
              >
                <h2 style={{ fontSize: 19 }}>Payment frequency</h2>
                <h2 style={{ fontSize: 28 }}>
                  {poolData ? poolData.paymentFrequencyInDays : "--"}
                </h2>
              </div>

              <label
                htmlFor={kycStatus ? "InvestModal" : ""}
                id={kycStatus ? "" : "blockpass-kyc-connect"}
                style={{
                  borderRadius: "100px",
                  padding: "12px 24px",
                  color: "white",
                  marginTop: 20,
                }}
                className={`btn w-full bg-gradient-to-r from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize font-medium border-none `}
                onClick={() => {
                  if (kycStatus) return setSelected(true);
                  else return null;
                }}
              >
                {kycStatus ? "Invest" : "Complete your KYC"}
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
            <div style={{ fontSize: 19, fontWeight: "600" }} className="mb-0">
              Deals terms
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
              {info.map((e) => {
                <div
                  key={e.label}
                  className="justify-center w-1/3 flex-col items-center "
                  style={{
                    display: "flex",
                    borderRight: "0.5px solid   #292C33",
                    borderBottom: "0.5px solid   #292C33",
                    padding: "40px 0",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      color: "#A0ABBB",
                    }}
                  >
                    {e.label}
                  </div>
                  <div style={{ fontSize: 20 }}>{e.value}</div>
                </div>;
              })}
            </div>

            <div style={{ display: "flex" }} className="w-full">
              {info2.map((e) => {
                <div
                  key={e.label}
                  className="justify-center w-1/3 flex-col items-center "
                  style={{
                    display: "flex",
                    borderRight: "0.5px solid   #292C33",
                    padding: "40px 0",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      color: "#A0ABBB",
                    }}
                  >
                    {e.label}
                  </div>
                  <div style={{ fontSize: 20 }}>{e.value}</div>
                </div>;
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "50px",
            fontSize: 19,
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Recent Activity
        </div>

        <div className="w-1/2">
          {transactionData.length ? (
            <>
              {transactionData.map((item) => (
                <TransactionCard
                  key={transactionData.blockHash}
                  data={item}
                  address={poolData.opportunityPoolAddress}
                />
              ))}
            </>
          ) : (
            <p>Transaction details are not available at this moment</p>
          )}
        </div>

        <div
          style={{
            marginTop: "50px",
            fontSize: 19,
            marginBottom: 10,
            fontWeight: "600",
          }}
        >
          Borrower Details
        </div>

        <div style={{ display: "flex" }} className="flex-col w-1/2">
          <div
            style={{ display: "flex" }}
            className="flex-row justify-between  mb-3"
          >
            <div
              style={{ display: "flex" }}
              className="flex-row gap-4 items-center"
            >
              <img
                style={{
                  background: "red",
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                }}
                src={logoImgSrc}
              />
              <div style={{ fontSize: 18, fontWeight: "600" }} className="mb-0">
                {companyDetails?.companyName}
              </div>
            </div>
            {companyDetails && companyDetails.linkedin ? (
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
            ) : (
              <></>
            )}
          </div>
          <div>
            {companyDetails ? (
              companyDetails.companyBio
            ) : (
              <p>Unable to fetch company profile</p>
            )}
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default ViewPool;
