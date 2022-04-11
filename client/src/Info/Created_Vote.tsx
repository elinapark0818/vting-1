import React from "react";
import { useNavigate } from "react-router-dom";
import "./Created_Vote.scss";

function Created_Vote() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="move_to_new_wrap">
        <button onClick={() => navigate("/new")} className="move_to_new">
          나만의 V-ting 만들러 가기!
        </button>
      </div>
    </div>
  );
}

export default Created_Vote;
