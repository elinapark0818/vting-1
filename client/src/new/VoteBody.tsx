import React from "react";
import VotePreview from "./VotePreview";
import VoteMaker from "./VoteMaker";
import "./new.scss";

function VoteBody() {
  return (
    <div className="vote-body">
      <div className="vote-making">
        <VoteMaker />
        <VotePreview />
      </div>
      <div className="vote-button">
        <button>투표 생성하기</button>
      </div>
    </div>
  );
}

export default VoteBody;
