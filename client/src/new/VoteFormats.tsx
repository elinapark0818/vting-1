import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import { setFormat, setType } from "../store/index";
import vote_icon_barver from "../assets/vote_icons/vote_icon_barver.svg";
import vote_icon_barhor from "../assets/vote_icons/vote_icon_barhor.svg";
import vote_icon_open from "../assets/vote_icons/vote_icon_open.svg";
import vote_icon_versus from "../assets/vote_icons/vote_icon_versus.svg";
import vote_icon_word from "../assets/vote_icons/vote_icon_word.svg";
import AOS from "aos";
AOS.init();

function VoteFormats() {
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
        data-aos="flip-left"
        onClickCapture={(e) => {
          // e.stopPropagation();
          setFormatFromIcon(e);
        }}
      >
        <li
          id="barVer"
          className={`voteFormatIcon ${
            format === "bar" && type === "vertical" ? "active" : ""
          }`}
        >
          <img src={vote_icon_barver} alt="Bar vertical" id="barVer" />
        </li>
        <li
          id="barHor"
          className={`voteFormatIcon ${
            format === "bar" && type === "horizontal" ? "active" : ""
          }`}
        >
          <img src={vote_icon_barhor} alt="Bar horizontal" id="barHor" />
        </li>
        <li
          id="open"
          className={`voteFormatIcon ${format === "open" ? "active" : ""}`}
        >
          <img src={vote_icon_open} alt="OpenEnded" id="open" />
        </li>
        <li
          id="versus"
          className={`voteFormatIcon ${format === "versus" ? "active" : ""}`}
        >
          <img src={vote_icon_versus} alt="Versus" id="versus" />
        </li>
        <li
          id="word"
          className={`voteFormatIcon ${format === "word" ? "active" : ""}`}
        >
          <img src={vote_icon_word} alt="WordCloud" id="word" />
        </li>
      </ul>
    </div>
  );
}

export default VoteFormats;
