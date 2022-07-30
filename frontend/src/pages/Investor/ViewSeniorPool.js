import React, { useState, useEffect } from "react";
import GradientButton from "../../tools/Button/GradientButton";
import DueDateCard from "../Investor/components/Cards/DueDateCard";

const ViewSeniorPool = () => {
  const OP = {
    estimatedAPY: "24%",
  };

  const [dueList, setDueList] = useState([]);

  const info = [
    {
      label: "Interest Rate",
      value: "10.00%",
    },
    { label: "Payment Tenure", value: "4 Years" },
    { label: "Drawdown Cap", value: "$100,000" },
  ];

  useEffect(() => {
    fetch("/dueList.json")
      .then((res) => res.json())
      .then((data) => setDueList(data));
  }, [dueList]);

  return (
    <div>
      <div style={{ fontSize: 28 }} className="mb-0">
        Senior Pool
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
              View details
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
              <h2 style={{ fontSize: 28 }}>24%</h2>
            </div>
            <div
              style={{ display: "flex" }}
              className="flex-row justify-between pb-2"
            >
              <h2 style={{ fontSize: 19 }}>Total Pool Balance</h2>
              <h2 style={{ fontSize: 28 }}>$10,000,000</h2>
            </div>

            <GradientButton className={"w-full mt-20"}>Invest</GradientButton>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "50px", fontSize: 19, marginBottom: "20px" }}>
        Recent Activity
      </div>

      <div>
        {dueList.map((item) => (
          <DueDateCard key={dueList.id} data={item} />
        ))}
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default ViewSeniorPool;
