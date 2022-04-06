import React from "react";
import { SiGithub } from "react-icons/si";
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer_container">
      <main className="footer_wrap">
        <div className="footer_team">
          <div className="footer_yof">
            <p>김영빈</p>
            <p>팀장</p>
            <p>Full-Stack</p>
            <div className="github">
              <SiGithub
                onClick={() =>
                  window.open("https://github.com/overflowbin", "_blank")
                }
              />
            </div>
          </div>
          <div className="footer_yof">
            <p>박성경</p>
            <p>팀장</p>
            <p>Full-Stack</p>
            <div className="github">
              <SiGithub
                onClick={() =>
                  window.open("https://github.com/biblepark", "_blank")
                }
              />
            </div>
          </div>
          <div className="footer_yof">
            <p>이초록</p>
            <p>팀원</p>
            <p>Back-End</p>
            <div className="github">
              <SiGithub
                onClick={() =>
                  window.open("https://github.com/2cho6", "_blank")
                }
              />
            </div>
          </div>
          <div className="footer_yof">
            <p>박윤정</p>
            <p>팀원</p>
            <p>Front_End</p>
            <div className="github">
              <SiGithub
                onClick={() =>
                  window.open("https://github.com/elinapark0818", "_blank")
                }
              />
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
