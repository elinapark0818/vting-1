import React from "react";
import VotePreview from "./VotePreview";
import VoteMaker from "./VoteMaker";
import "./new.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";

function VoteBody() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteFormat = newVote.format;

  const sendNewVote = () => {
    switch (newVoteFormat) {
      case "bar":
        const barformat = {
          title: newVote.title,
          format: newVote.format,
          type: newVote.type,
          items: newVote.items,
          manytimes: newVote.manytimes,
          multiple: newVote.multiple,
        };
        console.log("막대그래프 포맷으로 생성 시", barformat);
        return;
      case "open":
        const openformat = {
          title: newVote.title,
          format: newVote.format,
          manytimes: newVote.manytimes,
        };
        console.log("대화 포맷으로 생성 시", openformat);
        return;
      case "versus":
        const versusformat = {
          title: newVote.title,
          format: newVote.format,
          items: newVote.items,
          manytimes: newVote.manytimes,
          multiple: newVote.multiple,
        };
        console.log("대결 포맷으로 생성 시", versusformat);
        return;
      case "word":
        const wordformat = {
          title: newVote.title,
          format: newVote.format,
          manytimes: newVote.manytimes,
        };
        console.log("워드클라우드 포맷으로 생성 시", wordformat);
        return;
      default:
        console.log("오류 발생 : 투표 포맷이 선택되지 않음");
        return;
    }
  };

  if (newVoteFormat) {
    return (
      <div className="vote-body">
        <div className="vote-making">
          <VoteMaker />
          <VotePreview />
        </div>
        <div className="vote-button">
          <button onClick={() => sendNewVote()}>투표 생성하기</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="vote-body">
        <div className="vote-making">
          <VoteMaker />
          <VotePreview />
        </div>
      </div>
    );
  }
}

export default VoteBody;
