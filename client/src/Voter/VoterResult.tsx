import axios from "axios";
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import "./voter.scss";
import logo from "../assets/yof_logo-17.jpg";

const dummyData = {
  nickname: "YOF",
  profile: "../assets/yof_logo-17.jpg",
  title: "엄마가 좋아 아빠가 좋아",
  answers: [
    { idx: 1, content: "엄마" },
    { idx: 2, content: "아빠" },
  ],
};

interface Props {
  code: string | undefined;
  answerMode?: boolean;
  setAnswerMode: Dispatch<SetStateAction<boolean>>;
}

function VoterResult() {
  const [profileImg, setProfileImg] = useState("");
  const { code } = useParams();
  const [result, setResult] = useState(false);
  const [answerMode, setAnswerMode] = useState(true);

  useEffect(() => {
    if (code) setResult(true);
  }, [code]);

  // const serverURL = "http://localhost:8000";

  // useEffect(() => {
  //   console.log("시작");
  //   let accessToken = localStorage.getItem("accessToken");
  //   console.log("토큰", accessToken);
  //   const voteResult = async () => {
  //     try {
  //       const response = await axios.get(`${serverURL}/vote/${code}`, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           withCredentials: true,
  //         },
  //       });
  //       if (response.status === 200) {
  //         console.log(response.data);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   voteResult();
  // }, []);

  return (
    <div className="votingCon">
      <div className="votingHeader">
        <div className="votingProfile">
          <div className="votingProfileImg">
            <img src={profileImg ? profileImg : logo} alt="profile" />
          </div>
          {dummyData.nickname}님의 설문입니다.
        </div>
      </div>
      <div className="votingTitle">엄마가 좋아 아빠가 좋아</div>
      {answerMode ? (
        <Answer setAnswerMode={setAnswerMode} code={code} />
      ) : (
        <Result />
      )}
    </div>
  );
}

function Answer({ setAnswerMode, code }: Props) {
  const [clicked, setClicked] = useState(-1);

  function toResult() {
    // 1. 선택된(혹은 주관식일 경우 작성된) 응답을 axios로 보낸다.

    // 2. 응답이 제대로 전달되었으면, 결과보기 모드를 활성화한다.
    setAnswerMode(false);
  }

  return (
    <div className="votingBody">
      <div className="votingContent">
        <div className="voteAnswers">
          {dummyData.answers.map((el, idx) => (
            <div
              className="voteAnswer"
              onClick={() => setClicked(el.idx)}
              key={idx}
            >
              <div
                className={
                  el.idx === clicked ? "answerIdx clickedIdx" : "answerIdx"
                }
              >
                {el.idx}
              </div>
              <div
                className={
                  el.idx === clicked
                    ? "VoteAnswerContent clickedCtn"
                    : "VoteAnswerContent"
                }
              >
                {el.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="voteCodeButton vtingButton blueButton"
        onClick={() => toResult()}
      >
        투표 결정
      </div>
    </div>
  );
}

function Result() {
  return (
    <div className="votingBody">
      <div className="votingContent">
        <div>투표 결과 창</div>
      </div>
    </div>
  );
}

export default VoterResult;
