import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, RootState, setUserInfo } from "../../store/index";
import { useNavigate } from "react-router-dom";
import "./Delete.scss";

const serverURL: string = "http://localhost:8000";

function Delete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state: RootState) => state.userInfo);

  console.log("안되나===", userInfo);

  useEffect(() => {
    const getUserInfo = async () => {
      let accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${serverURL}/user/${userInfo._id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        });
        if (res.status === 200) {
          setUserInfo({
            _id: res.data.data._id,
            nickname: res.data.data.nickname,
            email: res.data.data.email,
            image: res.data.data.image,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUserInfo();
  }, []);

  const [modalState, setModalState] = useState<boolean>(false);

  const openModal = () => {
    setModalState(true);
  };

  const closeModal = () => {
    setModalState(false);
  };

  const deleteUser = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.delete(serverURL + "/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
        },
      });

      if (res.status === 200) {
        localStorage.setItem("accessToken", res.data.data.accessToken);
        console.log("회원탈퇴완료===", res.data.data);
        alert("회원탈퇴가 완료되었습니다.");
        // ? 로그아웃처리
        dispatch(setIsLogin(false));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="delete_container">
      <header className="delete_header">
        <h1>회원탈퇴</h1>
      </header>

      <main className="delete_wrap">
        {/* <h1>프로필 : {getUserInfo.image}</h1> */}
        <h1>_id 나와라{userInfo._id}</h1>
        <h1>닉네임 : {userInfo.nickname}</h1>
        <h1>이메일 : {userInfo.email}</h1>
      </main>

      <div className="delete_btnWrap">
        <h1>정말 탈퇴하시겠습니까?</h1>
        <button className="delete_btn" onClick={openModal}>
          탈퇴하기
        </button>
      </div>
      {modalState ? (
        <div className="deleteModal_container">
          <div className="deleteModal_background">
            <div className="deleteModal_modal">
              <button className="closeBtn" onClick={closeModal}>
                X
              </button>
              <h3>
                회원정보가 삭제되면 복구되지 않습니다.
                <br />
                회원탈퇴를 진행하시겠습니까?
              </h3>
              <div className="btnWrap">
                <button className="delete_ok" onClick={() => deleteUser()}>
                  확인
                </button>
                <button className="delete_cancel" onClick={closeModal}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Delete;
