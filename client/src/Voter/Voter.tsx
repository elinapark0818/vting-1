import React, { useEffect, useState } from "react";
import { Link, useParams, Routes, Route, Outlet } from "react-router-dom";
import "./voter.scss";
import vtinglogo from "../assets/vt_logo_2.png";
import VResult from "./VoterResult";
import VCode from "./VoterCode";

function Voter() {
  const [voteCode, setVoteCode] = useState("");
  const [result, setResult] = useState(false);
  const { code } = useParams();

  return (
    <div className="voteCodePageCon">
      <div className="voteCodePage">
        <Outlet />
      </div>
    </div>
  );
}

export default Voter;
