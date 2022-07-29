import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import PoolCard from "./investor/components/Cards/PoolCard";
import Card from "./investor/components/Cards/PoolCard";
import Paths from "./Paths";
import DrawdownCard from "./tools/Card/DrawdownCard";
import RepaymentCard from "./tools/Card/RepaymentCard";

import PieGraph from "./investor/components/PieChart";
import ViewPoolCard from "./investor/components/Cards/ViewPoolCard";
import WithdrawCard from "./investor/components/Cards/WithdrawCard";
import DrawdownModal from "./tools/Modal/DrawdownModal";
import InvestModal from "./investor/components/Modal/InvestModal";

ReactDOM.render(<DrawdownCard />, document.getElementById("root"));
