import React, { useEffect, useState } from "react";
import VoteSlider from "./VoteSlider";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import { Link } from "react-router-dom";
import "./HotVote.scss";

function HotVote() {
  const isLogin = useSelector((state: RootState) => state.isLogin);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [allVotes, setAllVotes] = useState([]);

  const serverURL: string = "http://localhost:8000";
  useEffect(() => {
    async function getAllVotes() {
      const response = await axios.get(`${serverURL}/allvotes`);
      if (response.status === 200) {
        setAllVotes(response.data.vote);
      }
    }
    getAllVotes();
  }, []);

  return (
    <div className="hotVotes">
      <div className="hotVotesTitle">
        {isLogin ? (
          <div>
            <span>😂 {userInfo.nickname}님, 요즘 </span>
            <select id="newVoteFilter">
              <option value="newest">트렌디한</option>
              <option value="most">대세를 따르는</option>
              <option value="diff">나만의 생각을 가진</option>
            </select>
            <span> 사람들은 이런 설문 한대요! 😂</span>
          </div>
        ) : (
          <div>
            <span>😂 요즘 </span>
            <select id="newVoteFilter">
              <option value="newest">트렌디한</option>
              <option value="most">대세를 따르는</option>
              <option value="diff">나만의 생각을 가진</option>
            </select>
            <span> 사람들은 이런 설문 한대요! 😂</span>
          </div>
        )}
      </div>
      <VoteSlider />
      <Link to="/new">
        <div className="newVoteBtn vtingButton">설문 생성하기</div>
      </Link>
    </div>
  );
}

export default HotVote;
