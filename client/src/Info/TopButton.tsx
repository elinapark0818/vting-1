import React, { useState, useEffect } from "react";
import "./TopButton.scss";
import { FaArrowUp } from "react-icons/fa";

function TopButton() {
  const [ScrollY, setScrollY] = useState(0);
  const [BtnStatus, setBtnStatus] = useState(false);

  const handleFollow = () => {
    setScrollY(window.pageYOffset);
    if (ScrollY > 300) {
      setBtnStatus(true);
    } else {
      setBtnStatus(false);
    }
  };

  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setScrollY(0);
    setBtnStatus(false);
  };

  useEffect(() => {
    const watch = () => {
      window.addEventListener("scroll", handleFollow);
    };
    watch();
    return () => {
      window.removeEventListener("scroll", handleFollow);
    };
  });

  return (
    <div className="topButton_wrap">
      <button
        className={BtnStatus ? "TopButton active" : "TopButton"}
        onClick={handleTop}
      >
        <FaArrowUp style={{ fontSize: "3em" }} />
      </button>
    </div>
  );
}

export default TopButton;
