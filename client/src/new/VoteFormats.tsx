import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import { setFormat, setType } from "../store/index";
import { BiPoll, BiChat, BiCloud, BiHorizontalCenter } from "react-icons/bi";

function VoteFormats() {
  const [clicked, setClicked] = useState<string>("");
  const dispatch = useDispatch();

  // 아이콘 클릭여부에 따라 클릭된 아이콘으로 format을 세팅해주는 함수입니다.
  const setFormatFromIcon = (e: React.MouseEvent<HTMLUListElement>) => {
    let format = e.target as Element;
    if (format.id === "barVer") {
      dispatch(setFormat("bar"));
      dispatch(setType("vertical"));
    } else if (format.id === "barHor") {
      dispatch(setFormat("bar"));
      dispatch(setType("horizontal"));
    } else dispatch(setFormat(format.id));
  };

  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const format = newVote.format;
  const type = newVote.type;

  return (
    <div className="voteFormatsCon">
      <ul
        onClickCapture={(e) => {
          setFormatFromIcon(e);
        }}
      >
        <li
          id="barVer"
          className={`voteFormatIcon ${
            format === "bar" && type === "vertical" ? "active" : ""
          }`}
        >
          <BiPoll />
        </li>
        <li
          id="barHor"
          className={`voteFormatIcon ${
            format === "bar" && type === "horizontal" ? "active" : ""
          }`}
        >
          <BiPoll />
        </li>
        <li
          id="open"
          className={`voteFormatIcon ${format === "open" ? "active" : ""}`}
          onClick={() => setClicked("curr")}
        >
          <BiChat />
        </li>
        <li
          id="versus"
          className={`voteFormatIcon ${format === "versus" ? "active" : ""}`}
          onClick={() => setClicked("curr")}
        >
          <BiHorizontalCenter />
        </li>
        <li
          id="word"
          className={`voteFormatIcon ${format === "word" ? "active" : ""}`}
          onClick={() => setClicked("curr")}
        >
          <BiCloud />
        </li>
      </ul>
    </div>
  );
}

export default VoteFormats;
