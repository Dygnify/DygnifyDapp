import React from "react";
import { Link, Outlet } from "react-router-dom";

const BorrowerDashboard = () => {
  return (
    <div style={{ backgroundColor: "#14171F" }}>
      <div
        style={{ display: "flex", borderBottom: "1px solid #20232A" }}
        className="justify-between px-5 py-3"
      >
        <img src="/images/logo.png" alt="" />
        {/* <GradientButton className='btn-outline'>Connected</GradientButton> */}
      </div>
      <div className="drawer drawer-mobile">
        <input
          id="dashboard-sidebar"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="mt-6 drawer-content text-white">
          <div className="px-5">
            <Outlet></Outlet>
          </div>
        </div>
        <div
          style={{ borderRight: "1px solid #20232A" }}
          className="drawer-side"
        >
          <label htmlFor="dashboard-sidebar" className="drawer-overlay"></label>
          <ul className="menu p-4 overflow-y-auto w-60  text-white">
            <li>
              <Link to="/borrower_dashboard">Overview</Link>
            </li>
            <li>
              <Link to="/borrower_dashboard/borrow_list">Borrow</Link>
            </li>
            <li>
              <Link to="/borrower_dashboard/transaction">Transactions</Link>
            </li>
            <li>
              <Link to="/borrower_dashboard/transaction">
                Underwriter queries
              </Link>
            </li>
            <li>
              <Link to="/borrower_dashboard/borrower_profile">Profile</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BorrowerDashboard;
