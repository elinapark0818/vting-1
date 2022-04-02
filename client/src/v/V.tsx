import React, { useEffect, useState, createContext } from "react";
import { useParams } from "react-router-dom";
import { BiShareAlt, BiCopy } from "react-icons/bi";
import "./v.scss";
import {
  useAlert,
  transitions,
  positions,
  AlertOptions,
  Provider as AlertProvider,
} from "react-alert";
import { AlertTemplate, ImgAlertTemplate } from "./AlertTemplate";
import axios from "axios";
import Vresult from "./Vresult";

const imgAlertContext = createContext<any | null>(null);

// 컴포넌트 시작
function V() {
  const { code } = useParams();
  const [isRealTime, setIsRealTime] = useState(false);
  const [togglePublic, setTogglePublic] = useState(true);
  const [toggleOngoing, setToggleOngoing] = useState(true);
  const [voteTitle, setVoteTitle] = useState("");
  const [voteInfo, setVoteInfo] = useState({});
  const [voteSumCount, setVoteSumCount] = useState(0);

  const serverURL = "http://localhost:8000";
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const voteResult = async () => {
      try {
        const response = await axios.get(`${serverURL}/vting/${code}`, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            withCredentials: true,
          },
        });

        // 응답 객체에 password가 있으면 -> 비회원 설문조사임
        if (response.status === 200 && response.data.data.password) {
          setVoteInfo(response.data.data);
          setVoteTitle(response.data.data.title);
          setToggleOngoing(response.data.data.undergoing);
          setTogglePublic(response.data.data.isPublic);
          // 비회원 설문조사 모드 (비밀번호 입력창) 활성화
        } else if (response.status === 200 && response.data.data.user_id) {
          setVoteInfo(response.data.data);
          setVoteTitle(response.data.data.title);
          setToggleOngoing(response.data.data.undergoing);
          setTogglePublic(response.data.data.isPublic);
          console.log("(회원) 설문 생성 후 받아온 데이터 ==>", response.data);
          // sumCount가 있는 설문이면 가져오기
          if (response.data.sumCount) setVoteSumCount(response.data.sumCount);
        } else {
          console.log("잘못된 요청");
        }
      } catch (e) {
        console.log(e);
      }
    };

    voteResult();
  }, []);

  const clickedTogglePublic = async () => {
    try {
      const response = await axios.patch(
        `${serverURL}/vting/${code}`,
        {
          isPublic: "clicked!",
          isActive: null,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setTogglePublic(response.data.isPublic);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const clickedToggleOngoing = async () => {
    try {
      const response = await axios.patch(
        `${serverURL}/vting/${code}`,
        {
          isPublic: null,
          isActive: "clicked!",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setToggleOngoing(response.data.isActive);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Alert Option
  const options: AlertOptions = {
    position: positions.TOP_CENTER,
    timeout: 3000,
    offset: "70px",
    transition: transitions.SCALE,
  };

  const imgoptions: AlertOptions = {
    position: positions.MIDDLE,
    // timeout: 3000,
    // offset: "70px",
    transition: transitions.SCALE,
  };

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <AlertProvider
        template={ImgAlertTemplate}
        {...imgoptions}
        context={imgAlertContext}
      >
        <div className="voteResultPageCon">
          <div className="voteResultPage">
            <div className="voteResultTitle">{voteTitle}</div>
            <div className="voteResultContent">
              {isRealTime ? (
                <Vresult voteInfo={voteInfo} voteSumCount={voteSumCount} />
              ) : (
                <Howto />
              )}
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
              <button
                onClick={() => clickedTogglePublic()}
                className="toggleBtn"
              >
                <div
                  className={
                    togglePublic ? "toggleCircle" : "toggleCircle toggleOn"
                  }
                >
                  {togglePublic ? "공개" : "비공개"}
                </div>
              </button>
              <button
                onClick={() => clickedToggleOngoing()}
                className="toggleBtn"
              >
                <div
                  className={
                    toggleOngoing ? "toggleCircle" : "toggleCircle toggleOn"
                  }
                >
                  {toggleOngoing ? "진행중" : "재시작"}
                </div>
              </button>
            </div>
          </div>
        </div>
      </AlertProvider>
    </AlertProvider>
  );
}

function Howto() {
  const [url, setUrl] = useState("");
  const { code } = useParams();
  const alert = useAlert();
  const imgAlert = useAlert(imgAlertContext);

  let codeString = "";
  if (code) codeString = code.toString();

  // param에서 코드 받아와서 주소 만들기
  const shortUrl = "https://vote.v-ting.net/" + codeString;

  // QR 코드 생성
  const QRCode = require("qrcode");
  useEffect(() => {
    QRCode.toDataURL(shortUrl, function (err: Error, url: string) {
      setUrl(url);
    });
  }, [shortUrl]);

  // 클립보드에 복사
  function shortUrlClip() {
    try {
      navigator.clipboard.writeText(url);
      alert.show("접속주소가 클립보드에 복사되었습니다.");
    } catch (e) {
      alert.show("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  function codeClip() {
    try {
      navigator.clipboard.writeText(codeString);
      alert.show("접속코드가 클립보드에 복사되었습니다.");
    } catch (e) {
      alert.show("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  async function quBlobClip() {
    try {
      const imgURL = url;
      const data = await fetch(imgURL);
      const blob = await data.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      alert.show("QR 코드가 클립보드에 복사되었습니다.");
    } catch (err) {
      alert.show("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  // qr코드 클릭 시 확대
  function zoomQr() {
    const qrimgDiv = <img src={url} alt={url} />;
    imgAlert.show(qrimgDiv, {
      close: () => {
        alert.remove(imgAlert);
      },
    });
  }

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
          <div className="copy" onClick={() => shortUrlClip()}>
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
          <div className="copy" onClick={() => codeClip()}>
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
          <img src={url} alt="qr" onClick={() => zoomQr()} />
        </div>
        <div className="voteResultChildShare">
          <div className="copy" onClick={() => quBlobClip()}>
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

export default V;
