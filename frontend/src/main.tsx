import React from "react";
import ReactDOM from "react-dom/client";
import CustomerApp from "./apps/CustomerApp";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CustomerApp />
  </React.StrictMode>
);
