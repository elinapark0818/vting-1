import React from "react";
import { useDispatch } from "react-redux";
import { setFormat } from "../store/index";
import { BiPoll, BiChat, BiCloud, BiHorizontalCenter } from "react-icons/bi";

function VoteFormats() {
  const dispatch = useDispatch();

  // 아이콘 클릭여부에 따라 클릭된 아이콘으로 format을 세팅해주는 함수입니다.
  const setFormatFromIcon = (e: React.MouseEvent<HTMLUListElement>) => {
    let format = e.target as Element;
    dispatch(setFormat(format.id));
  };

  return (
    <div className="voteFormatsCon">
      <ul
        onClickCapture={(e) => {
          setFormatFromIcon(e);
        }}
      >
        <li id="barVer" className="voteFormatIcon">
          <BiPoll />
        </li>
        <li id="barHor" className="voteFormatIcon">
          <BiPoll />
        </li>
        <li id="open" className="voteFormatIcon">
          <BiChat />
        </li>
        <li id="versus" className="voteFormatIcon">
          <BiHorizontalCenter />
        </li>
        <li id="word" className="voteFormatIcon">
          <BiCloud />
        </li>
      </ul>
    </div>
  );
}

export default VoteFormats;
