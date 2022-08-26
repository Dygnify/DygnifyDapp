import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../uiTools/Button/PrimaryButton";
import {
  getBinaryFileData,
  getDataURLFromFile,
} from "../../../services/fileHelper";
import { retrieveFiles } from "../../../services/web3storageIPFS";

const UnderwriterCard = ({ data }) => {
  const path = useNavigate();
  const [companyName, setCompanyName] = useState();
  const [poolName, setPoolName] = useState();
  const [poolDetails, setPoolDetails] = useState();
  const [logoImgSrc, setLogoImgSrc] = useState();
  useEffect(() => {
    // fetch the opportunity details from IPFS
    retrieveFiles(data?.opportunityInfo, true).then((res) => {
      if (res) {
        let read = getBinaryFileData(res);
        read.onloadend = function () {
          let opJson = JSON.parse(read.result);
          if (opJson) {
            setCompanyName(opJson.companyDetails.companyName); //opJson.companyDetails.companyName //opJson.company_name
            setPoolName(opJson.loan_name);
            setPoolDetails({ ...data, ...opJson });
            getCompanyLogo(
              opJson.companyDetails?.companyLogoFile?.businessLogoFileCID
            );
          }
        };
      }
    });
  }, []);

  async function getCompanyLogo(cid) {
    if (!cid) {
      return;
    }
    try {
      retrieveFiles(cid, true).then((res) => {
        if (res) {
          let read = getDataURLFromFile(res);
          read.onloadend = function () {
            setLogoImgSrc(read.result);
            console.log(read.result);
          };
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{
        background: `linear-gradient(302.85deg, rgba(168, 154, 255, 0) -1.23%, rgba(168, 154, 255, 0.260833) 99.99%, rgba(168, 154, 255, 0.8) 100%`,
        boxShadow: `1px 1px 1px rgba(185, 185, 185, 0.1)`,
      }}
      className=" text-white rounded-2xl grid grid-1  overflow-hidden  pt-7 lg:pt-0 lg:grid-cols-10 xl:pr-2"
    >
      {/* section-1 */}
      <div className="flex-row flex space-x-5 px-4 col-span-4 lg:pl-6 lg:pr-1">
        <img
          src={logoImgSrc}
          className="w-28 h-28 rounded-full lg:w-36 lg:h-36 lg:my-auto"
        />
        <div className="mt-7 lg:hidden">
          <p className="font-medium text-2xl">{poolName}</p>
          <p className="text-xl font-light">{companyName}</p>
        </div>
      </div>
      {/* section-2 */}
      <div className="col-span-6 xl:-ml-4">
        {/* section-2-1  */}
        <div className="mt-5 px-4 lg:pr-5 lg:pl-1">
          <div className="hidden lg:block lg:my-7">
            <p className="font-medium text-2xl">{poolName}</p>
            <p className="text-xl font-light">{companyName}</p>
          </div>
          <div className="flex justify-between space-y-1 font-medium">
            <p>Pool Size</p>
            <p>
              {data.opportunityAmount} {process.env.REACT_APP_TOKEN_NAME}
            </p>
          </div>
          <div className="flex justify-between space-y-1  font-medium ">
            <p>Interest Rate</p>
            <p>{data.loanInterest}</p>
          </div>
          <div className="flex justify-between space-y-1  font-medium ">
            <p>Created On</p>
            <p>{data.createdOn}</p>
          </div>
        </div>
        {/* sectin-2-2  */}
        <div className="grid mt-2 mb-3 mx-1 lg:pt-2 lg:-ml-1">
          <PrimaryButton
            disable={false}
            onClick={() =>
              path("/underwriterDashboard/poolDetail", { state: poolDetails })
            }
          >
            View details
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default UnderwriterCard;
