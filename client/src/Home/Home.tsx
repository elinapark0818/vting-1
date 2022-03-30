import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState, setIsLogin } from "../store/index";
import "./Home.scss";
import { Link } from "react-router-dom";

axios.defaults.withCredentials = true;

interface Props {
  text: string;
}

function Home({ text }: Props) {
  const isLogin = useSelector((state: RootState) => state.isLogin);

  return (
    <div className="homeCon">
      <div className="hotVotesTitle">
        {isLogin ? (
          <div>
            <span>😂 user님, 요즘 </span>
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
      <div className="hotVotes">
        <div className="hotVotesContents">
          <div className="hotVoteCard">
            <div className="hotVoteCardTitle">엄마가 좋아 아빠가 좋아?</div>
            <div className="hotVoteCardFormat">대결형</div>
            <div className="hotVoteCardCount">79명 참여 중</div>
          </div>
          <div className="hotVoteCard">
            <div className="hotVoteCardTitle">오늘 점심 메뉴</div>
            <div className="hotVoteCardFormat">바 그래프</div>
            <div className="hotVoteCardCount">37명 참여 중</div>
          </div>
          <div className="hotVoteCard">
            <div className="hotVoteCardTitle">인생에서 가장 소중한 것은?</div>
            <div className="hotVoteCardFormat">워드클라우드</div>
            <div className="hotVoteCardCount">11명 참여 중</div>
          </div>
          <div className="hotVoteCard">
            <div className="hotVoteCardTitle">궁금한거 있어?</div>
            <div className="hotVoteCardFormat">대화창</div>
            <div className="hotVoteCardCount">124명 참여 중</div>
          </div>
        </div>
      </div>
      <Link to="/new">
        <div className="newVoteBtn vtingButton">설문 생성하기</div>
      </Link>
      <div className="services">
        <Testfunc />
      </div>
    </div>
  );
}

function Testfunc() {
  const serverURL: string = "http://localhost:8000";

  const CheckEmail1 = async () => {
    try {
      const res = await axios.post(
        serverURL + "/user/check",
        {
          user_id: "test@yof.com",
        },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.message === "Success verified") {
        console.log("이미 가입된 회원입니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const CheckEmail2 = async () => {
    try {
      const res = await axios.post(
        serverURL + "/user/check",
        {
          user_id: "dummy@email.com",
        },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.message === "It doesn't match") {
        console.log("회원가입이 가능한 아이디입니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const CheckPass1 = async () => {
    try {
      const res = await axios.post(
        serverURL + "/user/check",
        {
          password: "1q2w3e4r",
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("message 뭐라고? ===>", res.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const CheckPass2 = async () => {
    try {
      const res = await axios.post(
        serverURL + "/user/check",
        {
          password: "q1w2e34r",
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log("message 뭐라고? ===>", res.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          CheckEmail1();
        }}
      >
        1. 이미 있는 아이디
      </button>
      <button
        onClick={() => {
          CheckEmail2();
        }}
      >
        2. 새로운 아이디
      </button>
      <button
        onClick={() => {
          CheckPass1();
        }}
      >
        3. 맞는 비밀번호
      </button>
      <button
        onClick={() => {
          CheckPass2();
        }}
      >
        4. 틀린 비밀번호
      </button>
    </div>
  );
}

Home.defaultProps = {
  text: "This is Home!",
};

export default Home;
