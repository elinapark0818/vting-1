import VoteSlider from "./VoteSlider";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import { Link } from "react-router-dom";
import "./HotVote.scss";

function HotVote() {
  const isLogin = useSelector((state: RootState) => state.isLogin.login);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const [content, setContent] = useState("newest");

  const onChangeHandler = (e: any) => {
    setContent(e.currentTarget.value);
  };

  const Options = [
    { key: "newest", value: "트랜디한" },
    { key: "most", value: "대세를 따르는" },
    { key: "diff", value: "나만의 생각을 가진" },
  ];

  return (
    <div className="hotVotes">
      <div className="hotVotesTitle">
        {isLogin ? (
          <div>
            <span>😂 {userInfo.nickname}님, 요즘 </span>
            <select
              id="newVoteFilter"
              onChange={onChangeHandler}
              value={content}
            >
              {Options.map((item, index) => (
                <option key={item.key} value={item.key}>
                  {item.value}
                </option>
              ))}
            </select>
            <span> 사람들은 이런 설문 한대요! 😂</span>
          </div>
        ) : (
          <div>
            <span>😂 요즘 </span>
            <select
              id="newVoteFilter"
              onChange={onChangeHandler}
              value={content}
            >
              {Options.map((item, index) => (
                <option key={item.key} value={item.key}>
                  {item.value}
                </option>
              ))}
            </select>
            <span> 사람들은 이런 설문 한대요! 😂</span>
          </div>
        )}
      </div>
      <VoteSlider content={content} />
      <Link to="/new">
        <div className="newVoteBtn vtingButton">설문 생성하기</div>
      </Link>
    </div>
  );
}

export default HotVote;
