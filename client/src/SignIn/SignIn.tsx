import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLogin, setUserInfo, setIsOpenModal } from "../store/index";
import "./SignIn.scss";

import Logo from "../assets/v-ting_logo_circle.png";
import { SiGithub } from "react-icons/si";
import Google from "../assets/google-oauth-logo.png";

interface User {
  email: string;
  password: string;
}
interface CreateUser {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
  image?: string;
}
interface InOrUp {
  signIn: boolean;
}

const serverURL: string = "https://test.v-ting.net";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // * SignIn & SignUp 조건으로 상태 설정함 (inOrUp ? <SignIn> : <SignUp>)
  const [inOrUp, setInOrUp] = useState<InOrUp>({ signIn: true });

  // ? 기존 유저정보를 담을 상태 => onChange 밸류값이랑 비교해서 로그인처리
  const [user, setUser] = useState<User>({ email: "", password: "" });

  // * 새로운 유저 정보를 담을 상태
  const [newUser, setNewUser] = useState<CreateUser>({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
    image: "",
  });

  // ? 아직 계정이 없으신가요?  => 클릭 이벤트로 setInOrUp(false) 처리해주기!
  const setSignUp = () => {
    setInOrUp({ signIn: false });
  };
  // ? 로그인 화면으로 돌아가기 클릭 이벤트로 setInOrUp(true) 처리해주기!
  const setSignIn = () => {
    setInOrUp({ signIn: true });
  };

  // ? 모달 끄기 핸들링 : 이전 화면 보여주는거니까 그냥 뒤로가기로..ㅎㅎ
  const isCloseModal = () => {
    navigate(-1);
  };

  // ? 로그인 서버 연동 => [POST] session
  const LogInUser = async () => {
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
        const userInfo = res.data.data;
        dispatch(setIsLogin(true));
        console.log("res.data.data.user_id 출력===", userInfo.user_id);
        // todo: 모달 끄는 함수를 넣어주기
        dispatch(setIsOpenModal(false));
        // todo: 리덕스 userInfo에 값 set 하기
        dispatch(
          setUserInfo({
            _id: userInfo._id,
            nickname: userInfo.nickname,
            email: userInfo.user_id,
            image: userInfo.image,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ? 회원가입 서버연동
  const SignInUser = async () => {
    try {
      const res = await axios.post(
        serverURL + "/user",
        {
          user_id: newUser.email,
          nickname: newUser.name,
          password: newUser.password,
          passwordConfirm: newUser.passwordConfirm,
          // image: newUser.image,
        },
        { withCredentials: true }
      );
      if (res.status === 201) {
        console.log("회원가입 성공===", res.data);
        // ? 회원가입과 동시에 로그인 처리
        dispatch(setIsLogin(true));
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // ? SignUp input onChanges
  const lonIn_onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target); // * HTMLInputElement 가 통째로 들어온다
    const { name, value } = e.target;
    // console.log(e.target.name); // * email
    setUser({ ...user, [name]: value });
  };
  const lonIn_onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  // ? SignIn input onChanges
  const signUp_onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target); // * HTMLInputElement 가 통째로 들어온다
    const { name, value } = e.target;
    // console.log(e.target.name); // * email
    setNewUser({ ...newUser, [name]: value });
  };
  const signUp_onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };
  const signUp_onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };
  const signUp_onChangePasswordConfirm = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // ! Validation

  // * 닉네임 유효성검사
  const [nameValid, setNameValid] = useState(false);
  const [isBlur, setIsBlur] = useState(false);

  const nameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsBlur(true);
    if (newUser.name.match(/^[ㄱ-ㅣ가-힣]*$/i)) {
      setNameValid(true);
    } else {
      setNameValid(false);
    }
  };

  // * 이메일 유효성검사
  const [emailValid, setEmailValid] = useState(false);
  const [isEmailBlur, setIsEmailBlur] = useState(false);

  const emailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEmailBlur(true);
    if (newUser.email.match(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/i)) {
      setEmailValid(true);
    } else if (
      user.email.match(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/i)
    ) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  // * 비밀번호 유효성검사
  const [passwordValid, setPasswordValid] = useState(false);
  const [isPasswordBlur, setIsPasswordBlur] = useState(false);

  const passwordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsPasswordBlur(true);
    if (newUser.password.match(/^[A-Za-z]\w{7,14}$/)) {
      setPasswordValid(true);
    } else if (user.password.match(/^[A-Za-z]\w{7,14}$/)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  // * 비밀번호 일치 확인용
  const [samePassword, setSamePassword] = useState(false);
  const passwordConfirm = (e: React.FocusEvent<HTMLInputElement>) => {
    if (newUser.password.match(e.target.value)) {
      setSamePassword(true);
    } else {
      setSamePassword(false);
    }
  };

  return (
    <div>
      {inOrUp.signIn ? (
        <div className="signIn_container">
          <div className="signIn_background">
            <div className="signIn_modal">
              <button onClick={() => isCloseModal()} className="closeBtn">
                X
              </button>
              <div className="img_wrap">
                <img src={Logo} alt="Logo" style={{ width: "200px" }} />
              </div>

              <div className="email_wrap">
                <input
                  onBlur={emailBlur}
                  value={user.email}
                  placeholder="아이디(이메일)를 입력하세요."
                  name="email"
                  type="email"
                  onChange={lonIn_onChangeEmail}
                />
                {isEmailBlur && !emailValid && (
                  <div className="email Error">
                    ! 이메일을 정확히 입력해주세요.
                  </div>
                )}
                {isEmailBlur && emailValid && (
                  <div className="email Success"></div>
                )}
              </div>

              <div className="password_wrap">
                <input
                  onBlur={passwordBlur}
                  value={user.password}
                  placeholder="비밀번호를 입력하세요."
                  name="password"
                  type="password"
                  onChange={lonIn_onChangePassword}
                />

                {isPasswordBlur && !passwordValid && (
                  <div className="password Error">
                    ! 비밀번호를 다시 확인해주세요
                  </div>
                )}
                {isPasswordBlur && passwordValid && (
                  <div className="password Success"></div>
                )}
              </div>

              <div className="btn_wrap">
                <button className="logInBtn" onClick={() => LogInUser()}>
                  로그인
                </button>

                <button className="signUpBtn" onClick={() => setSignUp()}>
                  아직 계정이 없으신가요?
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="signUp_container">
          <div className="signUp_background">
            <div className="signUp_modal">
              <button onClick={() => isCloseModal()} className="closeBtn">
                X
              </button>
              <div className="img_wrap">
                <img src={Logo} alt="Logo" style={{ width: "200px" }} />
              </div>

              <input
                placeholder="닉네임"
                onBlur={nameBlur}
                id="name"
                value={newUser.name}
                name="name"
                type="text"
                onChange={signUp_onChangeName}
              />
              {isBlur && !nameValid && (
                <div className="nickname Error">! 한글 입력만 가능합니다.</div>
              )}
              {isBlur && nameValid && <div className="nickname Success"></div>}

              <div className="email_wrap">
                <input
                  placeholder="아이디(이메일)"
                  onBlur={emailBlur}
                  value={newUser.email}
                  id="email"
                  name="email"
                  type="email"
                  onChange={signUp_onChangeEmail}
                />
                {isEmailBlur && !emailValid && (
                  <div className="email Error">
                    ! 이메일을 정확히 입력해주세요.
                  </div>
                )}
                {isEmailBlur && emailValid && (
                  <div className="email Success"></div>
                )}
              </div>

              <div className="password_wrap">
                <input
                  onBlur={passwordBlur}
                  value={newUser.password}
                  placeholder="비밀번호"
                  type="password"
                  name="password"
                  id="password"
                  onChange={signUp_onChangePassword}
                />
                {isPasswordBlur && !passwordValid && (
                  <div className="password Error">
                    ! 최소 7글자 최대 14글자까지 입력가능합니다.
                  </div>
                )}
                {isPasswordBlur && passwordValid && (
                  <div className="password Success"></div>
                )}
              </div>

              <input
                onBlur={passwordConfirm}
                placeholder="비밀번호 확인"
                type="password"
                id="passwordConfirm"
                onChange={signUp_onChangePasswordConfirm}
              />

              {!samePassword && (
                <div className="password Error">
                  ! 비밀번호가 일치하지 않습니다.
                </div>
              )}

              <div className="signUp_wrap">
                <button onClick={() => SignInUser()}>이메일로 가입하기</button>
              </div>

              <div className="oauth_wrap">
                <SiGithub
                  style={{
                    fontSize: "50px",
                    color: "black",
                    marginRight: "10px",
                  }}
                />
                <img src={Google} alt="Google" style={{ width: "50px" }} />
              </div>
              <button className="back_login" onClick={() => setSignIn()}>
                로그인화면으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
