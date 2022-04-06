import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import Footer from "./Info/Footer";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Footer />
  </React.StrictMode>,
  document.getElementById("root")
);
