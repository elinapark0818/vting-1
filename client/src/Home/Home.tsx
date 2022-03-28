import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState, setIsLogin } from "../store/index";
import "./Home.scss";

axios.defaults.withCredentials = true;

interface Props {
  text: string;
}

function Home({ text }: Props) {
  const isLogin = useSelector((state: RootState) => state.isLogin);

  return (
    <div className="homeCon">
      <div className="hotVotes">
        <div className="hotVotesTitle">
          {isLogin
            ? "😂 user님, 요즘 ENFP는 이런 설문 한대요! 😂"
            : "😂 요즘 ENFP는 이런 설문 한대요! 😂"}
        </div>
        <div className="hotVotesContents">
          <div className="hotVoteCard">
            <div className="hotVoteCardTitle">엄마가 좋아 아빠가 좋아?</div>
            <div className="hotVoteCardFormat">대결형</div>
            <div className="hotVoteCardCount">79명 참여 중</div>
          </div>
        </div>
      </div>
      <div className="newVoteBtn vtingButton">설문 생성하기</div>
      <div className="services">서비스 소개 영역입니다. (추후 제작 예정)</div>
    </div>
  );
}

Home.defaultProps = {
  text: "This is Home!",
};

export default Home;
