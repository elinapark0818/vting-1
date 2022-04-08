import React from "react";
import { Outlet } from "react-router-dom";
import "./voter.scss";
import {
  transitions,
  positions,
  AlertOptions,
  Provider as AlertProvider,
} from "react-alert";
import { AlertTemplate } from "../v/AlertTemplate";
import AOS from "aos";

// Alert Options
const options: AlertOptions = {
  position: positions.TOP_CENTER,
  timeout: 3000,
  offset: "70px",
  transition: transitions.SCALE,
};

function Voter() {
  AOS.init();

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <div className="voteCodePageCon">
        <div className="voteCodePage">
          <Outlet />
        </div>
      </div>
    </AlertProvider>
  );
}

export default Voter;
