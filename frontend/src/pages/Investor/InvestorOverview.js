import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import DrawdownCard from "../../tools/Card/DrawdownCard";
import RepaymentCard from "../../tools/Card/RepaymentCard";
import PoolCard from "./components/Cards/PoolCard";
import PieGraph from "../../investor/components/PieChart";
import GradientButton from "../../tools/Button/GradientButton";
import BorrowChart from "../../components/charts/BorrowChart";
import { getAllWithdrawableOpportunities } from "../../components/transaction/TransactionHelper";
import { useNavigate } from "react-router-dom";
import DoughnutChart from "../Components/DoughnutChart";

const InvestorOverview = () => {
  const [data, setData] = useState([]);
  const [repayment, setRepayment] = useState([]);
  const [poolDetail, setPoolDetail] = useState([]);

  const path = useNavigate();

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

  useEffect(() => {
    try {
      const fetchData = async () => {
        const opportunities = await getAllWithdrawableOpportunities();
        setPoolDetail(opportunities);
        //setPoolDetail([{ hello: "1" }]);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="px-5">
        <div
          style={{ display: "flex" }}
          className="items-center justify-between mb-14 "
        >
          <h2
            className="text-left font-bold text-white"
            style={{ fontSize: 28, marginLeft: -20 }}
          >
            Investor Dashboard
          </h2>
          <GradientButton
            onClick={() => path("/investor-dashboardN/invest")}
            className={"w-40"}
          >
            + Invest
          </GradientButton>
        </div>
      </div>

      <div className="flex-row items-center" style={{ display: "flex" }}>
        <div
          className="flex-row rounded-box justify-between items-center bg-[#191D23]  "
          style={{
            display: "flex",
            height: 278,
            width: 584,
            paddingLeft: 46,
            paddingRight: 46,
          }}
        >
          <div
            style={{ display: "flex", marginRight: 60 }}
            className="justify-start"
          >
            <DoughnutChart
              data={[80, 20]}
              color={["#5375FE", "#F790F9"]}
              labels={["Amount invested", "Yield earned"]}
              legendStyle={{ display: false }}
            />
          </div>
          {/* Change this total implementation */}

          <div style={{ position: "absolute", marginLeft: 62 }}>
            <div style={{ color: "#A0ABBB" }}>Total Value</div>
            <div>380K USDC</div>
          </div>

          <div
            style={{ display: "flex", color: "red" }}
            className="flex-col justify-center"
          >
            <div style={{ fontSize: 14, fontWeight: 400, color: "#777E91" }}>
              Total Amount Invested
            </div>
            <div style={{ fontSize: 28, color: "white" }} className="mb-10">
              {poolDetail.length === 0 ? "- -" : "345K USDC"}
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#777E91" }}>
              Total Yield Earned
            </div>

            <div style={{ fontSize: 28, color: "white" }}>
              {poolDetail.length === 0 ? "- -" : "34K USDC"}
            </div>
          </div>
        </div>
        <div
          className="justify-center items-center rounded-box bg-[#191D23] w-50 ml-5 "
          style={{ display: "flex", height: 278, width: 584 }}
        >
          <BorrowChart />
        </div>
      </div>
      <div style={{ fontSize: 23 }} className="mt-5 mb-3">
        Your Investments
      </div>
      {poolDetail.length === 0 ? (
        <div style={{ display: "flex" }} className="justify-center">
          <div style={{ color: "#64748B", fontSize: 18, marginTop: 10 }}>
            No investments stats available. Explore opportunities here.
          </div>
        </div>
      ) : (
        <>
          <div className="mb-16 w-1/2 ">
            <h2 style={{ fontSize: 24 }} className=" mb-5">
              Senior Pool
            </h2>
            <div style={{ display: "flex" }} className="gap-4">
              {repayment.map((item) => (
                <PoolCard />
              ))}
            </div>
          </div>
          <div className="mb-16">
            <h2 className="text-xl mb-5" style={{ fontSize: 24 }}>
              Junior Pool
            </h2>
            <div style={{ display: "flex" }} className=" gap-4">
              {data.map((item) => (
                <PoolCard />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InvestorOverview;
<h2>InvestorOverview</h2>;
