import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Paths from "./Paths";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY_DNS,
	integrations: [new BrowserTracing()],

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
});

ReactDOM.render(<Paths />, document.getElementById("root"));
