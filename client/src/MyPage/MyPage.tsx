import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../store/index";
import "./MyPage.scss";

const serverURL: string = "http://localhost:8000";

function MyPage() {
  // const userInfo = useSelector((state: RootState) => state.userInfo);
  const [myPagePwd, setMyPagePwd] = useState<string>("");

  const myPage_onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMyPagePwd(e.target.value);
  };

  const [checkPwd, setCheckPwd] = useState<boolean>(false);

  // * 패스워드 체크
  // todo: serverURL + "/user/check" { password: myPagePwd }, { withCredentials: true }
  const handlePasswordCheck = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.post(
        `${serverURL}/user/check`,
        {
          password: myPagePwd,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        }
      );

      if (res.status === 200 && res.data.message === "It doesn't match") {
        alert("비밀번호가 일치하지 않습니다.");
      }
      if (res.status === 200 && res.data.message === "Success verified") {
        setCheckPwd(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // * OAuth 로 로그인할 경우, provider 가 있고, 비밀번호가 없다.
  // todo: 비밀번호 확인 페이지로 가면 안된다.
  // todo: 유저정보 조회시, provider가 있다면 비밀번호 확인 상태를 true 로 해주자

  useEffect(() => {
    const getUserInfo = async () => {
      let accessToken = localStorage.getItem("accessToken");
      try {
        await axios
          .get(`${serverURL}/user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              withCredentials: true,
            },
          })
          .then((res) => {
            if (res.data.data.provider === undefined) {
              setCheckPwd(false);
            } else {
              setCheckPwd(true);
            }
          });
      } catch (err) {
        console.log(err);
      }
    };
    getUserInfo();
  }, []);

  return (
    <div className="myPage_container">
      {checkPwd ? (
        <div className="outlet_wrap">
          <Outlet />
        </div>
      ) : (
        <div className="passwordCheck_container">
          <header className="passwordCheck_header">
            <div className="passwordCheck_desc">
              <h1>비밀번호 확인</h1>
            </div>
          </header>

          <main className="passwordCheck_wrap">
            <input
              value={myPagePwd}
              type="password"
              name="password"
              onChange={myPage_onChangePassword}
              placeholder="비밀번호를 입력하세요."
            />
            <div className="passwordCheck_btnWrap">
              <button className="check_btn" onClick={handlePasswordCheck}>
                확인
              </button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default MyPage;
