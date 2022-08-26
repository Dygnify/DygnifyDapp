import React, { useState, useEffect } from "react";

import UnderwriterCard from "./Components/UnderwriterCard";
import { getAllUnderwriterOpportunities } from "../../components/transaction/TransactionHelper";
import Loader from "../../uiTools/Loading/Loader";

const BorrowRequest = () => {
  const [opportunities, setOpportunities] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    await getUnderReviewOpportunity();

    setLoading(false);
  }, []);

  async function getUnderReviewOpportunity() {
    let list = await getAllUnderwriterOpportunities();
    if (list) {
      setOpportunities(list);
    }
  }

  return (
    <div className={`relative ${loading ? "h-[100vh]" : ""}`}>
      {loading && <Loader />}
      <div className={`${loading ? "blur-sm" : ""}`}>
        <div className="px-5">
          <div
            // style={{ display: "flex" }}
            className="items-center justify-between mb-10 mt-1 flex "
          >
            <h2
              className="text-left font-medium text-white text-2xl -ml-5"
              // style={{ fontSize: 28, marginLeft: -20 }}
            >
              Underwriter's Dashboard,
            </h2>
          </div>
        </div>

        {opportunities.length === 0 ? (
          <div style={{ display: "flex" }} className="justify-center">
            <div
              style={{
                color: "#64748B",
                fontSize: 18,
                marginTop: 10,
              }}
            >
              No Borrow requests are present at the moment.
            </div>
          </div>
        ) : (
          <div className="mb-16 ">
            <div className="grid grid-cols-1 space-y-3 md:space-y-0  md:grid-cols-2 md:gap-4 lg:mx-4 md:mx-2">
              {opportunities &&
                opportunities.map((item) => (
                  <UnderwriterCard data={item} key={item.id} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowRequest;
<h2>Invest</h2>;
