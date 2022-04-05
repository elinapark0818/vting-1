import React, { useEffect, useState } from "react";
import ReactWordcloud, { MinMaxPair } from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import vtinglogo from "../assets/vt_logo_2.png";

function VotePreview() {
  const newVoteFormat = useSelector(
    (state: RootState) => state.makeNewVote.format
  );

  switch (newVoteFormat) {
    case "bar":
      return <Bar />;
    case "open":
      return <OpenEnded />;
    case "versus":
      return <Versus />;
    case "word":
      return <WordCloud />;
    default:
      return (
        <div className="votePreviewCon">
          <img src={vtinglogo} className="vting-logo" alt="vting-logo" />
        </div>
      );
  }
}

function Bar() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const voteItems = newVote.items;
  const type = newVote.type;

  const [randomNums, setRandomNums] = useState<number[]>([90]);

  useEffect(() => {
    let newNums: number[] = [];
    for (let i = 0; i < voteItems.length; i++) {
      newNums.push(Math.floor(Math.random() * 100));
    }
    setRandomNums(newNums);
  }, [voteItems]);

  const makeRandomHeight = (idx: number): React.CSSProperties => {
    let heightProprety = { height: randomNums[idx] + "%" };
    return heightProprety;
  };
  const makeRandomWidth = (idx: number): React.CSSProperties => {
    let heightProprety = { width: randomNums[idx] + "%" };
    return heightProprety;
  };

  switch (type) {
    case "vertical":
      return (
        <div className="votePreviewCon">
          <div className="votePreview">
            <div className="votePreviewTitle">
              {newVote.title || "설문 제목"}
            </div>
            <div className="votePreviewBack">
              <div className="votePreview-barVer-con">
                {voteItems.map((el, idx) => (
                  <div key={idx} id="votePreview-barVer-bar">
                    <div className="barVer-itemName">{el.content}</div>
                    <div
                      className="barVer-itemBar"
                      style={makeRandomHeight(el.idx)}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case "horizontal":
      return (
        <div className="votePreviewCon">
          <div className="votePreviewTitle">{newVote.title || "설문 제목"}</div>
          <div className="votePreviewBack">
            <div className="votePreview-barHor-con">
              {voteItems.map((el, idx) => (
                <div key={idx} id="votePreview-barHor-bar">
                  <div className="barHor-itemName">{el.content}</div>
                  <div
                    className="barHor-itemBar"
                    style={makeRandomWidth(idx)}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return <></>;
  }
}

function OpenEnded() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);

  return (
    <div className="votePreviewCon">
      <div className="votePreviewTitle">{newVote.title || "설문 제목"}</div>
      <div className="votePreviewBack">
        <div className="openItems">
          <div className="openItem">이것은 예시 답변입니다.</div>
          <div className="openItem">
            다양한 길이의 주관식 답변을 박스형태로 받을 수 있습니다.
          </div>
          <div className="openItem">
            답변은 이런식으로 하나씩 쌓이게 됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}

function Versus() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);

  return (
    <div className="votePreviewCon">
      <div className="votePreviewTitle">{newVote.title || "설문 제목"}</div>
      <div className="votePreviewBack">
        <div className="versusItemCon">
          <div className="versusItem">
            {newVote.items[0] ? newVote.items[0].content : ""}
          </div>
          <div className="versusVs">vs</div>
          <div className="versusItem">
            {newVote.items[1] ? newVote.items[1].content : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

function WordCloud() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);

  const words = [
    {
      text: "이것은",
      value: 300,
    },
    {
      text: "예시",
      value: 320,
    },
    {
      text: "화면",
      value: 295,
    },
    {
      text: "입니다",
      value: 280,
    },
  ];

  const fontSizes = [20, 50] as MinMaxPair;

  const options = {
    fontSizes: fontSizes,
  };

  return (
    <div className="votePreviewCon">
      <div className="votePreviewTitle wordTitle">
        {newVote.title || "설문 제목"}
      </div>
      <div className="votePreviewBack wordBack">
        <ReactWordcloud words={words} options={options} />
      </div>
    </div>
  );
}

export default VotePreview;
