import React, { useEffect, useState, useRef } from "react";
import ReactWordcloud, { MinMaxPair } from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import axios from "axios";
import { useParams } from "react-router-dom";

type IntervalFunction = () => unknown | void;

function useInterval(callback: IntervalFunction, delay: number) {
  const savedCallback = useRef<IntervalFunction | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function VoterRealtime() {
  const serverURL = "http://localhost:8000";
  const accessToken = localStorage.getItem("accessToken");
  const { code } = useParams();

  // 5초에 한 번씩 ajax 요청 (응답 덮어쓰기)
  useInterval(async () => {
    const response = await axios.get(`${serverURL}/vting/${code}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        withCredentials: true,
      },
    });
    if (response.status === 200) {
      console.log(response.data.data.items);
      // console.log("그냥 로그만");
    }
  }, 5000);

  return (
    <div className="votingBody">
      <div className="votingContent">
        <div>투표 결과 창</div>
      </div>
    </div>
  );
}

export default VoterRealtime;
