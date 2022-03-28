import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, RootState } from "../../store/index";
import { useNavigate } from "react-router-dom";

const serverURL: string = "http://localhost:8000";

function Delete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalState, setModalState] = useState<boolean>(false);

  const openModal = () => {
    setModalState(true);
  };

  const closeModal = () => {
    setModalState(false);
  };

  const deleteUser = async () => {
    try {
      const res = await axios.delete(serverURL + "/user", {
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log("회원탈퇴완료===", res.data.data);
        // ? 로그아웃처리
        dispatch(setIsLogin(false));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {modalState && (
        <div>
          <button onClick={() => openModal()}>회원탈퇴</button>
          <div>
            <button onClick={() => closeModal()}>x</button>
            <p>정말 탈퇴하시겠습니까?</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Delete;
