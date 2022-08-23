import { React, useState, useEffect } from "react";
import GradientButton from "../../../../tools/Button/GradientButton";
import {
  investInSeniorPool,
  investInJuniorPool,
  getWalletBal,
} from "../../../../components/transaction/TransactionHelper";

const InvestModal = ({
  isSenior,
  poolAddress,
  poolName,
  poolLimit,
  estimatedAPY,
  setProcessFundModal,
  setInvestProcessing,
  setSelected,
}) => {
  const [amount, setAmount] = useState("");
  const [walletBal, setWalletBal] = useState();

  useEffect(() => {
    getWalletBal().then((data) => setWalletBal(data));
  }, []);

  async function investSenior() {
    setProcessFundModal(true);
    setInvestProcessing(true);
    await investInSeniorPool(amount);
    setSelected(null);
    setInvestProcessing(false);
    console.log("done");
  }

  async function investJunior() {
    setProcessFundModal(true);
    setInvestProcessing(true);

    await investInJuniorPool(poolAddress, amount);
    setSelected(null);
    setInvestProcessing(false);
  }

  return (
    <>
      <input type="checkbox" id="InvestModal" className="modal-toggle" />
      <div
        style={{ backdropFilter: "brightness(40%) blur(8px)" }}
        className="modal"
      >
        <div
          style={{ backgroundColor: "#20232A", borderRadius: "16px" }}
          className="modal-box w-1/3 max-w-5xl p-0 "
        >
          <label
            for="InvestModal"
            className="btn btn-ghost absolute right-2 top-2 pb-2"
            // onClick={() => handleDrawdown()}
          >
            ✕
          </label>
          <h3
            style={{ borderBottom: "2px solid #292C33" }}
            className="font-bold text-lg py-3 px-4"
          >
            Invest
          </h3>
          <div style={{ display: "flex" }} className="justify-center my-6">
            <img
              style={{ borderRadius: "50%" }}
              className="p-4 bg-[#9281FF] opacity-80"
              src="/images/wallet_white.png"
              alt=""
            />
          </div>
          <div
            style={{
              backgroundColor: "#292C33",
              borderRadius: "4px",
            }}
            className="mx-4 mb-3 py-4 px-4 text-base "
          >
            <div
              style={{ display: "flex" }}
              className="flex-row justify-between"
            >
              <p style={{ display: "flex" }}>Total Balance</p>
              <p style={{ display: "flex" }}>
                ${walletBal ? walletBal : 0} {process.env.REACT_APP_TOKEN_NAME}
              </p>
            </div>
          </div>
          <div
            className="flex-col text-sm py-3 px-5 w-full"
            style={{ display: "flex" }}
          >
            <div
              style={{ display: "flex" }}
              className="flex-row mb-2 justify-between"
            >
              <p style={{ display: "flex" }}>Pool Name</p>
              <p style={{ display: "flex" }}>{poolName}</p>
            </div>
            {poolLimit ? (
              <div
                style={{ display: "flex" }}
                className="flex-row mb-2 justify-between"
              >
                <p style={{ display: "flex" }}>Pool Limit</p>
                <p style={{ display: "flex" }}>{poolLimit}</p>
              </div>
            ) : (
              <></>
            )}

            <div
              style={{ display: "flex" }}
              className="flex-row mb-0 justify-between"
            >
              <p style={{ display: "flex" }}>Estimated APY</p>
              <p style={{ display: "flex" }}>{estimatedAPY}</p>
            </div>
          </div>

          <div
            class="flex justify-center"
            style={{ display: "flex", marginTop: -6 }}
          >
            <div class="mb-3 w-full relative">
              <label
                for="exampleNumber0"
                className="form-label inline-block mb-0 mt-5  text-white rounded-box"
                style={{ fontSize: 14 }}
              >
                Enter Amount
              </label>
              <input
                type="number"
                style={{ appearance: "textfield" }}
                className="
        form-control
        block
        w-full
        h-57
        pl-3
        pr-[3.5rem]
        py-3
        text-base
        font-normal
        text-white
        bg-[#24272F] bg-clip-padding
        border border-solid border-[#3A3C43] 
        rounded
        transition
        ease-in-out
        m-0
        placeholder:font-medium
        focus:text-white focus:bg-base-100 focus:border-base-300 focus:outline-none
      "
                id="exampleNumber0"
                placeholder="0.0"
                onChange={(event) => setAmount(event.target.value)}
              />
              <span className="text-[#64748B] font-medium absolute bottom-3 right-2 select-none">
                {process.env.REACT_APP_TOKEN_NAME}
              </span>
            </div>
          </div>

          <div
            className="modal-action mx-4 mt-2 mb-4 justify-center"
            style={{ display: "flex" }}
          >
            <label
              htmlFor="InvestProcessModal"
              style={{
                borderRadius: "100px",
                padding: "12px 24px",
                color: "white",
              }}
              className={`btn w-full bg-gradient-to-r from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize font-medium border-none`}
              onClick={() => (isSenior ? investSenior() : investJunior())} //if condition not true then investJunior will execute
            >
              Invest
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestModal;
