import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin, RootState } from "../../store/index";

const serverURL: string = "http://localhost:8000";

function Delete() {
  const [checkPassword, setCheckPassword] = useState({
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let isUser = useSelector((state: RootState) => state.isLogin);
  let isLoginUser = isUser.login;
  console.log("isLoginUser===", isLoginUser);

  const delete_onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckPassword({ ...checkPassword, [name]: value });
  };

  const passwordCheck = async () => {
    try {
      const res = await axios.post(
        serverURL + "/user/check",
        {
          password: checkPassword.password,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        // * 확인처리 true 처리
        dispatch(setIsLogin(true));
        alert("비밀번호 맞음!");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deleteUser = async () => {
    try {
      const res = await axios.delete(serverURL + "/user", {
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log("회원탈퇴완료===", res.data.data);
        // ? 로그아웃처리
        dispatch(setIsLogin(false));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <input name="password" onChange={delete_onChangePassword} />
      <button onClick={() => passwordCheck()}>비밀번호 확인</button>
      <button onClick={() => deleteUser()}>회원탈퇴 버튼</button>
    </div>
  );
}

export default Delete;
