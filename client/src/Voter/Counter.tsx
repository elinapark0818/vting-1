import React from "react";
const { useState, useEffect, useRef } = React;

type IntervalFunction = () => unknown | void;

interface Props {
  overtime: number;
}

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

function Counter({ overtime }: Props) {
  const [time, setTime] = useState(overtime || 0);
  useEffect(() => {
    setTime(overtime);
  }, [overtime]);
  useInterval(() => {
    if (time > 0) setTime(time - 1);
  }, 60000);
  return (
    <div>
      {overtime
        ? `설문 자동 종료까지 ${time}분 남았습니다.`
        : "만료된 설문입니다."}
    </div>
  );
}

export default Counter;
