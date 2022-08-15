import React, { useState, useEffect } from "react";
import GradientButton from "../../tools/Button/GradientButton";
import WithdrawCard from "./components/Cards/WithdrawCard";
import {
  getAllWithdrawableOpportunities,
  getUserSeniorPoolInvestment,
  getWalletBal,
} from "../../components/transaction/TransactionHelper";
import { useNavigate } from "react-router-dom";
import WithdrawFundsModal from "./components/Modal/WithdrawFundsModal";

const Withdraw = () => {
  const [seniorPool, setSeniorPool] = useState([{ poolSize: "$450,000" }]);
  const [juniorPools, setJuniorPools] = useState([]);
  const [selected, setSelected] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   try {
  //     const fetchData = async () => {
  //       const data = await getUserSeniorPoolInvestment();
  //       if (data) {
  //         let seniorInvestmentData = {};
  //         seniorInvestmentData.capitalInvested =
  //           data.stakingAmt + data.withdrawableAmt;
  //         seniorInvestmentData.opportunityAmount = await getWalletBal(
  //           process.env.REACT_APP_SENIORPOOL
  //         );
  //         seniorInvestmentData.withdrawableAmt = data.withdrawableAmt;
  //         setSeniorPool(seniorInvestmentData);
  //       }
  //     };
  //     fetchData();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  // useEffect(() => {
  //   try {
  //     const fetchData = async () => {
  //       const opportunities = await getAllWithdrawableOpportunities();
  //       setJuniorPools(opportunities);
  //     };
  //     fetchData();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  return (
    <>
      {selected ? <WithdrawFundsModal /> : <></>}
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
          <label
            style={{
              borderRadius: "100px",
              padding: "12px 15px",
              color: "white",
              marginRight: 8,
            }}
            className={`btn btn-wide bg-gradient-to-r from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize font-medium border-none`}
            onClick={() => navigate("/investor-dashboardN/invest")}
          >
            +Invest
          </label>
        </div>
      </div>
      {seniorPool.capitalInvested > 0 ? (
        <div className="mb-16 ">
          <h2 style={{ fontSize: 24 }} className=" mb-5">
            Senior pools
          </h2>
          <div style={{ display: "flex" }} className="gap-4 w-1/2">
            <WithdrawCard data={seniorPool} setSelected={setSelected} />
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
