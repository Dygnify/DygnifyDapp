import React, { useEffect, useState } from "react";
import {
  getBorrowerDetails,
  getDrawdownOpportunities,
  getOpportunitysOf,
  getUserWalletAddress,
} from "../../components/transaction/TransactionHelper";
import DrawdownCard from "../../tools/Card/DrawdownCard";
import OpportunityCardCollapsible from "../../tools/Card/OpportunityCardCollapsible";
import DashboardHeader from "./DashboardHeader";
import LoanFormModal from "../../tools/Modal/LoanFormModal";
import axiosHttpService from "../../services/axioscall";
import { kycOptions } from "../../services/KYC/blockpass";
import ProcessingRequestModal from "./Components/Modal/ProcessingRequestModal";
import KycCheckModal from "./Components/Modal/KycCheckModal";

const BorrowList = () => {
  const [data, setData] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [kycStatus, setKycStatus] = useState();
  const [profileStatus, setProfileStatus] = useState();
  const [borrowReqProcess, setBorrowReqProcess] = useState();
  const [processModal, setProcessModal] = useState();
  const [kycSelected, setKycSelected] = useState();

  const handleForm = () => {
    setSelected(null);
    setKycSelected(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      let op = await getDrawdownOpportunities();
      if (op && op.length) {
        setData(op);
      }
    };
    fetchData();
    getUserWalletAddress().then((address) => checkForKycAndProfile(address));
  }, []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        let opportunityList = await getOpportunitysOf();
        console.log("*****", opportunityList);
        if (opportunityList && opportunityList.length) {
          setOpportunities(opportunityList);
        }
        console.log(opportunityList);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const checkForKycAndProfile = async (refId) => {
    try {
      const result = await axiosHttpService(kycOptions(refId));

      if (result.res.status === "success") setKycStatus(true);
      if (result.res.status === "error") {
        setKycStatus(false);
      }

      getBorrowerDetails().then((borrowerCID) => {
        console.log(borrowerCID);
        if (borrowerCID) setProfileStatus(true);
        else setProfileStatus(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <DashboardHeader
        setSelected={setSelected}
        kycStatus={kycStatus}
        profileStatus={profileStatus}
        setKycSelected={setKycSelected}
      />
      {selected && (
        <LoanFormModal
          setBorrowReqProcess={setBorrowReqProcess}
          setSelected={setSelected}
          setProcessModal={setProcessModal}
          handleForm={handleForm}
        />
      )}
      {processModal && (
        <ProcessingRequestModal
          borrowReqProcess={borrowReqProcess}
          setSelected={setSelected}
          setProcessModal={setProcessModal}
        />
      )}

      {kycSelected ? (
        <KycCheckModal kycStatus={kycStatus} profileStatus={profileStatus} />
      ) : (
        <></>
      )}

      <div className="mb-16">
        <h2 className="mb-2 text-xl">Drawdown Funds</h2>
        {data.length === 0 ? (
          <div
            style={{ display: "flex", marginTop: 20 }}
            className="justify-center"
          >
            <div style={{ color: "#64748B", fontSize: 18 }}>
              No drawdown available.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex" }} className=" gap-4">
            {data.map((item) => (
              <DrawdownCard key={item?.id} data={item} />
            ))}
          </div>
        )}
      </div>
      <div className="mb-16">
        <h2 className="mb-2 text-xl">Borrow Request</h2>
        <div className="collapse mb-3">
          <input type="checkbox" className="peer" />
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #20232A",
              borderBottom: "1px solid #20232A",
            }}
            className="collapse-title text-md font-light justify-around w-full"
          >
            <p className="w-1/4 text-center">Pool name</p>
            <p className="w-1/4 text-center">Capital requested</p>
            <p className="w-1/4 text-center">Created on</p>
            <p className="w-1/4 text-center">Status</p>
          </div>
        </div>
        {opportunities.length === 0 ? (
          <div
            style={{ display: "flex", marginTop: 40 }}
            className="justify-center"
          >
            <div style={{ color: "#64748B", fontSize: 18 }}>
              No borrow request available.
            </div>
          </div>
        ) : (
          <div>
            {opportunities
              ? opportunities.map((item) => (
                  <OpportunityCardCollapsible key={item.id} data={item} />
                ))
              : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowList;
