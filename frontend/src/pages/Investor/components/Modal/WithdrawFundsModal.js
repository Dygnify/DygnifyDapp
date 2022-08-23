import React, { useState } from "react";
import GradientBtnForModal from "../../../../tools/Button/GradientBtnForModal";
import {
  withdrawAllJunior,
  withdrawSeniorPoolInvestment,
} from "../../../../components/transaction/TransactionHelper";

const WithdrawFundsModal = ({ userWalletBal, handleForm, data }) => {
  const [amount, setAmount] = useState("");

  async function withdrawJunior() {
    await withdrawAllJunior(data.opportunityPoolAddress);
    handleForm();
  }

  async function withdrawSeniorPool() {
    await withdrawSeniorPoolInvestment(amount);
    handleForm();
  }
  return (
    <>
      <input type="checkbox" id="WithdrawModal" className="modal-toggle" />
      <div
        style={{ backdropFilter: "brightness(40%) blur(8px)" }}
        className="modal"
      >
        <div
          style={{ backgroundColor: "#20232A", borderRadius: "16px" }}
          className="modal-box w-1/3 max-w-5xl p-0"
        >
          <label
            for="WithdrawModal"
            className="btn btn-ghost absolute right-2 top-2 pb-2"
          >
            ✕
          </label>
          <h3
            style={{ borderBottom: "2px solid #292C33" }}
            className="font-bold text-lg py-3 px-4"
          >
            Withdraw Funds
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
            className="mx-4 mb-3 py-4 px-4 text-base"
          >
            <div
              style={{ display: "flex" }}
              className="flex-row justify-between"
            >
              <p style={{ display: "flex" }}>Total Balance</p>
              <p style={{ display: "flex" }}>{userWalletBal}</p>
            </div>
          </div>
          <div
            className="text-sm py-3 px-5 flex-col"
            style={{ display: "flex" }}
          >
            <div
              style={{ display: "flex" }}
              className="flex-row mb-1 justify-between"
            >
              <p style={{ display: "flex" }}>Pool Name</p>
              <p style={{ display: "flex" }}>{data?.poolName}</p>
            </div>

            <div
              style={{ display: "flex" }}
              className="flex-row mb-1 justify-between"
            >
              <p style={{ display: "flex" }}>Amount Invested</p>
              <p style={{ display: "flex" }}>{data?.capitalInvested}</p>
            </div>

            <div
              style={{ display: "flex" }}
              className="mb-1 flex-row justify-between"
            >
              <p style={{ display: "flex" }}>Estimated APY</p>
              <p style={{ display: "flex" }}>{data?.estimatedAPY}</p>
            </div>
            <div
              style={{ display: "flex" }}
              className="mb-0 flex-row justify-between"
            >
              <p style={{ display: "flex" }}>Available for withdrawal</p>
              <p style={{ display: "flex" }}>{data?.withdrawableAmt}</p>
            </div>
          </div>

          <div
            class="flex justify-center"
            style={{ display: "flex", marginTop: -6 }}
          >
            <div class="mb-3 w-full relative">
              <label
                for="exampleNumber0"
                class="form-label inline-block mb-0  text-white rounded-box"
                style={{ fontSize: 14 }}
              >
                Enter Amount
              </label>
              <input
                type="number"
                style={{
                  appearance: "textfield",
                }}
                class="
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
            <GradientBtnForModal
              className="w-full"
              disable={true}
              onClick={() => {
                if (data) {
                }
                data.isSeniorPool ? withdrawSeniorPool() : withdrawJunior();
              }}
            >
              Withdraw Funds
            </GradientBtnForModal>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawFundsModal;
