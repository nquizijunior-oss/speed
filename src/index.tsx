import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { initSharedPersistence } from "./lib/sharedPersistence";

const rootEl = document.getElementById("root");
if (rootEl) {
  initSharedPersistence().finally(() => {
    ReactDOM.createRoot(rootEl).render(<App />);
  });
}