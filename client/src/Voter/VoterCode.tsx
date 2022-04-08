import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./voter.scss";
import vtinglogo from "../assets/vt_logo_2.png";

function VoterCode() {
  const [voteCode, setVoteCode] = useState("");

  return (
    <>
      <div className="voteCodeVtingLogo">
        <img src={vtinglogo} alt="vting_logo" />
      </div>
      <div className="voteCodeInput">
        <input
          value={voteCode}
          onChange={(e) => setVoteCode(e.target.value)}
          placeholder="접속 코드 6자리를 입력하세요."
        ></input>
      </div>
      <Link to={"/" + voteCode}>
        <div className="voteCodeButton vtingButton">Vting 접속하기!</div>
      </Link>
    </>
  );
}

export default VoterCode;
