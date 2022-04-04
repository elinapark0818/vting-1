import axios from "axios";
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import "./voter.scss";
import logo from "../assets/yof_logo-17.jpg";
import vtCry from "../assets/vt_cry.png";
import VoterAnswer from "./VoterAnswer";
import Counter from "./Counter";

const adj = [
  "사랑스러운",
  "귀여운",
  "매력적인",
  "자신감있는",
  "우아한",
  "품격있는",
  "화려한",
  "고약한",
  "멋진",
  "잘생긴",
  "친절한",
  "상냥한",
  "예의바른",
  "명랑한",
  "쾌활한",
];
const animal = [
  "고양이",
  "강아지",
  "고릴라",
  "알파카",
  "거미",
  "햄스터",
  "프레리독",
  "도마뱀",
  "비단뱀",
  "기린",
  "코끼리",
  "얼룩말",
  "사자",
  "호랑이",
  "매",
  "병아리",
  "토끼",
];
function randomNick() {
  return (
    adj[Math.floor(Math.random() * adj.length)] +
    " " +
    animal[Math.floor(Math.random() * animal.length)]
  );
}

function VoterResult() {
  const [profileImg, setProfileImg] = useState(logo);
  const [title, setTitle] = useState("");
  const [nickName, setNickName] = useState(randomNick());
  const { code } = useParams();
  const [result, setResult] = useState(false);
  const [answerMode, setAnswerMode] = useState(true);
  const [errorMode, setErrorMode] = useState(false);
  const [nonUser, setNonUser] = useState(true);
  const [overtime, setOvertime] = useState(60);

  useEffect(() => {
    if (code) setResult(true);
  }, [code]);

  const serverURL = "http://localhost:8000";

  // useEffect(() => {
  //   const voteResult = async () => {
  //     try {
  //       const response = await axios.get(`${serverURL}/vote/${code}`, {
  //         headers: {
  //           withCredentials: true,
  //         },
  //       });
  //       if (response.status === 200) {
  //         console.log(response.data.vote_data);
  //         setTitle(response.data.vote_data.title);
  //         setNickName(response.data.user_data.nickname);
  //         if (response.data.user_data.image)
  //           setProfileImg(response.data.user_data.image);
  //       }
  //     } catch (e) {
  //       setErrorMode(true);
  //     }
  //   };
  //   voteResult();
  // }, []);

  return (
    <div className="votingCon">
      {errorMode ? (
        <>
          <div className="voteResultContent">
            <div className="errorCon">
              <div className="imgCon">
                <img src={vtCry} alt="something wrong" />
              </div>
              <div>
                <span className="errorTitle">
                  Ooooops... Something went wrong.
                </span>
                <br />
                해당 코드를 가진 설문이 없거나 만료된 설문입니다.
                <br />
                설문 코드를 다시 확인해주시기 바랍니다. <br />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="votingHeader">
            <div className="votingProfile">
              <div className="votingProfileImg">
                <img src={profileImg ? profileImg : logo} alt="profile" />
              </div>
              {nickName} 님의 설문입니다.
            </div>
            {nonUser ? <Counter overtime={overtime} /> : <div></div>}
          </div>
          <div className="votingTitle">{title}</div>
          {answerMode ? (
            <VoterAnswer setAnswerMode={setAnswerMode} code={code} />
          ) : (
            <Result />
          )}
        </>
      )}
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
