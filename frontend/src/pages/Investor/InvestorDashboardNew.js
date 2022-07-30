import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { PieChart } from "recharts";
import BorrowChart from "../../components/charts/BorrowChart";
import Header from "../../investor/components/Header";
import PieGraph from "../../investor/components/PieChart";
import GradientButton from "../../tools/Button/GradientButton";
import PoolCard from "./components/Cards/PoolCard";
import PieChartNew from "./components/PieChartNew";

const InvestorDashboardNew = () => {
  return (
    <div style={{ backgroundColor: "#14171F" }}>
      <Header />
      <div className="drawer drawer-mobile">
        <input
          id="dashboard-sidebar"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="mt-6 drawer-content text-white">
          <div className="px-5">
            <div
              style={{ display: "flex" }}
              className="items-center justify-between mb-14 "
            >
              <h2
                className="text-left first-line:text-3xl font-bold text-white"
                style={{ fontSize: 28 }}
              >
                Investor Dashboard
              </h2>
              <GradientButton className={"w-40"}>+ Invest</GradientButton>
            </div>
            <Outlet></Outlet>
          </div>
          <div className="flex-row items-center" style={{ display: "flex" }}>
            <div
              className="flex-row rounded-box justify-around bg-[#191D23]  ml-5"
              style={{ display: "flex", height: 278, width: 515 }}
            >
              <div
                style={{ display: "flex", marginLeft: -80, marginTop: -10 }}
                className="justify-start"
              >
                <PieGraph />
              </div>
              <div
                style={{ display: "flex", color: "red", marginLeft: -200 }}
                className="flex-col justify-center"
              >
                <div
                  style={{ fontSize: 14, fontWeight: 400, color: "#777E91" }}
                >
                  Total Amount Invested
                </div>
                <div style={{ fontSize: 28, color: "white" }} className="mb-10">
                  345K USDC
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 400, color: "#777E91" }}
                >
                  Total Yield Earned
                </div>
                <div style={{ fontSize: 28, color: "white" }}>35K USDC</div>
              </div>
            </div>
            <div
              className="justify-center items-center rounded-box bg-[#191D23] w-50 ml-5 mr-5"
              style={{ display: "flex", height: 278, width: 515 }}
            >
              <BorrowChart />
            </div>
          </div>
          <div style={{ fontSize: 23 }} className="mt-5 mb-0 ml-5">
            Your Investments
          </div>
          <div style={{ fontSize: 28 }} className=" mb-5 ml-5">
            Senior Pool
          </div>
          <div style={{ display: "flex" }} className="flex-row justify-around">
            <PoolCard />
            <PoolCard />
          </div>
        </div>

        <div
          style={{ borderRight: "1px solid #20232A" }}
          className="drawer-side"
        >
          <label htmlFor="dashboard-sidebar" className="drawer-overlay"></label>
          <ul className="menu p-4 overflow-y-auto w-60  text-white">
            <li>
              <Link to="/borrower_dashboard">Overview</Link>
            </li>
            <li>
              <Link to="/borrower_dashboard/borrow_list">Invest</Link>
            </li>
            <li>
              <Link to="/borrower_dashboard">Withdraw</Link>
            </li>
            <li>
              <Link to="/borrower_dashboard">Transaction</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboardNew;
