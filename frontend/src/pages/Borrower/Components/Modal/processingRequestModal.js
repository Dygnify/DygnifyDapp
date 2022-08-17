import React from "react";
import { useNavigate } from "react-router-dom";

const ProcessingRequestModal = ({
  borrowReqProcess,
  setProcessModal,
  setSelected,
}) => {
  const data = {
    success: false,
  };

  const navigate = useNavigate();
  return (
    <>
      <input type="checkbox" id="ProcessModal" className="modal-toggle" />
      <div
        style={{ backdropFilter: "brightness(40%) blur(8px)" }}
        className="modal"
      >
        <div
          style={{ backgroundColor: "#20232A", borderRadius: "16px" }}
          className="modal-box w-1/3 max-w-5xl p-0"
        >
          <label
            for="ProcessModal"
            className="btn btn-ghost absolute right-2 top-2 pb-2"
            // onClick={() => handleDrawdown()}
          >
            ✕
          </label>
          <h3
            style={{ borderBottom: "2px solid #292C33" }}
            className="font-bold text-lg py-3 px-4"
          >
            Create borrow request
          </h3>
          <p
            style={{ display: "flex", fontSize: 55, fontWeight: 600 }}
            className="justify-center"
          >
            {borrowReqProcess ? `Yay!🎉` : "In Progress⏱"}
          </p>
          <p
            style={{ display: "flex", fontSize: 23, fontWeight: 600 }}
            className="justify-center mb-2"
          >
            {borrowReqProcess
              ? "Borrow request created successfully."
              : "Request is in process"}
          </p>

          <div
            className="modal-action mx-4 mt-2 mb-4 text-sm py-3 px-4 items-center justify-center"
            style={{
              width: 400,
              height: 45,
              marginLeft: 24,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: "#64748B",
              alignSelf: "center",
              marginTop: 60,
            }}
          >
            <p
              className="justify-center"
              style={{ display: "flex", cursor: "pointer" }}
              onClick={() => {
                console.log("kkkkkk");
                // navigate("/borrower_dashboard/");
                setSelected(false);
                setProcessModal(false);
              }}
            >
              Go to dashboard
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessingRequestModal;
