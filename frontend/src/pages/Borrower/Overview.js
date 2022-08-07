import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import PieGraph from "../../investor/components/PieChart";
import DrawdownCard from "../../tools/Card/DrawdownCard";
import DueDateCard from "../../tools/Card/DueDateCard";
import RepaymentCard from "../../tools/Card/RepaymentCard";
import LoanFormModal from "../../tools/Modal/LoanFormModal";
import OverviewPoolCardCollapsible from "./Components/OverviewPoolCardCollapsible";
import DashboardHeader from "./DashboardHeader";
import DoughnutChart from "../Components/DoughnutChart";
import KYBModal from "./Components/Modal/KYB/KYBModal";

const Overview = () => {
  const [data, setData] = useState([]);
  const [repayment, setRepayment] = useState([]);
  const [dueList, setDueList] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleForm = () => {
    setSelected(null);
  };

  useEffect(() => {
    fetch("/drawdown.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [data]);

  useEffect(() => {
    fetch("/repayment.json")
      .then((res) => res.json())
      .then((data) => setRepayment(data));
  }, [repayment]);

  useEffect(() => {
    fetch("/dueList.json")
      .then((res) => res.json())
      .then((data) => setDueList(data));
  }, [dueList]);

  return (
    <div>
      <DashboardHeader setSelected={setSelected}></DashboardHeader>
      {selected && (
        <LoanFormModal
          key={data?.id}
          data={data}
          handleForm={handleForm}
        ></LoanFormModal>
      )}
      <div style={{ display: "flex" }} className="w-full my-10">
        <div
          style={{
            backgroundColor: "#191D23",
            boxShadow: "4px 4px 10px -32px rgba(0, 0, 0, 0.1)",
            borderRadius: "16px",
            display: "flex",
          }}
          className="w-1/4 mr-4 px-4 py-4 justify-center flex-col"
        >
          <h1 className="font-semibold text-5xl text-green-400">$850K</h1>
          <p className="text-xl">Total Amount Borrowed</p>
        </div>
        <div
          style={{
            backgroundColor: "#191D23",
            //boxShadow: "4px 4px 10px -32px rgba(0, 0, 0, 0.1)",
            borderRadius: "16px",
            padding: 50,
            height: 300,
            display: "flex",
          }}
          className="flex-col w-1/2 items-center justify-center"
        >
          <div>
            <DoughnutChart
              data={[92, 8]}
              color={["#5375FE", "#ffffff"]}
              width={400}
              labels={[
                "Elevation Capital 300USDC",
                "Elevation Capital 300USDC",
              ]}
              borderWidth={[1, 8]}
              legendStyle={{
                display: true,
                position: "left",
                labels: { usePointStyle: true, padding: 15, color: "white" },
              }}
            />
          </div>
        </div>
        <div
          style={{ boxShadow: "4px 4px 10px -32px rgba(0, 0, 0, 0.1)" }}
          className="w-1/4 ml-4 "
        >
          <div
            style={{ backgroundColor: "#191D23", borderRadius: "16px" }}
            className="mb-4 px-4 py-4"
          >
            <h3 className="font-semibold text-3xl text-purple-100">$400K</h3>
            <p className="text-base font-semibold text-gray-500">
              Next Due Amount
            </p>
          </div>
          <div
            style={{ backgroundColor: "#191D23", borderRadius: "16px" }}
            className="px-4 py-4"
          >
            <h3 className="font-semibold text-3xl text-purple-100">
              28 July 2022
            </h3>
            <p className="text-base font-semibold text-gray-500">
              Next Due Date
            </p>
          </div>
        </div>
      </div>
      <div className="mb-16 text-xl">
        <h2 className="mb-2">Repayment Notification</h2>
        <div style={{ display: "flex" }} className="gap-4">
          {repayment.map((item) => (
            <RepaymentCard key={data.id} data={item} />
          ))}
        </div>
      </div>
      <div className="mb-16">
        <h2 className="mb-2 text-xl">Drawdown Funds</h2>
        <div style={{ display: "flex" }} className=" gap-4">
          {data.map((item) => (
            <DrawdownCard key={data.id} data={item} />
          ))}
        </div>
      </div>
      <div className="mb-16">
        <h2 className="mb-2 text-xl">Upcoming Due Dates</h2>
        <div className="collapse mb-3">
          <input type="checkbox" className="peer" />
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #20232A",
              borderBottom: "1px solid #20232A",
            }}
            className="collapse-title text-md font-light justify-around w-full"
          >
            <p className="w-1/4 text-center">Pool Name</p>
            <p className="w-1/4 text-center">Capital Borrowed</p>
            <p className="w-1/4 text-center">Amount Due</p>
            <p className="w-1/4 text-center">Due Date</p>
          </div>
        </div>
        <div>
          {dueList.map((item) => (
            <DueDateCard key={dueList.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
