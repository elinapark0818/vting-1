import React from "react";
import VoteMaker from "./VoteMaker";
import VotePreview from "./VotePreview";
import VoteFormats from "./VoteFormats";
import "./new.scss";

function NewVote() {
  return (
    <div className="newVoteCon">
      <VoteFormats />
      <VoteMaker />
      <VotePreview />
    </div>
  );
}

export default NewVote;
