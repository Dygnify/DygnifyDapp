import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { isConnected, requestAccount } from "./NavBarHelper";
import "./NavBar.css";

const NavBar = () => {
  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    isConnected()
      .then((data) => {
        setConnectionStatus(data);
      })
      .catch(() => {
        console.log("Error in getting connection status");
      });
  }, []);

  return (
    <>
      <section className="nav">
        <Link to="/">
          {/* <Button variant="outlined">{" Home"}</Button> */}
        </Link>
        <Button
          variant="outlined"
          onClick={
            connectionStatus
              ? () => {}
              : () => {
                  requestAccount()
                    .then(() => {
                      setConnectionStatus(true);
                    })
                    .catch(() => {
                      setConnectionStatus(false);
                    });
                }
          }
        >
          {connectionStatus ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
      </section>
    </>
  );
};

export default NavBar;
