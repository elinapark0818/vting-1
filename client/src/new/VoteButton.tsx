import React from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setRestart } from "../store/index";

function VoteButton() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const isLogin = useSelector((state: RootState) => state.isLogin);
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteFormat = newVote.format;

  const alert = useAlert();
  const dispatch = useDispatch();

  const serverURL = "http://localhost:8000";

  const sendNewVote = async () => {
    if (isLogin.login) {
      const sendBody = loginVoteBody();
      const accessToken = localStorage.getItem("accessToken");

      try {
        const res = await axios.post(serverURL + "/vting", sendBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        });
        if (res.status === 201) {
          dispatch(setRestart("delete all!!"));
          console.log(newVote);
          navigate(`/v/${res.data.data.url}`);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      alert.show();
    }
  };

  const loginVoteBody = () => {
    let sendVoteBody = {};

    switch (newVoteFormat) {
      case "bar":
        sendVoteBody = {
          title: newVote.title,
          format: newVote.format,
          type: newVote.type,
          items: newVote.items,
          manytimes: newVote.manytimes,
          multiple: newVote.multiple,
          user_id: userInfo.email,
        };
        return sendVoteBody;
      case "open":
        sendVoteBody = {
          title: newVote.title,
          format: newVote.format,
          manytimes: newVote.manytimes,
          user_id: userInfo.email,
        };
        return sendVoteBody;
      case "versus":
        sendVoteBody = {
          title: newVote.title,
          format: newVote.format,
          items: newVote.items,
          manytimes: newVote.manytimes,
          multiple: newVote.multiple,
          user_id: userInfo.email,
        };
        return sendVoteBody;
      case "word":
        sendVoteBody = {
          title: newVote.title,
          format: newVote.format,
          manytimes: newVote.manytimes,
          user_id: userInfo.email,
        };
        return sendVoteBody;
      default:
        console.log("오류 발생 : 투표 포맷이 선택되지 않음");
        return;
    }
  };

  return (
    <div className="vote-button">
      <button className="vtingButton" onClick={() => sendNewVote()}>
        투표 생성하기
      </button>
    </div>
  );
}

export default VoteButton;
