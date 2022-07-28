import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import PoolCard from "./investor/components/PoolCard";

import Paths from "./Paths";
import DrawdownCard from "./tools/Card/DrawdownCard";
import RepaymentCard from "./tools/Card/RepaymentCard";

ReactDOM.render(<PoolCard />, document.getElementById("root"));
