import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BiShareAlt, BiCopy } from "react-icons/bi";
import "./v.scss";

function V() {
  const [isRealTime, setIsRealTime] = useState(false);
  const [togglePublic, setTogglePublic] = useState(false);
  const [toggleOngoing, setToggleOngoing] = useState(false);

  const clickedTogglePublic = () => {
    setTogglePublic((prev) => !prev);
  };
  const clickedToggleOngoing = () => {
    setToggleOngoing((prev) => !prev);
  };

  return (
    <div className="voteResultPageCon">
      <div className="voteResultPage">
        <div className="voteResultTitle">자신을 한 문장으로 표현한다면?</div>
        <div className="voteResultContent">
          {isRealTime ? <RealTime /> : <Howto />}
        </div>
      </div>
      <div className="voteResultFooter">
        <div className="modeChange">
          <div
            className={isRealTime ? "modebtn gray" : "modebtn"}
            onClick={() => setIsRealTime(false)}
          >
            Vting 접속 방법
          </div>
          <div
            className={isRealTime ? "modebtn" : "modebtn gray"}
            onClick={() => setIsRealTime(true)}
          >
            실시간 응답 보기
          </div>
        </div>
        <div className="options">
          <button onClick={clickedTogglePublic} className="toggleBtn">
            <div
              className={
                togglePublic ? "toggleCircle toggleOn" : "toggleCircle"
              }
            >
              {togglePublic ? "비공개" : "공개"}
            </div>
          </button>
          <button onClick={clickedToggleOngoing} className="toggleBtn">
            <div
              className={
                toggleOngoing ? "toggleCircle toggleOn" : "toggleCircle"
              }
            >
              {toggleOngoing ? "재시작" : "진행중"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Howto() {
  const [url, setUrl] = useState("");
  const { code } = useParams();

  const QRCode = require("qrcode");

  useEffect(() => {
    QRCode.toDataURL(
      "https://vote.v-ting.net/123456",
      function (err: any, url: string) {
        setUrl(url);
      }
    );
  }, []);

  return (
    <>
      <div className="voteResultChild voteResultShort">
        <div className="voteResultChildTitle">Short URL</div>
        <div className="voteResultChildContent">
          vote.v-ting.net/
          <br />
          {code}
        </div>
        <div className="voteResultChildShare">
          <div className="copy">
            <BiCopy />
          </div>
          <div className="sns">
            <BiShareAlt />
          </div>
        </div>
        <div className="voteResultChildEx">
          인터넷 주소창에 위 주소를 기입하여 접속
        </div>
      </div>
      <div className="hrVer"></div>
      <div className="voteResultChild voteResultCode">
        <div className="voteResultChildTitle">Vting Code</div>
        <div className="voteResultChildContent">{code}</div>
        <div className="voteResultChildShare">
          <div className="copy">
            <BiCopy />
          </div>
          <div className="sns">
            <BiShareAlt />
          </div>
        </div>
        <div className="voteResultChildEx">
          vote.v-ting.net에서 위 코드를 기입하여 접속
        </div>
      </div>
      <div className="hrVer"></div>
      <div className="voteResultChild voteResultQr">
        <div className="voteResultChildTitle">QR Code</div>
        <div className="voteResultChildContent voteResultChildQr">
          <img src={url} alt="qr" />
        </div>
        <div className="voteResultChildShare">
          <div className="copy">
            <BiCopy />
          </div>
          <div className="sns">
            <BiShareAlt />
          </div>
        </div>
        <div className="voteResultChildEx">
          QR 코드를 찍어서 연결되는 페이지로 접속
        </div>
      </div>
    </>
  );
}

function RealTime() {
  const dummyData = [
    "저는 그야말로 말하는 감자",
    "나를 한문장에 담을 수 없음",
    "안녕하세요? 디진다돈까스를 사랑하는 돈까스맨입니다.",
    "안녕하세요! 낮에는 따사로운 햇살같은 남자입니다.",
    "이시대의 로맨티스트",
    "근데 이거 왜 하는거에요?",
  ];

  return (
    <div className="realTimeCon">
      {dummyData.map((el, idx) => (
        <div
          className={
            idx < 4
              ? `openendIcon border${idx + 1}`
              : `openendIcon border${idx - 3}`
          }
          key={idx}
        >
          {el}
        </div>
      ))}
    </div>
  );
}

export default V;
