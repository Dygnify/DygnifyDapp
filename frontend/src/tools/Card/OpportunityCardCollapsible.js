import React, {useState} from "react";
import { getBinaryFileData } from "../../services/fileHelper";
import { retrieveFiles } from "../../services/web3storageIPFS";
const OpportunityCardCollapsible = ({ data }) => {

  const [poolName, setPoolName] = useState();

  // fetch the opportunity details from IPFS
  retrieveFiles(data?.opportunityInfo, true).then((res) => {
    if (res) {
      let read = getBinaryFileData(res);
      read.onloadend = function () {
        let opJson = JSON.parse(read.result);
        if (opJson) {
          setPoolName(opJson.loanName);
        }
      };
    }
  });

  function getStatus(index) {
    let status = '';
    switch (index) {
      case '0':
        status = 'UnderReview';
        break;
      case '1':
        status = 'Rejected';
        break;
      case '2':
        status = 'Approved';
        break;
      case '3':
        status = 'Unsure';
        break;
      case '4':
        status = 'Collateralized';
        break;
      case '5':
        status = 'Active';
        break;
      case '6':
        status = 'Drawndown';
        break;
      case '7':
        status = 'Repaid';
        break;
    }

    return status;
  }

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
        <p className="w-1/4 text-center">{poolName}</p>
        <p className="w-1/4 text-center">
          {data?.opportunityAmount} {process.env.REACT_APP_TOKEN_NAME}
        </p>
        <p className="w-1/4 text-center">{data?.createdOn}</p>
        <p className="w-1/4 text-center">{getStatus(data?.status)}</p>
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
                <p className="font-light text-sm">Interest Rate</p>
                <p className="font-medium text-lg">{data?.loanInterest} %</p>
              </div>
              <div>
                <p className="font-light text-sm">Payment Frequency</p>
                <p className="font-medium text-lg">
                  {data?.paymentFrequencyInDays} days
                </p>
              </div>
            </div>
            <div style={{ display: "flex" }} className="flex-col">
              <div className="mb-10">
                <p className="font-light text-sm">Loan Tenure</p>
                <p className="font-medium text-lg">
                  {data?.loanTenureInDays / 30} months
                </p>
              </div>
              <div>
                <p className="font-light text-sm">Loan Type</p>
                <p className="font-medium text-lg">
                  {data?.loanType === 0 ? "Term Loan" : "Bullet Loan"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCardCollapsible;
