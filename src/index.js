import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LicenseInfo } from "@mui/x-license";
import { BrowserRouter } from "react-router-dom";

LicenseInfo.setLicenseKey(
  "525cc0edf2afa0376da336d6a4b039adTz04NzU1MCxFPTE3NDM1MzI2MzEwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
