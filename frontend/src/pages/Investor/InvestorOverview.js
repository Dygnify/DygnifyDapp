import { useState, useEffect } from "react";
import PoolCard from "./components/Cards/PoolCard";
import PieGraph from "../../investor/components/PieChart";
import GradientButton from "../../tools/Button/GradientButton";
import BorrowChart from "../../components/charts/BorrowChart";
import {
  getAllWithdrawableOpportunities,
  getUserSeniorPoolInvestment,
  getWalletBal,
} from "../../components/transaction/TransactionHelper";
import { useNavigate } from "react-router-dom";
import DoughnutChart from "../Components/DoughnutChart";

const InvestorOverview = () => {
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalYield, setTotalYield] = useState(0);
  const [seniorPool, setSeniorPool] = useState([]);
  const [juniorPool, setJuniorPool] = useState([]);

  const path = useNavigate();

  function updateSummery(investment, interest) {
    setTotalInvestment((prev) => prev + investment);

    setTotalYield((prev) => prev + investment * interest);
  }

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
          seniorInvestmentData.loanInterest = 10;
          setSeniorPool(seniorInvestmentData);
          updateSummery(
            seniorInvestmentData.capitalInvested,
            seniorInvestmentData.capitalInvested *
              seniorInvestmentData.loanInterest
          );
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
        const junorPools = await getAllWithdrawableOpportunities();
        if (juniorPool && juniorPool.length) {
          setJuniorPool(junorPools);
          let investment = 0;
          let yieldAccumulated = 0;
          juniorPool.forEach((pool) => {
            investment += pool.capitalInvested;
            yieldAccumulated += pool.yieldGenerated;
          });
          updateSummery(investment, yieldAccumulated);
        }
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
              {totalInvestment === 0 ? "- -" : totalInvestment}
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#777E91" }}>
              Total Yield Earned
            </div>

            <div style={{ fontSize: 28, color: "white" }}>
              {totalYield === 0 ? "- -" : totalYield}
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
      <h2 style={{ fontSize: 24 }} className=" mb-5">
        Senior Pool
      </h2>
      {seniorPool.length === 0 ? (
        <div style={{ display: "flex" }} className="justify-center">
          <div style={{ color: "#64748B", fontSize: 18, margin: "20px 0" }}>
            No senior pool investments stats available. Explore opportunities
            here.
          </div>
        </div>
      ) : (
        <div className="mb-16 w-1/2 ">
          <div style={{ display: "flex" }} className="gap-4">
            {seniorPool.map((seniorPoolData) => (
              <PoolCard key={seniorPoolData.id} data={seniorPoolData} />
            ))}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 24 }} className=" mb-5">
        Junior Pool
      </h2>
      {juniorPool.length === 0 ? (
        <div style={{ display: "flex" }} className="justify-center">
          <div style={{ color: "#64748B", fontSize: 18, margin: "20px 0 " }}>
            No junior pool investments stats available. Explore opportunities
            here.
          </div>
        </div>
      ) : (
        <div className="mb-16">
          <div style={{ display: "flex" }} className=" gap-4">
            {juniorPool.map((juniorPoolData) => (
              <PoolCard key={juniorPoolData.id} data={juniorPoolData} />
            ))}
          </div>
        </div>
      )}
      <br />
      <br />
    </>
  );
};

export default InvestorOverview;
<h2>InvestorOverview</h2>;
