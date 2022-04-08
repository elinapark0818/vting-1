import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, RootState, setUserInfo } from "../../store/index";
import { useNavigate } from "react-router-dom";
import "./Delete.scss";
import vtCry from "../../assets/vt_cry.png";

const serverURL: string = process.env.REACT_APP_SERVER_URL as string;

function Delete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state: RootState) => state.userInfo);

  useEffect(() => {
    const getUserInfo = async () => {
      let accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${serverURL}/user`, {
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
        console.log(res.data.message);
        localStorage.removeItem("accessToken");
        alert("회원탈퇴가 완료되었습니다.");
        dispatch(setIsLogin(false));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(serverURL + "/session", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
        },
      });
      if (res.status === 200) {
        const token = res.data.data.accessToken;
        localStorage.setItem("accessToken", token);
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
        <div className="delete_header_desc">
          <h3> {userInfo.nickname} 님, 안녕하세요!</h3>
        </div>
      </header>

      <main className="delete_wrap">
        <nav className="userInfo_nav">
          <button
            className="userInfo_navBtn"
            onClick={() => navigate("/myPage")}
          >
            회원정보 관리
          </button>
          <button
            className="userInfo_navBtn_active"
            onClick={() => navigate("/myPage/delete")}
          >
            회원탈퇴 관리
          </button>
        </nav>

        <div className="delete_profile">
          <img
            src={vtCry}
            alt="cry_img"
            style={{ width: "300px", marginTop: "1em" }}
          />

          <div className="delete_userInfo">
            <h1>닉네임 : {userInfo.nickname}</h1>
            <h1>이메일 : {userInfo.email}</h1>
          </div>

          <div className="delete_btnWrap">
            <button className="delete_btn" onClick={openModal}>
              탈퇴하기
            </button>
          </div>
        </div>
      </main>

      {modalState ? (
        <div className="deleteModal_container">
          <div className="deleteModal_background">
            <div className="deleteModal_modal">
              <button className="deleteModal_closeBtn" onClick={closeModal}>
                X
              </button>
              <div className="deleteModal_desc">
                <h3>
                  회원정보가 삭제되면 복구되지 않습니다.
                  <br />
                  회원탈퇴를 진행하시겠습니까?
                </h3>
              </div>
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
