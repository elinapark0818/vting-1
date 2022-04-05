import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";
import Logo from "../assets/vt_logo_1.png";
import Profile from "../assets/yof_logo-17.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setIsLogin, setUserInfo } from "../store/index";
import axios from "axios";

interface User {
  email: string;
  nickname: string;
}

const serverURL: string = "http://localhost:8000";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();
  // * 로그인상태
  let isLoginState = useSelector((state: RootState) => state.isLogin);
  let loginState = isLoginState.login;

  const userInfo = useSelector((state: RootState) => state.userInfo);
  // console.log("유저인포이메일", userInfo);

  const [user, setUser] = useState<User>({ email: "", nickname: "" });

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      settingLogin();
    }
    NavbarUserInfo();
  }, [location]);

  const NavbarUserInfo = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      await axios
        .get(`${serverURL}/auth`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setUser({
              email: res.data.data.user_id,
              nickname: res.data.data.nickname,
            });

            Object.assign(
              {},
              userInfo,
              res.data.data.user_id,
              res.data.data.nickname
            );
            // userInfo.email = res.data.data.user_id;
            // userInfo.nickname = res.data.data.nickname;
            // console.log("리덕스이메일", userInfo.email);
            // console.log("리덕스닉네임", userInfo.nickname);
          } else {
            console.error("400 Error");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  // ? 로그인 핸들링
  const settingLogin = () => {
    dispatch(setIsLogin(true));
  };
  // ? 로그아웃 핸들링
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
        // console.log("로그아웃성공===");
        const token = res.data.data.accessToken;
        localStorage.setItem("accessToken", token);
        dispatch(setIsLogin(false));
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
          <Link className="nav-link link" to="new">
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
                  <div>{user.nickname}님</div>
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
          <Link className="nav-link link" to="new">
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
