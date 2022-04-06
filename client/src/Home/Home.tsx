import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import "./Home.scss";
import HotVote from "./HotVote";
import Info from "../Info/Info";

axios.defaults.withCredentials = true;

function Home() {
  return (
    <div className="homeCon">
      <HotVote />

      <div className="services">
        추후 서비스 소개가 들어갈 영역입니다.
        <Info />
      </div>
    </div>
  );
}

export default Home;
