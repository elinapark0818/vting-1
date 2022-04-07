import React from "react";
import axios from "axios";
import "./Home.scss";
import HotVote from "./HotVote";
import Info from "../Info/Info";
import Loading from "../Loading/Loading";

axios.defaults.withCredentials = true;

function Home() {
  return (
    <div className="homeCon">
      <HotVote />

      <div className="services">
        <Loading />
        추후 서비스 소개가 들어갈 영역입니다.
        <Info />
      </div>
    </div>
  );
}

export default Home;
