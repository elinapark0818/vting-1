import React, { useState } from "react";
import "./v.scss";
import ReactWordcloud, { MinMaxPair } from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

const dummyData = [
  {
    form: "bar",
    type: "vertical",
    answer: [
      { idx: 1, content: "짜장면", count: 10 },
      { idx: 2, content: "짬뽕", count: 8 },
      { idx: 3, content: "울면", count: 0 },
      { idx: 4, content: "볶음밥", count: 5 },
      { idx: 5, content: "잡채밥", count: 11 },
    ],
    sumCount: 34,
  },
  {
    form: "bar",
    type: "horizontal",
    answer: [
      { idx: 1, content: "짜장면", count: 10 },
      { idx: 2, content: "짬뽕", count: 8 },
      { idx: 3, content: "울면", count: 0 },
      { idx: 4, content: "볶음밥", count: 5 },
      { idx: 5, content: "잡채밥", count: 11 },
    ],
    sumCount: 34,
  },
  {
    form: "open",
    answer: [
      { idx: 1, content: "저는 그야말로 말하는 감자", count: 0 },
      { idx: 2, content: "나를 한문장에 담을 수 없음", count: 0 },
      {
        idx: 3,
        content: "안녕하세요? 디진다돈까스를 사랑하는 돈까스맨입니다.",
        count: 0,
      },
      {
        idx: 4,
        content: "안녕하세요! 낮에는 따사로운 햇살같은 남자입니다.",
        count: 0,
      },
      { idx: 5, content: "이시대의 로맨티스트", count: 0 },
      { idx: 6, content: "근데 이거 왜 하는거에요?", count: 0 },
    ],
    sumCount: 0,
  },
  {
    form: "versus",
    answer: [
      { idx: 1, content: "엄마", count: 56 },
      { idx: 2, content: "아빠", count: 32 },
    ],
    sumCount: 88,
  },
  {
    form: "word",
    answer: [
      { idx: 1, content: "감자", count: 5 },
      { idx: 2, content: "고구마", count: 2 },
      { idx: 3, content: "호랑나비", count: 7 },
      { idx: 4, content: "고양이", count: 10 },
      { idx: 5, content: "탄산수", count: 4 },
      { idx: 6, content: "문장형이 갑자기 들어오면", count: 6 },
    ],
    sumCount: 34,
  },
];

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
}

interface Props {
  voteInfo: VoteInfo;
  voteSumCount: number;
}

// 컴포넌트 시작
function Vresult({ voteInfo, voteSumCount }: Props) {
  const [data, setData] = useState(-1);
  const format = voteInfo.format;
  const type = voteInfo.type;

  // 워드클라우드 세팅
  const words = voteInfo.items
    ? voteInfo.items.map((el) => ({
        text: el.content as string,
        value: el.count as number,
      }))
    : [{ text: "", value: 0 }];
  const fontSizes = [20, 50] as MinMaxPair;
  const options = {
    fontSizes: fontSizes,
  };

  switch (format) {
    case "bar":
      if (type === "vertical") {
        return (
          <div className="realTimeCon">
            <div className="votePreviewBack">
              <div className="votePreview-barVer-con">
                {voteInfo.items ? (
                  voteInfo.items.map((el, idx) => (
                    <div key={idx} id="votePreview-barVer-bar">
                      <div className="barVer-itemName">{el.content}</div>
                      <div
                        className="barVer-itemBar"
                        style={makeRandomHeight(
                          el.count as number,
                          voteSumCount
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
                {voteInfo.items ? (
                  voteInfo.items.map((el, idx) => (
                    <div key={idx} id="votePreview-barHor-bar">
                      <div className="barHor-itemName">{el.content}</div>
                      <div
                        className="barHor-itemBar"
                        style={makeRandomWidth(
                          el.count as number,
                          voteSumCount
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
          {voteInfo.items ? (
            voteInfo.items.map((el, idx) => (
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
            <div>{voteInfo.items ? voteInfo.items[0].content : ""}</div>
            <div>vs</div>
            <div>{voteInfo.items ? voteInfo.items[1].content : ""}</div>
          </div>
        </div>
      );
    case "word":
      return <ReactWordcloud words={words} options={options} />;
    default:
      return <div>데이터 불러오기 실패</div>;
  }
}

export default Vresult;
