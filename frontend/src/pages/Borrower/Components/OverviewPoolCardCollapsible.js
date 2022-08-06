import React from "react";

const OverviewPoolCardCollapsible = ({ data }) => {
  return (
    <div
      style={{ backgroundColor: "#20232A", borderRadius: "12px" }}
      className="collapse collapse-arrow  mb-2"
    >
      <input type="checkbox" className="peer" />
      <div
        style={{ display: "flex" }}
        className="collapse-title text-md font-light justify-around w-full"
      >
        <p className="w-1/4 text-center">{data?.opportunity_name}</p>
        <p className="w-1/4 text-center">
          {data?.loan_amount} {process.env.REACT_APP_TOKEN_NAME}
        </p>
        <p className="w-1/4 text-center">
          {data?.principal_amount + data?.interest_amount}{" "}
          {process.env.REACT_APP_TOKEN_NAME}{" "}
          <sup
            style={{ backgroundColor: "#323A46", borderRadius: "50%" }}
            className="ml-1 tooltip p-2"
            data-tip={`Principle - ${data?.principal_amount} ${process.env.REACT_APP_TOKEN_NAME}, Interest - ${data?.interest_amount} ${process.env.REACT_APP_TOKEN_NAME}`}
          >
            <button>i</button>
          </sup>
        </p>
        <p className="w-1/4 text-center">{data?.repayment_date}</p>
      </div>
      <div className="collapse-content">
        <div
          style={{ display: "flex" }}
          className="justify-around py-10 w-full"
        >
          <div
            style={{ borderRight: "1px solid #292C33", display: "flex" }}
            className="w-1/2 text-center flex-col justify-center items-center"
          >
            <p>Chart</p>
          </div>
          <div
            style={{ borderLeft: "1px solid #292C33", display: "flex" }}
            className="w-1/2 justify-evenly items-center"
          >
            <div style={{ display: "flex" }} className="flex-col">
              <div className="mb-10">
                <p className="font-light text-sm">Interest rate</p>
                <p className="font-medium text-lg">{data?.loan_interest} %</p>
              </div>
              <div>
                <p className="font-light text-sm">Payment frequency</p>
                <p className="font-medium text-lg">
                  {data?.payment_frequency} days
                </p>
              </div>
            </div>
            <div style={{ display: "flex" }} className="flex-col">
              <div className="mb-10">
                <p className="font-light text-sm">Payment tenure</p>
                <p className="font-medium text-lg">
                  {data?.loan_tenure / 30} months
                </p>
              </div>
              <div>
                <p className="font-light text-sm">Contract address</p>
                <p className="font-medium text-lg">0xd45a4sdfcasd</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPoolCardCollapsible;
