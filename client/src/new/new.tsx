import React from "react";
import VoteBody from "./VoteBody";
import VoteFormats from "./VoteFormats";
import "./new.scss";

function NewVote() {
  return (
    <div className="newVoteCon">
      <VoteFormats />
      <VoteBody />
    </div>
  );
}

export default NewVote;
