import React, { useState, useEffect } from "react";
import GradientButton from "../../tools/Button/GradientButton";
import WithdrawCard from "./components/Cards/WithdrawCard";
import {
  getAllWithdrawableOpportunities,
  getUserSeniorPoolInvestment,
  getWalletBal,
} from "../../components/transaction/TransactionHelper";

const Withdraw = () => {
  const [seniorPool, setSeniorPool] = useState([]);
  const [juniorPools, setJuniorPools] = useState([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const data = await getUserSeniorPoolInvestment();
        if (data) {
          let seniorInvestmentData = {};
          seniorInvestmentData.capitalInvested =
            data.stakingAmt + data.withdrawableAmt;
          seniorInvestmentData.opportunityAmount = await getWalletBal(
            process.env.REACT_APP_SENIORPOOL
          );
          seniorInvestmentData.withdrawableAmt = data.withdrawableAmt;
          setSeniorPool(seniorInvestmentData);
        }
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const opportunities = await getAllWithdrawableOpportunities();
        setJuniorPools(opportunities);
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
            Withdraw
          </h2>
          <GradientButton className={"w-40"}>+ Invest</GradientButton>
        </div>
      </div>
      {seniorPool.capitalInvested > 0 ? (
        <div className="mb-16 ">
          <h2 style={{ fontSize: 24 }} className=" mb-5">
            Senior pools
          </h2>
          <div style={{ display: "flex" }} className="gap-4 w-1/2">
            <WithdrawCard data={seniorPool} />
          </div>
        </div>
      ) : (
        ""
      )}

      {juniorPools.length === 0 ? (
        <div style={{ display: "flex" }} className="justify-center">
          <div style={{ color: "#64748B", fontSize: 18, marginTop: 10 }}>
            No stats are available. Explore opportunities here.
          </div>
        </div>
      ) : (
        <div className="mb-16">
          <h2 className="text-xl mb-5" style={{ fontSize: 24 }}>
            Junior pools
          </h2>
          <div style={{ display: "flex" }} className=" gap-4">
            {juniorPools.map((item) => (
              <WithdrawCard data={item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Withdraw;
<h2>Invest</h2>;
