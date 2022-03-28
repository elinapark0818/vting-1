import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import Logo from "../assets/vt_logo_1.png";
import Profile from "../assets/yof_logo-17.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setIsLogin } from "../store/index";
import axios from "axios";

const serverURL: string = "http://localhost:8000";

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

  return (
    <div className="container">
      <div className="NavLeft">
        <Link to="/">
          <img src={Logo} alt="logo" style={{ width: "150px" }} />
        </Link>
      </div>
      {loginState ? (
        <div className="NavRight">
          <Link className="link" to="/">
            Home
          </Link>
          <Link className="link" to="dashboard">
            Dashboard
          </Link>
          <Link className="link" to="v">
            Vote
          </Link>

          <div className="profile">
            <img
              src={Profile}
              alt="profile_img"
              style={{ width: "60px", borderRadius: "50%" }}
            />
            <ul className="subMenu">
              <li className="subMenuLi">
                <Link className="subMenuLink" to="myPage">
                  MyPage
                </Link>
              </li>
              <li></li>
              <li className="subMenuLink" onClick={() => handleLogout()}>
                SingOut
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="NavRight">
          <Link className="link" to="/">
            Home
          </Link>
          <Link className="link" to="v">
            Vote
          </Link>
          <Link className="subMenuLink" to="signIn">
            SignIn
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
