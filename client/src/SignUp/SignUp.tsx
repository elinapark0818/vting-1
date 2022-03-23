import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsSignUp } from "../store/index";
import axios from "axios";
import "./SignUp.scss";

interface User {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
  image?: string;
}

interface SignUpUser {
  signUp: boolean;
}

const serverURL: string = "http://localhost:8000";

function SignUp() {
  const [user, setUser] = useState<User>({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
    image: "",
  });
  const [signUp, setSignUp] = useState<SignUpUser>({ signUp: false });

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target); // * HTMLInputElement 가 통째로 들어온다
    const { name, value } = e.target;
    // console.log(e.target.name); // * email
    setUser({ ...user, [name]: value });
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target); // * HTMLInputElement 가 통째로 들어온다
    const { name, value } = e.target;
    // console.log(e.target.name); // * email
    setUser({ ...user, [name]: value });
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onClickToSignIn = () => {
    navigate("/signIn");
  };

  const CreatedUser = async () => {
    try {
      const res = await axios.post(
        serverURL + "/user",
        {
          user_id: user.email,
          nickname: user.name,
          password: user.password,
        },
        { withCredentials: true }
      );
      if (res.status === 201) {
        dispatch(setIsSignUp(true));
        // dispatch(setIsUser(true))
        console.log("회원가입 성공===", res.data);
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="signUp_container">
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" onChange={onChangeName} />
      <div>! 이름을 입력해주세요.</div>

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" onChange={onChangeEmail} />
      <div>! 이메일을 정확히 입력해주세요.</div>
      <div>! 이미 등록된 사용자입니다.</div>

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={onChangePassword}
      />

      <label htmlFor="password_confirm">Password-Confirm</label>
      <input
        type="password"
        id="password_confirm"
        onChange={onChangePasswordConfirm}
      />

      <div>
        <button onClick={() => CreatedUser()}>Email로 가입하기</button>
      </div>

      <div>
        <div>Github 로 가입하기</div>
        <div>Google 로 가입하기</div>
      </div>
      <button onClick={() => onClickToSignIn()}>로그인화면으로 돌아가기</button>
    </div>
  );
}

export default SignUp;
