import React from "react";
const { useState, useEffect, useRef } = React;

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

function Counter() {
  const [time, setTime] = useState(60);
  useInterval(() => {
    if (time > 0) setTime(time - 1);
  }, 1000);
  return <div>{time}</div>;
}

export default Counter;
