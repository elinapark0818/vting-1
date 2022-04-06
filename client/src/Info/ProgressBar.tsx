import React, { useState, useEffect } from "react";
import "./ProgressBar.scss";

function ProgressBar() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    let handleScrollY = () => {
      const totalScroll: number = document.documentElement.scrollTop;
      const windowHeight: number =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollY: number = Math.floor((totalScroll / windowHeight) * 100);
      setScroll(scrollY);
    };
    window.addEventListener("scroll", handleScrollY);
    return () => {
      window.removeEventListener("scroll", handleScrollY);
    };
  });

  return (
    <>
      <div style={{ width: `${scroll}%` }} className="progressbar"></div>
    </>
  );
}

export default ProgressBar;
