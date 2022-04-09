import React from "react";
// import { SiGithub } from "react-icons/si";
import "./Footer.scss";
import Logo from "../assets/yof_logo-17.jpg";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <div className="footer_container">
      <main className="footer_wrap">
        <div className="footer_team">
          <div className="footer_yof">
            <img
              src={Logo}
              alt="YOf"
              style={{ width: "6em", borderRadius: "50%", marginRight: "1em" }}
            />
          </div>
          <div className="footer_yof">
            <div>TEAM : YOF</div>
            <p>Project : Vting</p>
            <p>Period : 22.03.14~22.04.08</p>
            <div
              className="github"
              onClick={() =>
                window.open("https://github.com/codestates/vting", "_blank")
              }
            >
              Go to github <FaExternalLinkAlt style={{ width: "0.7em" }} />
            </div>
          </div>

          <div className="footer_yof">
            <p>김영빈(팀장)</p>
            <p>Full-Stack</p>
            <p>bin11788@gmail.com</p>
            <div
              className="github"
              onClick={() =>
                window.open("https://github.com/overflowbin", "_blank")
              }
            >
              OverFlowBIN{" "}
              <FaGithub style={{ width: "1.2em", color: "black" }} />
            </div>
          </div>

          <div className="footer_yof">
            <p>박성경(팀원)</p>
            <p>Full-Stack</p>
            <p>stzard@gmail.com</p>
            <div
              className="github"
              onClick={() =>
                window.open("https://github.com/biblepark", "_blank")
              }
            >
              Bible Park <FaGithub style={{ width: "1.2em", color: "black" }} />
            </div>
          </div>

          <div className="footer_yof">
            <p>이초록(팀원)</p>
            <p>Back-End</p>
            <p>evenabee@gmail.com</p>
            <div
              className="github"
              onClick={() => window.open("https://github.com/2cho6", "_blank")}
            >
              2cho6 <FaGithub style={{ width: "1.2em", color: "black" }} />
            </div>
          </div>

          <div className="footer_yof">
            <p>박윤정(팀원)</p>
            <p>Front-End</p>
            <p>elinapark0818@gmail.com</p>
            <div
              className="github"
              onClick={() =>
                window.open("https://github.com/elinapark0818", "_blank")
              }
            >
              Elina Park <FaGithub style={{ width: "1.2em", color: "black" }} />
            </div>
          </div>
        </div>
      </main>
      <footer className="footer_text">
        Copyright© 2022 YOF all rights reserved
      </footer>
    </div>
  );
}

export default Footer;
