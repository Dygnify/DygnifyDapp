import React, { useEffect, useState } from "react";
import {
  getDrawdownOpportunities,
  getOpportunitysOf,
} from "../../components/transaction/TransactionHelper";
import DrawdownCard from "../../tools/Card/DrawdownCard";
import OpportunityCardCollapsible from "../../tools/Card/OpportunityCardCollapsible";
import DashboardHeader from "./DashboardHeader";

const BorrowList = () => {
  const [data, setData] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let op = await getDrawdownOpportunities();
      if (op && op.length) {
        setData(op);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        let opportunityList = await getOpportunitysOf();
        setOpportunities(opportunityList);
        console.log(opportunityList);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <DashboardHeader />
      <div className="mb-16">
        <h2 className="mb-2 text-xl">Drawdown Funds</h2>
        <div style={{ display: "flex" }} className=" gap-4">
          {data.map((item) => (
            <DrawdownCard key={data?.id} data={item} />
          ))}
        </div>
      </div>
      <div className="mb-16">
        <h2 className="mb-2 text-xl">Borrow Request</h2>
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
            <p className="w-1/4 text-center">Pool name</p>
            <p className="w-1/4 text-center">Capital requested</p>
            <p className="w-1/4 text-center">Created on</p>
            <p className="w-1/4 text-center">Status</p>
          </div>
        </div>
        <div>
          {opportunities
            ? opportunities.map((item) => (
                <OpportunityCardCollapsible
                  key={opportunities.id}
                  data={item}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default BorrowList;
