import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { voteOpportunity } from "../../components/transaction/TransactionHelper";
import {
  getTrimmedWalletAddress,
  getExtendableTextBreakup,
  getDisplayAmount,
} from "../../services/displayTextHelper";

const PoolDetails = () => {
  const location = useLocation();
  const [expand, setExpand] = useState(false);
  const [approveStatus, setApproveStatus] = useState(false);
  const [opDetails, setOpDetails] = useState();
  const [info, setInfo] = useState([]);
  const [loanPurpose, setLoanPurpose] = useState({
    isSliced: false,
    firstText: "",
    secondText: "",
  });

  useEffect(() => {
    setOpDetails(location.state);
    loadInfo();
    loadLoanPurpose();
  }, []);

  const status = { approve: approveStatus, unsure: false, reject: false };

  function loadInfo() {
    if (opDetails) {
      setInfo([
        {
          label: "Opening Date",
          value: opDetails.createdOn ? opDetails.createdOn : "--",
        },
        {
          label: "Payment Frequency",
          value: opDetails.paymentFrequencyInDays
            ? opDetails.paymentFrequencyInDays + " Days"
            : "--",
        },
        {
          label: "Borrower Address",
          value: opDetails.borrower
            ? getTrimmedWalletAddress(opDetails.borrower)
            : "--",
        },
        {
          label: "Interest Rate",
          value: opDetails.loanInterest ? opDetails.loanInterest + "%" : "--",
        },
        {
          label: "Payment Tenure",
          value: opDetails.loanTenureInDays
            ? opDetails.loanTenureInDays / 30 + " Months"
            : "--",
        },
        {
          label: "Drawdown Cap",
          value: opDetails.opportunityAmount
            ? getDisplayAmount(opDetails.opportunityAmount)
            : "--",
        },
      ]);
      console.log(info);
    }
  }

  function loadLoanPurpose() {
    const { isSliced, firstText, secondText } = getExtendableTextBreakup(
      opDetails.loanPurpose,
      200
    );
    if (isSliced) {
      setLoanPurpose({
        firstText: firstText,
        secondText: secondText,
        isSlied: isSliced,
      });
    } else {
      setLoanPurpose({
        firstText: firstText,
        isSliced: isSliced,
      });
    }
  }

  function updateStatus() {
    let opStatus = location?.item?.status ?? "";
    if (opStatus == "1") status.reject = true;
    else if (opStatus == "2") status.approve = true;
    else if (opStatus == "3") status.unsure = true;
  }

  async function vote(voteID) {
    await voteOpportunity(location?.item?.opportunityID ?? "", voteID);
    updateStatus();
  }

  return (
    <div>
      <div
        className="flex-row justify-between items-center"
        style={{ display: "flex" }}
      >
        <div className="flex-col">
          <div style={{ fontSize: 28 }} className="mb-0">
            {opDetails?.loanName}
          </div>
          <small style={{ color: "#64748B", fontSize: 14 }}>
            {opDetails?.company_name}
          </small>
        </div>
        <div className="mr-10">
          {status.approve ||
          !(status.approve || status.reject || status.unsure) ? (
            <button
              disabled={status.approve}
              onClick={() => setApproveStatus(true)}
              style={{
                borderRadius: "100px",
                padding: "3px 16px",
                borderColor: "#10B981",
              }}
              className="ml-3 btn btn-xs btn-outline text-[#10B981] text-xs capitalize"
            >
              {status.approve ? "Approved" : "Approve"}
            </button>
          ) : null}

          {status.reject ||
          !(status.approve || status.reject || status.unsure) ? (
            <button
              disabled={status.reject}
              onClick={() => vote("1")}
              style={{
                borderRadius: "100px",
                padding: "3px 16px",
                borderColor: "#EF4444",
              }}
              className="ml-3 btn btn-xs btn-outline text-[#EF4444] text-xs capitalize"
            >
              {status.reject ? "Rejected" : "Reject"}
            </button>
          ) : null}
          {/* {status.unsure ||
          !(status.approve || status.reject || status.unsure) ? (
            <button
              disabled={status.unsure}
              onClick={() => vote("3")}
              style={{ borderRadius: "100px", padding: "3px 16px" }}
              className="ml-3 btn btn-xs btn-outline text-white text-xs capitalize"
            >
              Unsure
            </button>
          ) : null} */}
        </div>
      </div>

      <div
        className="flex-row justify-between items w-full"
        style={{ display: "flex" }}
      >
        <div style={{ display: "flex" }} className="flex-col ">
          <div
            style={{ display: "flex" }}
            className="flex-row justify-between mt-10 mb-3"
          >
            <div style={{ fontSize: 19 }} className="mb-0">
              Deals Overview
            </div>
          </div>
          <div style={{ color: "#D0D5DD" }}>
            {loanPurpose.isSliced ? (
              <div>
                {loanPurpose.firstText}
                <a
                  style={{ fontWeight: 600, cursor: "pointer" }}
                  onClick={() => setExpand(true)}
                >
                  {expand ? null : "view more"}
                </a>
                {expand ? <div>{loanPurpose.secondText}</div> : null}
                <a
                  style={{ fontWeight: 600, cursor: "pointer" }}
                  onClick={() => setExpand(false)}
                >
                  {expand ? "view less" : null}
                </a>
              </div>
            ) : (
              <div>{loanPurpose.firstText} </div>
            )}
          </div>
        </div>
      </div>

      {/* Deal Terms */}

      <div style={{ display: "flex" }} className="flex-col w-full">
        <div
          style={{ display: "flex" }}
          className="flex-row justify-between mt-10 mb-3"
        >
          <div style={{ fontSize: 19 }} className="mb-0">
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
            {info ? (
              info.map((e, i) => {
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
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <div style={{ margin: "20px 0" }}>
        <div style={{ margin: "10px 0", marginTop: "40px", fontSize: 19 }}>
          Collateral
        </div>
        <div
          className="w-full"
          style={{
            background: "#20232A",
            borderRadius: "12px",
            padding: "10px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#64748B" }}>
            Name of documents - <div>{}</div>
          </div>
          <div>Document descripton</div>
          <div style={{ fontSize: 14, color: "#64748B" }}>
            Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco
            cillum dolor. Voluptate exercitation incididunt aliquip deserunt
            reprehenderit elit laborum. Nulla Lorem mollit cupidatat irure.
            Laborum magna nulla duis ullamco cillum dolor. Voluptate
            exercitation incididunt aliquip deserunt reprehenderit elit laborum.
          </div>
        </div>
      </div>

      <div
        style={{ display: "flex", marginTop: "50px" }}
        className="flex-col w-1/2"
      >
        <div style={{ marginTop: "40px", fontSize: 19 }}>Borrower Details</div>
        <div
          style={{ display: "flex" }}
          className="flex-row justify-between mt-5 mb-3"
        >
          <div style={{ fontSize: 16 }} className="mb-0">
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
        <div style={{ color: "#D0D5DD" }}>
          Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco
          cillum dolor. Voluptate exercitation incididunt aliquip deserunt
          reprehenderit elit laborum. Nulla Lorem mollit cupidatat irure.
          Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation
          incididunt aliquip deserunt reprehenderit elit laborum.Nulla Lorem
          mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor.
          Voluptate exercitation incididunt aliquip deserunt reprehenderit elit
          laborum. Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis
          ullamco cillum dolor. Voluptate exercitation incididunt aliquip
          deserunt reprehenderit elit laborum.Voluptate exercitation incididunt
          aliquip deserunt reprehenderit elit laborum. Voluptate exercitation
          incididunt aliquip deserunt reprehenderit elit laborum.Voluptate
          exercitation incididunt aliquip deserunt reprehenderit...view more{" "}
        </div>
      </div>
      <div className="w-1/2">
        <div style={{ margin: "10px 0", marginTop: "40px", fontSize: 19 }}>
          KYC Details
        </div>
      </div>
      <div className="w-1/2">
        <div style={{ margin: "10px 0", marginTop: "40px", fontSize: 19 }}>
          KYB Details
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default PoolDetails;
