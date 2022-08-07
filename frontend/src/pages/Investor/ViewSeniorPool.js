import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GradientButton from "../../tools/Button/GradientButton";
import DueDateCard from "../Investor/components/Cards/DueDateCard";

const ViewSeniorPool = () => {
  const location = useLocation();
  const defaultPoolName = "Senior Pool";
  const defaultAPY = "10";
  const defaultPoolAmount = 0;
  const [dueList, setDueList] = useState([]);
  const [poolName, setPoolName] = useState(defaultPoolName);
  const [poolDescription, setPoolDescription] = useState();
  const [estimatedAPY, setEstimatedAPY] = useState(defaultAPY);
  const [poolAmount, setPoolAmount] = useState(defaultPoolAmount);

  useEffect(() => {
    fetch("/dueList.json")
      .then((res) => res.json())
      .then((data) => setDueList(data));
  }, [dueList]);

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
        location.state.loanAmount
          ? location.state.loanAmount
          : defaultPoolAmount
      );
    }
  }, [poolName, estimatedAPY, poolAmount]);

  return (
    <>
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
    </>
  );
};

export default ViewSeniorPool;
