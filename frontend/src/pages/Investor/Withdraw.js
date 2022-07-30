import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import DrawdownCard from "../../tools/Card/DrawdownCard";
import RepaymentCard from "../../tools/Card/RepaymentCard";
import PoolCard from "./components/Cards/PoolCard";
import PieGraph from "../../investor/components/PieChart";
import GradientButton from "../../tools/Button/GradientButton";
import BorrowChart from "../../components/charts/BorrowChart";
import ViewPoolCard from "./components/Cards/ViewPoolCard";
import WithdrawCard from "./components/Cards/WithdrawCard";

const Withdraw = () => {
  const [data, setData] = useState([]);
  const [repayment, setRepayment] = useState([]);

  useEffect(() => {
    fetch("/drawdown.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  useEffect(() => {
    fetch("/repayment.json")
      .then((res) => res.json())
      .then((data) => setRepayment(data));
  }, []);

  return (
    <div>
      <div className="px-5">
        <div
          style={{ display: "flex" }}
          className="items-center justify-between mb-14 "
        >
          <h2
            className="text-left font-bold text-white"
            style={{ fontSize: 28, marginLeft: -20 }}
          >
            Withdraw
          </h2>
          <GradientButton className={"w-40"}>+ Invest</GradientButton>
        </div>
      </div>

      <div className="mb-16 ">
        <h2 style={{ fontSize: 24 }} className=" mb-5">
          Senior pools
        </h2>
        <div style={{ display: "flex" }} className="gap-4">
          {repayment.map((item) => (
            <WithdrawCard />
          ))}
        </div>
      </div>
      <div className="mb-16">
        <h2 className="text-xl mb-5" style={{ fontSize: 24 }}>
          Junior pools
        </h2>
        <div style={{ display: "flex" }} className=" gap-4">
          {data.map((item) => (
            <WithdrawCard />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
<h2>Invest</h2>;
