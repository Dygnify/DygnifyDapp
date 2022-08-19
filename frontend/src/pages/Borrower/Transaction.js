import React, { useEffect, useState } from "react";
import { getTransactionHistory } from "../../components/transactionHistory/TransactionGetter";
import TransactionsCard from "../../tools/Card/TransactionsCard";
import Loader from "../../tools/Loading/Loader";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    console.log("reached");
    
    setTimeout(() => {
      setLoading(false)
    }, 1000)

    let data = await getTransactionHistory();

    // not getting any response
    setTransactions(data);

    setLoading(false);
    
    console.log(data);
  }, []);

  useEffect(() => {
    fetch("/transactions.json")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, [transactions]);

  return (
    <div className="mb-16">
      {loading && <Loader />}
      <div className={`${loading ? "filter blur-sm " : ""}`}>
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
          <p className="w-1/6 text-center">Pool</p>
          <p className="w-1/6 text-center">Date</p>
          <p className="w-1/6 text-center">Transaction Type</p>
          <p className="w-1/6 text-center">Amount</p>
          <p className="w-1/6 text-center">Status</p>
          <p className="w-1/6 text-center">View on Explorer</p>
        </div>
      </div>
      <div>
        {transactions.map((item) => (
          <TransactionsCard key={transactions.id} data={item} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default Transaction;
