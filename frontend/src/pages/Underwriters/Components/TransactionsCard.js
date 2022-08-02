import React from "react";

const TransactionsCard = ({ data }) => {
  return (
    <div
      style={{ backgroundColor: "#20232A", borderRadius: "12px" }}
      className=" mb-2"
    >
      <div
        style={{ display: "flex" }}
        className="collapse-title text-md font-light justify-around w-full"
      >
        <p className="w-1/6 text-center">{data?.pool_name}</p>
        <p className="w-1/6 text-center">{data?.companyName}</p>
        <p className="w-1/6 text-center">{data?.createdOn}</p>

        {data?.status === "Completed" && (
          <p className="w-1/6 text-center">
            <button
              style={{
                borderRadius: "35px",
                padding: "5px 8px",
                background:
                  "linear-gradient(97.78deg, #51B960 7.43%, #51B960 7.43%, #51B960 7.43%, #83DC90 90.63%)",
                border: "none",
              }}
              className="btn btn-xs btn-success"
            >
              Approved
            </button>
          </p>
        )}
        {data?.status === "Not Completed" && (
          <p className="w-1/6 text-center">
            <button
              style={{
                borderRadius: "35px",
                padding: "5px 8px",
                background:
                  "linear-gradient(97.67deg, #E73838 1.07%, #FFBABA 100%)",
                border: "none",
              }}
              className="btn btn-xs btn-error"
            >
              Rejected
            </button>
          </p>
        )}
        {data?.status === "Processing" && (
          <p className="w-1/6 text-center">
            <button
              style={{
                borderRadius: "35px",
                padding: "5px 8px",
                background:
                  "linear-gradient(276.08deg, rgba(255, 255, 255, 0.04) 2.02%, rgba(255, 255, 255, 0.4) 2.03%, #FFFFFF 99.33%)",
                border: "none",
              }}
              className="btn btn-xs btn-warning"
            >
              Unsure
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionsCard;
