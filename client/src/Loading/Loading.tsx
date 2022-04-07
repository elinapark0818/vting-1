import React from "react";
import smileVt from "../assets/vt_smile.png";
import "./Loading.scss";

function Loading() {
  return (
    <div className="loading">
      <img src={smileVt} alt="now loading..." />
      <div className="text">Now Loading...</div>
    </div>
  );
}

export default Loading;
