import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import Logo from "../assets/vt_logo_1.png";
import Profile from "../assets/yof_logo-17.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../store/index";
import axios from "axios";

interface IsLogin {
  isLogin: boolean;
}

const serverURL: string = "http://localhost:8000";

function Navbar() {
  const [isLogin, setIsLogging] = useState<IsLogin>({ isLogin: false });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   try {
  //     const res = await axios.post(
  //       serverURL + "/session",
  //       {},
  //       { withCredentials: true }
  //     );
  //     if (res.status === 200) {
  //       dispatch(setIsLogin(true));
  //       // dispatch(setIsUser(true))
  //       console.log("로그인 성공===", res.data);
  //       setIsLogging({ isLogin: true });
  //       navigate("/dashboard");
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const settingLogin = () => {
    setIsLogin(true);
  };

  useEffect(() => {
    if (document.cookie.includes("accessToken")) settingLogin();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.get(serverURL + "/session", {});
      if (res.status === 200) {
        dispatch(setIsLogin(false));
        console.log("로그아웃됨===", res.data);
        setIsLogging({ isLogin: false });
        navigate("/");
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
      {isLogin ? (
        <div className="NavRight">
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
              <li>
                <Link className="subMenuLink" to="signIn">
                  SignIn
                </Link>
              </li>
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
        </div>
      )}
    </div>
  );
}

export default Navbar;
