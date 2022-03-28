import axios from "axios";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { RootState, setUserInfo } from "../store";
import { useDispatch, useSelector } from "react-redux";

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

  const btnTrigger = () => {
    dispatch(
      setUserInfo({
        nickname: "윤정",
        email: "test33@yof.com",
      })
    );
    console.log(userInfo);
  };

  // const getUserInfo = async () => {
  //   try{
  //     const res = await axios.get()
  //   } catch {

  //   }
  // }

  return (
    <div>
      <div className="link_wrap">
        <Link to="">회원정보 수정</Link>
        <Link to="delete">회원탈퇴</Link>
      </div>

      <div className="checkedPassword">
        <input
          type="password"
          name="password"
          onChange={myPage_onChangePassword}
        />
        <button onClick={() => btnTrigger()}>비밀번호 확인</button>
      </div>

      {checkPwd ? <Outlet /> : <div></div>}
    </div>
  );
}

export default MyPage;
