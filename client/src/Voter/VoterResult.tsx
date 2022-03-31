import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./voter.scss";

function VoterResult() {
  const [result, setResult] = useState(false);
  const { code } = useParams();
  useEffect(() => {
    if (code) setResult(true);
  }, [code]);

  return (
    <div>
      <div className="votingProfile">YOF님의 설문입니다.</div>
      <div className="votingTitle">엄마가 좋아 아빠가 좋아</div>
      <div className="votingContent">
        <div>엄마</div>
        <div>아빠</div>
      </div>
      <div className="voteCodeButton vtingButton">투표 결정</div>
    </div>
  );
}

export default VoterResult;
