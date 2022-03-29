import axios from "axios";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { RootState, setUserInfo } from "../store";
import { useDispatch, useSelector } from "react-redux";
import "./MyPage.scss";

const serverURL: string = "http://localhost:8000";

function MyPage() {
  const [myPagePwd, setMyPagePwd] = useState<string>("");
  const [checkPwd, setCheckPwd] = useState<boolean>(false);
  const [myPageState, setMyPageState] = useState<boolean>(false);

  const myPage_onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMyPagePwd(e.target.value);
  };

  const userInfo = useSelector((state: RootState) => state.userInfo);
  console.log("리덕스유저인포", userInfo);

  const dispatch = useDispatch();

  const getUserInfo = async () => {
    try {
      const res = await axios.get(serverURL + "/user/" + userInfo._id);
      console.log("서버데이터 가져오랏!", res.data.data);
      if (res.status === 200) {
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

      {/* //? 일단 false 상태로 CSS 수정만해보자 */}
      {!checkPwd ? (
        <div className="outlet_wrap">
          <Outlet />
        </div>
      ) : (
        <div className="checkedPassword">
          <input
            type="password"
            name="password"
            onChange={myPage_onChangePassword}
          />
          <button onClick={() => getUserInfo()}>비밀번호 확인</button>
        </div>
      )}
    </div>
  );
}

export default MyPage;
