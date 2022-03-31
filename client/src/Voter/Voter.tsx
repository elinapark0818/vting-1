import React from "react";
import { Outlet } from "react-router-dom";
import "./voter.scss";

function Voter() {
  return (
    <div className="voteCodePageCon">
      <div className="voteCodePage">
        <Outlet />
      </div>
    </div>
  );
}

export default Voter;
