import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, RootState } from "../../store/index";
import { useNavigate } from "react-router-dom";
import "./Delete.scss";

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
    // <div>
    //   {modalState && (
    //     <div>
    //       <button onClick={() => openModal()}>회원탈퇴</button>
    //       <div>
    //         <button onClick={() => closeModal()}>x</button>
    //         <p>정말 탈퇴하시겠습니까?</p>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="delete_container">
      <header className="delete_header">
        <h1>회원탈퇴</h1>
      </header>

      <main className="delete_wrap">
        <h1>프로필 : "{"프로필"}"</h1>
        <h1>닉네임 : "{"닉네임"}"</h1>
        <h1>이메일 : "{"이메일"}"</h1>
      </main>

      <div className="delete_btnWrap">
        <h1>정말 탈퇴하시겠습니까?</h1>
        <button className="delete_btn">탈퇴하기</button>
      </div>
    </div>
  );
}

export default Delete;
