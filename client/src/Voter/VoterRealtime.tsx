import React, { useEffect, useState, useRef } from "react";
import ReactWordcloud, { MinMaxPair } from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./voter.scss";

type IntervalFunction = () => unknown | void;

function useInterval(callback: IntervalFunction, delay: number) {
  const savedCallback = useRef<IntervalFunction | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

// 랜덤길이(너비) 생성 관련
const makeRandomHeight = (num: number, sum: number): React.CSSProperties => {
  let heightProprety = { height: (num / sum) * 100 + "%" };
  return heightProprety;
};
const makeRandomWidth = (num: number, sum: number): React.CSSProperties => {
  let heightProprety = { width: (num / sum) * 100 + "%" };
  return heightProprety;
};

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

interface Props {
  voteData: VoteInfo;
}

function VoterRealtime({ voteData }: Props) {
  const serverURL = "http://localhost:8000";
  const { code } = useParams();
  const [voteInfoH, setVoteInfoH] = useState(voteData);
  const format = voteInfoH.format;
  const type = voteInfoH.type;

  // 워드클라우드 세팅
  const words = voteInfoH.items
    ? voteInfoH.items.map((el: any) => ({
        text: el.content as string,
        value: el.count as number,
      }))
    : [{ text: "", value: 0 }];
  const fontSizes = [20, 50] as MinMaxPair;
  const options = {
    fontSizes: fontSizes,
  };

  // 5초에 한 번씩 ajax 요청 (응답 덮어쓰기)
  useInterval(async () => {
    const response = await axios.get(`${serverURL}/voter/${code}`);
    if (response.status === 200) {
      console.log(response.data);
      // console.log("그냥 로그만");
    }
  }, 5000);

  switch (format) {
    case "bar":
      if (type === "vertical") {
        return (
          <div className="realTimeCon">
            <div className="votePreviewBack vResult">
              <div className="votePreview-barVer-con">
                {voteInfoH.items ? (
                  voteInfoH.items.map((el, idx) => (
                    <div key={idx} id="votePreview-barVer-bar">
                      <div className="barVer-itemName">{el.content}</div>
                      <div
                        className="barVer-itemBar"
                        style={makeRandomHeight(
                          el.count as number,
                          voteInfoH.sumCount as number
                        )}
                      ></div>
                    </div>
                  ))
                ) : (
                  <div>설문 정보를 불러올 수 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        );
      } else if (type === "horizontal") {
        return (
          <div className="realTimeCon">
            <div className="votePreviewBack">
              <div className="votePreview-barHor-con">
                {voteInfoH.items ? (
                  voteInfoH.items.map((el, idx) => (
                    <div key={idx} id="votePreview-barHor-bar">
                      <div className="barHor-itemName">{el.content}</div>
                      <div
                        className="barHor-itemBar"
                        style={makeRandomWidth(
                          el.count as number,
                          voteInfoH.sumCount as number
                        )}
                      ></div>
                    </div>
                  ))
                ) : (
                  <div>설문 정보를 불러올 수 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        );
      }
      return <></>;
    case "open":
      return (
        <div className="realTimeCon">
          {voteInfoH.items ? (
            voteInfoH.items.map((el, idx) => (
              <div
                className={
                  idx < 4
                    ? `openendIcon border${idx + 1}`
                    : `openendIcon border${idx - 3}`
                }
                key={idx}
              >
                {el.content}
              </div>
            ))
          ) : (
            <div>설문 정보를 불러올 수 없습니다.</div>
          )}
        </div>
      );
    case "versus":
      return (
        <div className="realTimeCon">
          <div className="versusCon">
            <div>{voteInfoH.items ? voteInfoH.items[0].content : ""}</div>
            <div>vs</div>
            <div>{voteInfoH.items ? voteInfoH.items[1].content : ""}</div>
          </div>
        </div>
      );
    case "word":
      return <ReactWordcloud words={words} options={options} />;
    default:
      return <div>데이터 불러오기 실패</div>;
  }
}

export default VoterRealtime;
