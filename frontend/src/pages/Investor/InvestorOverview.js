import { useState, useEffect } from "react";
import PoolCard from "./components/Cards/PoolCard";
import GradientButton from "../../tools/Button/GradientButton";
import {
  getAllWithdrawableOpportunities,
  getUserSeniorPoolInvestment,
  getWalletBal,
  getSeniorPoolDisplaySharePrice,
  getTotalInvestmentOfInvestor,
  getTotalYieldOfInvestor,
  getJuniorWithdrawableOp,
} from "../../components/transaction/TransactionHelper";
import { useNavigate } from "react-router-dom";
import DoughnutChart from "../Components/DoughnutChart";
import LineChart from "./components/LineChart";
import { retrieveFiles } from "../../services/web3storageIPFS";
import { getBinaryFileData } from "../../services/fileHelper";
import { getDisplayAmount } from "../../services/displayTextHelper";

const InvestorOverview = () => {
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalYield, setTotalYield] = useState(0);
  const [seniorPool, setSeniorPool] = useState();
  const [juniorPool, setJuniorPool] = useState([]);
  const [seniorPoolInvestment, setSeniorPoolInvestment] = useState();

  const path = useNavigate();

  async function updateSummery() {
    let amount = await getTotalInvestmentOfInvestor();
    setTotalInvestment(amount);
    let yieldEarned = await getTotalYieldOfInvestor();
    setTotalYield(yieldEarned);
  }

  useEffect(() => {
    getUserSeniorPoolInvestment()
      .then((data) => {
        setSeniorPoolInvestment(data);
      })
      .catch((error) => console.log("Failed to get senior pool investment"));
  }, []);

  useEffect(() => {
    if (seniorPoolInvestment) {
      // fetch data from IPFS
      retrieveFiles(process.env.REACT_APP_SENIORPOOL_CID, true).then((res) => {
        if (res) {
          let read = getBinaryFileData(res);
          read.onloadend = async function () {
            try {
              let spJson = JSON.parse(read.result);
              if (spJson) {
                let seniorInvestmentData = {};
                seniorInvestmentData.poolName = spJson.poolName;
                seniorInvestmentData.opportunityAmount = getDisplayAmount(
                  await getWalletBal(process.env.REACT_APP_SENIORPOOL)
                );

                let totalInvestment =
                  seniorPoolInvestment.stakingAmt +
                  seniorPoolInvestment.withdrawableAmt;
                seniorInvestmentData.capitalInvested =
                  getDisplayAmount(totalInvestment);
                const { sharePrice, displaySharePrice } =
                  await getSeniorPoolDisplaySharePrice(spJson.estimatedAPY);
                seniorInvestmentData.estimatedAPY = displaySharePrice;
                seniorInvestmentData.yieldGenerated = getDisplayAmount(
                  parseFloat((totalInvestment * sharePrice) / 100)
                );
                setSeniorPool(seniorInvestmentData);
              }
            } catch (error) {
              console.log(error);
            }
          };
        }
      });
    }
  }, [seniorPoolInvestment]);

  useEffect(async () => {
    await updateSummery();
    const junorPools = await getJuniorWithdrawableOp();
    setJuniorPool(junorPools);
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

      <div
        className="flex-row items-center w-full gap-2"
        style={{ display: "flex" }}
      >
        <div
          className="flex-row rounded-box justify-between items-center bg-[#191D23] w-1/2 "
          style={{
            display: "flex",
            padding: "32px 46px",
            height: 278,
          }}
        >
          <div
            style={{ display: "flex", marginRight: 60 }}
            className="justify-start"
          >
            {totalInvestment || totalYield ? (
              <DoughnutChart
                data={[totalInvestment, totalYield ? totalYield : 0]}
                color={["#5375FE", "#ffffff"]}
                width={200}
                labels={["Total Outstanding", "Total Repaid"]}
                borderWidth={[1, 8]}
                legendStyle={{ display: false }}
              />
            ) : (
              <DoughnutChart
                data={[1]}
                color={["#64748B"]}
                width={200}
                labels={["Total Outstanding", "Total Repaid"]}
                borderWidth={[1, 8]}
                legendStyle={{ display: false }}
              />
            )}
          </div>
          {/* Change this total implementation */}

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
          className="justify-center items-center rounded-box bg-[#191D23] w-1/2  "
          style={{
            display: "flex",
            padding: "15px 10px",
            paddingLeft: 30,
            height: 278,
          }}
        >
          <LineChart />
        </div>
      </div>
      <div style={{ fontSize: 23 }} className="mt-5 mb-3">
        Your Investments
      </div>
      <h2 style={{ fontSize: 24 }} className=" mb-5">
        Senior Pool
      </h2>
      {seniorPool ? (
        <div className="mb-16 w-1/2 ">
          <div style={{ display: "flex" }} className="gap-4">
            <PoolCard data={seniorPool} />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex" }} className="justify-center">
          <div style={{ color: "#64748B", fontSize: 18, margin: "50px 0" }}>
            No senior pool investments stats available. Explore opportunities
            here.
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 24 }} className=" mb-5">
        Junior Pool
      </h2>
      {juniorPool.length === 0 ? (
        <div style={{ display: "flex" }} className="justify-center">
          <div style={{ color: "#64748B", fontSize: 18, margin: "50px 0 " }}>
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
