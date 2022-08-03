import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ViewPoolCard from "../Investor/components/Cards/ViewPoolCard";
import UnderwriterCard from "./Components/UnderwriterCard";

const BorrowRequest = () => {
  const path = useNavigate();
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
            Underwriter's Dashboard
          </h2>
        </div>
      </div>

      <div className="mb-16 ">
        <div style={{ display: "flex" }} className="gap-4 w-1/2">
          {repayment.map((item) => (
            <UnderwriterCard
              onClick={() => path("/underwriterDashboard/poolDetail")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowRequest;
<h2>Invest</h2>;
