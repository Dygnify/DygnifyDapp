import React, { useEffect, useState } from "react";
import TransactionsCard from "../Underwriters/Components/TransactionsCard";

const ApprovalHistory = () => {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    fetch("/transactionStatus.json")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, [transactions]);
  return (
    <div className="mb-16">
      <h2 className="text-2xl mb-6">Transaction History</h2>
      <div className="collapse mb-3">
        <input type="checkbox" className="peer" />
        <div
          style={{
            display: "flex",
            borderTop: "1px solid #20232A",
            borderBottom: "1px solid #20232A",
          }}
          className="collapse-title text-md font-normal justify-around w-full"
        >
          <p className="w-1/6 text-center">Pool Name</p>
          <p className="w-1/6 text-center">Company Name</p>
          <p className="w-1/6 text-center">Created On</p>
          <p className="w-1/6 text-center">Decision</p>
        </div>
      </div>
      <div>
        {transactions.map((item) => (
          <TransactionsCard key={transactions.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default ApprovalHistory;
