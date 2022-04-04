import axios from "axios";
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useParams } from "react-router-dom";
import "./voter.scss";
import logo from "../assets/yof_logo-17.jpg";
import vtCry from "../assets/vt_cry.png";
import VoterAnswer from "./VoterAnswer";
import Counter from "./Counter";
import VoterRealtime from "./VoterRealtime";

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

interface Item {
  idx: number;
  content: string;
  count?: number;
}

interface VoteInfo {
  _id?: string;
  user_id?: string;
  password?: string;
  url?: number;
  title?: string;
  format?: string;
  type?: string;
  items?: Item[];
  multiple?: boolean;
  manytimes?: boolean;
  undergoing?: boolean;
  isPublic?: boolean;
  created_at?: string;
  overtime?: number;
  sumCount?: number;
}

const dummVoteData: VoteInfo = {
  _id: "abc",
  user_id: "abc",
  password: "abc",
  url: 123456,
  title: "abc",
  format: "abc",
  type: "abc",
  items: [{ idx: 0, content: "abc" }],
  multiple: false,
  manytimes: false,
  undergoing: false,
  isPublic: false,
  created_at: "abc",
  overtime: 0,
  sumCount: 0,
};

function VoterResult() {
  const [profileImg, setProfileImg] = useState(logo);
  const [title, setTitle] = useState("");
  const [nickName, setNickName] = useState(randomNick());
  const { code } = useParams();
  const [result, setResult] = useState(false);
  const [answerMode, setAnswerMode] = useState(true);
  const [errorMode, setErrorMode] = useState(false);
  const [nonUser, setNonUser] = useState(false);
  const [overtime, setOvertime] = useState(60);
  const [voteData, setVoteData] = useState(dummVoteData);

  console.log(voteData);

  useEffect(() => {
    if (code) setResult(true);
  }, [code]);

  const serverURL = "http://localhost:8000";

  useEffect(() => {
    const voteResult = async () => {
      try {
        const response = await axios.get(`${serverURL}/voter/${code}`, {
          headers: {
            withCredentials: true,
          },
        });
        if (response.status === 200) {
          setVoteData({
            _id: response.data.vote_data._id,
            url: response.data.vote_data.url,
            title: response.data.vote_data.title,
            format: response.data.vote_data.format,
            type: response.data.vote_data.type || "",
            items:
              response.data.vote_data.items || response.data.vote_data.response,
            multiple: response.data.vote_data.multiple,
            manytimes: response.data.vote_data.manytimes,
            undergoing: response.data.vote_data.undergoing || false,
            isPublic: response.data.vote_data.isPublic || false,
            created_at: response.data.vote_data.created_at,
            overtime: response.data.overtime || 0,
            sumCount: response.data.sumCount || 0,
          });
          setTitle(response.data.vote_data.title);
          if (response.data.user_data) {
            setNickName(response.data.user_data.nickname);
            if (response.data.user_data.image)
              setProfileImg(response.data.user_data.image);
          } else {
            console.log(response);
            // 비회원 설문임
            // 1. 비회원모드 설정
            setNonUser(true);
            // 2. 남은시간 설정
            setOvertime(response.data.overtime);
          }
        }
      } catch (e) {
        console.log(e);
        setErrorMode(true);
      }
    };
    voteResult();
  }, []);

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
            <VoterAnswer
              setAnswerMode={setAnswerMode}
              code={code}
              voteData={voteData}
            />
          ) : (
            <VoterRealtime voteData={voteData} />
          )}
        </>
      )}
    </div>
  );
}

export default VoterResult;
