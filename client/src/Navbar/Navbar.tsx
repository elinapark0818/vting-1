import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import Logo from "../assets/vt_logo_1.png";
import Profile from "../assets/yof_logo-17.jpg";

interface Props {
  text: string;
}

function Navbar({ text }: Props) {
  return (
    <div className="container">
      <div className="NavLeft">
        <Link to="/">
          <img src={Logo} alt="logo" style={{ width: "150px" }} />
        </Link>
      </div>
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
            <li className="subMenuLi">
              <Link className="subMenuLink" to="signIn">
                SignIn
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

Navbar.defaultProps = {
  text: "This is Navbar!",
};

export default Navbar;
