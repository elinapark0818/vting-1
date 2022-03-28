import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLogin } from "../store/index";
import "./SignIn.scss";

interface User {
  email: string;
  password: string;
}

// interface IsUser {
//   isLogin: boolean;
// }

const serverURL: string = "http://localhost:8000";

function SignIn() {
  const [user, setUser] = useState<User>({ email: "", password: "" });
  // const [isUser, setIsUser] = useState<IsUser>({ isLogin: false });

  const dispatch = useDispatch();

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target); // * HTMLInputElement 가 통째로 들어온다
    const { name, value } = e.target;
    // console.log(e.target.name); // * email
    setUser({ ...user, [name]: value });
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const getAccessToken = async () => {
    try {
      const res = await axios.post(
        serverURL + "/session",
        {
          user_id: user.email,
          password: user.password,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        dispatch(setIsLogin(true));
        // dispatch(setIsUser(true))
        console.log("로그인 성공===", res.data);
        navigate("/dashboard");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const navigate = useNavigate();

  const onClickToSignUp = () => {
    navigate("/signUp");
  };

  return (
    <div className="signIn_modal">
      <div className="signIn_container">
        <label htmlFor="email">Email</label>
        <input name="email" type="email" onChange={onChangeEmail} />
        <div className="emailCheck">! 이메일을 정확히 입력해주세요.</div>
        <div>! 등록되지 않은 사용자입니다.</div>

        <label htmlFor="password">Password</label>
        <input name="password" type="password" onChange={onChangePassword} />
        <div>! 비밀번호를 다시 확인해주세요</div>

        <button onClick={() => getAccessToken()}>로그인</button>
        <div>
          <button onClick={() => onClickToSignUp()}>
            아직 계정이 없으신가요?
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
