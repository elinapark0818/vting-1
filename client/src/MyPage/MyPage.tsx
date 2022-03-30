import axios from "axios";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

// import { useDispatch } from "react-redux";
import "./MyPage.scss";

const serverURL: string = "https://test.v-ting.net";

function MyPage() {
  const [myPagePwd, setMyPagePwd] = useState<string>("");
  // const [myPageState, setMyPageState] = useState<boolean>(false);

  const myPage_onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMyPagePwd(e.target.value);
  };

  // const dispatch = useDispatch();

  const [checkPwd, setCheckPwd] = useState<boolean>(false);

  const handlePasswordCheck = async () => {
    try {
      const res = await axios.post(`${serverURL}/user/check`);
      console.log("패스워드체크", res.data.message);
      if (res.data.message === "It doesn't match") {
        alert("비밀번호가 일치하지 않습니다.");
      } else {
        console.log("패스워드체크완료!", res.data.message);
        setCheckPwd(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="myPage_container">
      <div className="link_wrap">
        <Link to="" className="link_btn">
          회원정보 수정
        </Link>
        <Link to="delete" className="link_btn">
          회원탈퇴
        </Link>
      </div>

      {!checkPwd ? (
        <div className="outlet_wrap">
          <Outlet />
        </div>
      ) : (
        <div className="passwordCheck_container">
          <header className="passwordCheck_header">
            <h1>비밀번호 확인</h1>
          </header>
          <main className="passwordCheck_wrap">
            <h3> </h3>
            <input
              value={myPagePwd}
              type="password"
              name="password"
              onChange={myPage_onChangePassword}
            />
            {!myPagePwd && <div>! 비밀번호를 입력하세요.</div>}
          </main>
          <div className="passwordCheck_btnWrap">
            <button className="check_btn" onClick={handlePasswordCheck}>
              비밀번호 확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPage;
