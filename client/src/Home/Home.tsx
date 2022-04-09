import React from "react";
import axios from "axios";
import "./Home.scss";
import HotVote from "./HotVote";
import Info from "../Info/Info";
import Test from "../Modal/Test";

axios.defaults.withCredentials = true;

function Home() {
  return (
    <div className="homeCon">
      <HotVote />
      <Test />

      <div className="services">
        <Info />
      </div>
    </div>
  );
}

export default Home;
