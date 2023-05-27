import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ReactGA from "react-ga4";

ReactGA.initialize("G-HK5TWK3JJV");

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
