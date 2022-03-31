import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import Logo from "../assets/vt_logo_1.png";
import Profile from "../assets/yof_logo-17.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setIsLogin } from "../store/index";
import axios from "axios";

const serverURL: string = "http://localhost:8000";

function Navbar() {
  const location = useLocation();
  // console.log(location);

  useEffect(() => {
    console.log("페이지 바뀜");
  }, [location]);

  // * 로그인상태
  let isLoginState = useSelector((state: RootState) => state.isLogin);
  let loginState = isLoginState.login;

  // * 페이지 이동시마다 리렌더링
  const location = useLocation();

  // ? 처음 렌더링할때, 로그인상태 useEffect로 토큰여부에 따라 판단한다.
  useEffect(() => {
    console.log("넵바리렌더링==");
    if (document.cookie.includes("accessToken")) {
      settingLogin();
    }
  }, [location]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const userInfo = useSelector((state: RootState) => state.userInfo);

  // ? 로그인 핸들링
  const settingLogin = () => {
    setIsLogin(true);
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
        localStorage.setItem("accessToken", res.data.data.accessToken);
        dispatch(setIsLogin(false));
        navigate("/");
        alert("로그아웃 되었습니다.");
      }
    } catch (err) {
      console.log(err);
    }
  };

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
