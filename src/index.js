import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App";
import axios from "axios";

axios.defaults.baseURL = "https://ass2-sto3.onrender.com/api";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
