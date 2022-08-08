import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GradientButton from "../../tools/Button/GradientButton";
import { voteOpportunity } from "../../components/transaction/TransactionHelper";

const PoolDetails = () => {
  const location = useLocation();
  const OP = {
    estimatedAPY: "24%",
  };
  const [expand, setExpand] = useState(false);

  const [approveStatus, setApproveStatus] = useState(false);

  const status = { approve: approveStatus, unsure: false, reject: false };

  const info = [
    {
      label: "Opening Date",
      value: "--",
    },
    { label: "Payment Frequency", value: "4 Years" },
    { label: "Borrower Address", value: "0xfasd45sd" },
  ];

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
            Name of the Pool
          </div>
          <small style={{ color: "#64748B", fontSize: 14 }}>
            Name of the creator company
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
          {status.unsure ||
          !(status.approve || status.reject || status.unsure) ? (
            <button
              disabled={status.unsure}
              onClick={() => vote("3")}
              style={{ borderRadius: "100px", padding: "3px 16px" }}
              className="ml-3 btn btn-xs btn-outline text-white text-xs capitalize"
            >
              Unsure
            </button>
          ) : null}
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
                laborum.Nulla Lorem mollit cupidatat irure. Laborum magna nulla
                duis ullamco cillum dolor. Voluptate exercitation incididunt
                aliquip deserunt reprehenderit elit laborum. Nulla Lorem mollit
                cupidatat irure. Laborum magna nulla duis ullamco cillum dolor.
                Voluptate
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
            Name of documents
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
        {info.map(() => {
          return (
            <div
              style={{
                display: "flex",
                background: "#292C33",
                borderRadius: "12px",
                padding: "5px",
                paddingLeft: "20px",
                paddingRight: "20px",
                margin: "10px 0",
              }}
              className="flex-row justify-between"
            >
              <div>Docname</div>
              <div style={{ color: "#5375FE" }}>View Documents</div>
            </div>
          );
        })}
      </div>
      <div className="w-1/2">
        <div style={{ margin: "10px 0", marginTop: "40px", fontSize: 19 }}>
          KYB Details
        </div>
        {info.map(() => {
          return (
            <div
              style={{
                display: "flex",
                background: "#292C33",
                borderRadius: "12px",
                padding: "5px",
                paddingLeft: "20px",
                paddingRight: "20px",
                margin: "10px 0",
              }}
              className="flex-row justify-between"
            >
              <div>Docname</div>
              <div style={{ color: "#5375FE" }}>View Documents</div>
            </div>
          );
        })}
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
