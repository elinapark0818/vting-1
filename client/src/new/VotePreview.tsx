import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setType,
  setItems,
  setMultiple,
  setManyTimes,
  RootState,
} from "../store/index";
import { Oval } from "react-loader-spinner";

function VotePreview() {
  const newVoteFormat = useSelector(
    (state: RootState) => state.makeNewVote.format
  );

  switch (newVoteFormat) {
    case "barVer":
      return <BarVertical />;
    case "barHor":
      return <BarHorizontal />;
    case "open":
      return <OpenEnded />;
    case "versus":
      return <Versus />;
    case "word":
      return <WordCloud />;
    default:
      return (
        <div className="votePreviewCon">
          <Oval color="#00BFFF" height={80} width={80} />
        </div>
      );
  }
}

function BarVertical() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const voteItems = newVote.items;
  const rand_0_99 = Math.floor(Math.random() * 100);
  const heightStyle: React.CSSProperties = {
    height: rand_0_99,
  };
  return (
    <div className="votePreviewCon">
      세로 바 그래프(미리보기)
      <br />
      설문명 : {newVote.title}
      <br />
      <br />
      <div className="votePreviewBack">
        <div className="votePreview-barVer-con">
          {voteItems.map((el, idx) => (
            <div key={idx} id="votePreview-barVer-bar">
              <div className="barVer-itemName">{el.content}</div>
              <div className="barVer-itemBar" style={heightStyle}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BarHorizontal() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const voteItems = newVote.items;
  const rand_0_99 = Math.floor(Math.random() * 100);
  const heightStyle: React.CSSProperties = {
    width: rand_0_99,
  };
  return (
    <div className="votePreviewCon">
      가로 바 그래프(미리보기)
      <br />
      설문명 : {newVote.title}
      <br />
      <br />
      <div className="votePreviewBack">
        <div className="votePreview-barHor-con">
          {voteItems.map((el, idx) => (
            <div key={idx} id="votePreview-barHor-bar">
              <div className="barHor-itemName">{el.content}</div>
              <div className="barHor-itemBar" style={heightStyle}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OpenEnded() {
  return <div className="votePreviewCon">말풍선(미리보기)</div>;
}

function Versus() {
  return <div className="votePreviewCon">대결(미리보기)</div>;
}

function WordCloud() {
  return <div className="votePreviewCon">워드클라우드(미리보기)</div>;
}

export default VotePreview;
