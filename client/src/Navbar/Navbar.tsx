import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import Logo from "../assets/vt_logo_1.png";
import Profile from "../assets/yof_logo-17.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setIsLogin } from "../store/index";
import axios from "axios";

const serverURL: string = "https://test.v-ting.net";

function Navbar() {
  // * 로그인상태
  let isLoginState = useSelector((state: RootState) => state.isLogin);
  let loginState = isLoginState.login;

  console.log("loginState===", loginState);

  // ? 처음 렌더링할때, 로그인상태 useEffect로 토큰여부에 따라 판단한다.
  useEffect(() => {
    if (document.cookie.includes("accessToken")) settingLogin();
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ? 로그인 핸들링
  const settingLogin = () => {
    setIsLogin(true);
  };
  // ? 로그아웃 핸들링
  const handleLogout = async () => {
    try {
      const res = await axios.get(serverURL + "/session", {});
      if (res.status === 200) {
        dispatch(setIsLogin(false));
        console.log("로그아웃됨===", res.data);
        // ? 로그아웃되면 일단 구분하려고 홈으로 이동시킴
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ? 모달 끄기 핸들링
  // const isCloseModal = () => {
  //   navigate(-1);
  // };

  // todo : 네비게이션 바 버튼 CSS

  return (
    <div className="container">
      <div className="NavLeft">
        <Link to="/">
          <img src={Logo} alt="logo" style={{ width: "150px" }} />
        </Link>
      </div>
      {loginState ? (
        <div className="NavRight">
          <Link className="nav-link link" to="/">
            Home
          </Link>
          <Link className="nav-link link" to="dashboard">
            Dashboard
          </Link>
          <Link className="nav-link link" to="v">
            Vote
          </Link>

          <div className="profile">
            <div>
              <img
                src={Profile}
                alt="profile_img"
                style={{ width: "60px", borderRadius: "50%" }}
              />
              <ul className="subMenu">
                <div className="subMenuLi">
                  <Link className="nav-link link" to="myPage">
                    MyPage
                  </Link>
                </div>
                <div className="nav-link link" onClick={() => handleLogout()}>
                  SingOut
                </div>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="NavRight">
          <Link className="nav-link link" to="/">
            Home
          </Link>
          <Link className="nav-link link" to="v">
            Vote
          </Link>
          <Link className="nav-link link" to="signIn">
            SignIn
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
