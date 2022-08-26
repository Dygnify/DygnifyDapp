import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import Header from "../Layout/Header";

const UnderwriterDashboard = () => {
  const [color, setColor] = useState(false);
  const [color2, setColor2] = useState(false);

  const historyIcon = (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h48v48H0z" fill="none"></path>
      <path
        d="M25.99 6C16.04 6 8 14.06 8 24H2l7.79 7.79.14.29L18 24h-6c0-7.73 6.27-14 14-14s14 6.27 14 14-6.27 14-14 14c-3.87 0-7.36-1.58-9.89-4.11l-2.83 2.83C16.53 39.98 21.02 42 25.99 42 35.94 42 44 33.94 44 24S35.94 6 25.99 6zM24 16v10l8.56 5.08L34 28.65l-7-4.15V16h-3z"
        opacity=".9"
        fill={
          color2
            ? "hsl(var(--p) / var(--tw-text-opacity))"
            : "rgb(100 116 139 / var(--tw-text-opacity))"
        }
        class="fill-000000"
      ></path>
    </svg>
  );

  const listIcon = (
    <svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M512 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h448c35.35 0 64-28.65 64-64V96c0-35.35-28.7-64-64-64zm16 384c0 8.822-7.178 16-16 16H64c-8.822 0-16-7.178-16-16V96c0-8.822 7.178-16 16-16h448c8.822 0 16 7.178 16 16v320zM128 128c-17.7 0-32 14.3-32 32 0 17.67 14.33 32 32 32s32-14.33 32-32c0-17.7-14.3-32-32-32zm0 96c-17.7 0-32 14.3-32 32 0 17.67 14.33 32 32 32s32-14.33 32-32c0-17.7-14.3-32-32-32zm0 96c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32c0-17.7-14.3-32-32-32zm328-184H215.1c-12.4 0-23.1 10.8-23.1 24s10.7 24 23.1 24H456c13.25 0 24-10.75 24-24s-10.7-24-24-24zm0 96H215.1c-12.4 0-23.1 10.8-23.1 24 0 13.25 10.75 24 23.1 24H456c13.25 0 24-10.75 24-24 0-13.3-10.7-24-24-24zm0 96H215.1c-12.4 0-23.1 10.8-23.1 24s10.75 24 23.1 24H456c13.25 0 24-10.75 24-24s-10.7-24-24-24z"
        fill={
          color
            ? "hsl(var(--p) / var(--tw-text-opacity))"
            : "rgb(100 116 139 / var(--tw-text-opacity))"
        }
        class="fill-000000"
      ></path>
    </svg>
  );

  return (
    <div style={{ backgroundColor: "#14171F" }}>
      <Header />
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
            <li
              className={`font-medium ${
                color ? "text-primary-focus " : "text-slate-500"
              }`}
            >
              <Link
                to="/underwriterDashboard"
                onClick={() => {
                  if (color) {
                    setColor(false);
                  } else {
                    setColor(true);
                    setColor2(false);
                  }
                }}
              >
                <span className=" w-6 h-6">{listIcon}</span> Borrow request
              </Link>
            </li>
            <li
              className={`font-medium ${
                color2 ? "text-primary-focus" : "text-slate-500"
              }`}
            >
              <Link
                to="/underwriterDashboard/approvalHistory"
                onClick={() => {
                  if (color2) {
                    setColor2(false);
                  } else {
                    setColor2(true);
                    setColor(false);
                  }
                }}
              >
                <span className=" w-6 h-6">{historyIcon}</span> Approval history
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnderwriterDashboard;
