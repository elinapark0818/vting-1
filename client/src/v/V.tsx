import React, { useEffect, useState } from "react";
import { Link, useParams, Routes, Route, Outlet } from "react-router-dom";
import "./v.scss";
import vtinglogo from "../assets/vt_logo_2.png";
import VResult from "./VResult";
import VCode from "./VCode";

function V() {
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

export default V;
