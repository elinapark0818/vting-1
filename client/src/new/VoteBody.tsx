import React from "react";
import VotePreview from "./VotePreview";
import VoteMaker from "./VoteMaker";
import "./new.scss";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";

function VoteBody() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteFormat = newVote.format;

  if (newVoteFormat) {
    return (
      <div className="vote-body">
        <VoteMaker />
        <VotePreview />
      </div>
    );
  } else {
    return (
      <div className="vote-body">
        <div className="vote-info">
          설문 타입을 선택하고
          <br />
          5초만에 설문을 만들어보세요!
        </div>
      </div>
    );
  }
}

export default VoteBody;
