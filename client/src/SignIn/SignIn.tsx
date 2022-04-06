import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLogin, setUserInfo } from "../store/index";
import "./SignIn.scss";

import Logo from "../assets/v-ting_logo_circle.png";
import { LoginGoogle, LoginFacebook } from "./OauthLogin";

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

const serverURL: string = process.env.REACT_APP_SERVER_URL as string;

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [newUser, setNewUser] = useState<CreateUser>({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
    image: "",
  });
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    if (newUser.password === newUser.passwordConfirm) {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
    if (!user.email.length) {
      setUserCheck(true);
    }
    if (!user.password.length) {
      setUserPasswordCheck(true);
    }
    if (!newUser.email.length) {
      setAlreadyUser(false);
    }
  }, [
    newUser.password,
    newUser.passwordConfirm,
    user.email,
    newUser.email,
    user.password,
  ]);

  const [isServerOk, setIsServerOk] = useState(true);
  const [inOrUp, setInOrUp] = useState<InOrUp>({ signIn: true });

  const setSignUp = () => {
    setInOrUp({ signIn: false });
  };

  const setSignIn = () => {
    setInOrUp({ signIn: true });
  };

  const isCloseModal = () => {
    navigate(-1);
  };

  const [userCheck, setUserCheck] = useState(true);
  const [alreadyUser, setAlreadyUser] = useState(false);
  const [userPasswordCheck, setUserPasswordCheck] = useState(true);

  const LogInUser = async () => {
    await axios
      .post(serverURL + "/session", {
        user_id: user.email,
        password: user.password,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("accessToken", res.data.data.accessToken);
          const userInfo = res.data.data.user_data;
          setUserCheck(true);
          setUserPasswordCheck(true);
          dispatch(setIsLogin(true));
          navigate(-1);
          dispatch(
            setUserInfo({
              _id: userInfo._id,
              nickname: userInfo.nickname,
              email: userInfo.user_id,
              image: userInfo.image,
            })
          );
          console.log("이미지", userInfo.image);
        }
      })
      .catch((err) => {
        if (err.response.data.message === "There's no ID") {
          setUserCheck(false);
        } else if (err.response.data.message === "Wrong password") {
          setUserPasswordCheck(false);
        } else if (err.response.data.status === 400) {
          setIsServerOk(false);
        }
      });
  };

  const SignUpUser = async () => {
    try {
      await axios
        .post(`${serverURL}/user/check`, {
          user_id: newUser.email,
        })
        .then((data) => {
          if (data.status === 200 && data.data.message === "Success verified") {
            setAlreadyUser(true);
          }
          if (data.status === 200 && data.data.message === "It doesn't match") {
            axios
              .post(serverURL + "/user", {
                user_id: newUser.email,
                nickname: newUser.name,
                password: newUser.password,
              })
              .then((data) => {
                if (data.status === 201) {
                  const userInfo = data.data.data.user_data;
                  localStorage.setItem(
                    "accessToken",
                    data.data.data.accessToken
                  );
                  dispatch(setIsLogin(true));
                  dispatch(
                    setUserInfo({
                      _id: userInfo._id,
                      nickname: userInfo.nickname,
                      email: userInfo.user_id,
                      image: userInfo.image,
                    })
                  );
                  alert("회원가입이 완료되었습니다.");
                  navigate(-1);
                }
              });
          }
        });
    } catch (err) {
      setIsServerOk(false);
      console.log(err);
    }
  };

  // ? SignUp input onChanges
  const lonIn_onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const lonIn_onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // ? SignIn input onChanges
  const signUp_onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
  const [nameValid, setNameValid] = useState(false);
  const [isBlur, setIsBlur] = useState(false);

  const nameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsBlur(true);
    if (newUser.name.match(/^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/)) {
      setNameValid(true);
    } else {
      setNameValid(false);
    }
  };

  const [emailValid, setEmailValid] = useState(false);
  const [isEmailBlur, setIsEmailBlur] = useState(false);

  const emailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEmailBlur(true);
    if (
      newUser.email.match(
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      )
    ) {
      setEmailValid(true);
    } else if (
      user.email.match(
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      )
    ) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const [passwordValid, setPasswordValid] = useState(true);
  const [isPasswordBlur, setIsPasswordBlur] = useState(false);

  const passwordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsPasswordBlur(true);
    if (
      newUser.password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/i
      )
    ) {
      setPasswordValid(true);
    } else if (
      user.password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/i
      )
    ) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  const [newPasswordValid, setNewPasswordValid] = useState(true);
  const [newPasswordBlur, setNewPasswordBlur] = useState(false);

  const newPassword = (e: React.FocusEvent<HTMLInputElement>) => {
    setNewPasswordBlur(true);
    if (
      newUser.password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/i
      )
    ) {
      setNewPasswordValid(true);
    } else {
      setNewPasswordValid(false);
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
                    이메일을 정확히 입력해주세요.
                  </div>
                )}

                {!userCheck && (
                  <div className="server Error">
                    가입되지 않은 이메일입니다.
                  </div>
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

                {isPasswordBlur && !user.password && (
                  <div className="password Empty">비밀번호를 입력해주세요</div>
                )}
                {isPasswordBlur && user.password && (
                  <div className="password Success"></div>
                )}
                {!isServerOk && (
                  <div className="server Error">
                    네트워크 상태가 불안정합니다.
                  </div>
                )}
                {!userPasswordCheck && (
                  <div className="server Error">비밀번호가 틀렸습니다.</div>
                )}
              </div>

              <div className="btn_wrap">
                <button className="logInBtn" onClick={() => LogInUser()}>
                  로그인
                </button>
                <div className="oauth_wrap">
                  <div className="google-button" style={{ width: "100%" }}>
                    <LoginGoogle inOrUp="in" />
                  </div>
                  <div>
                    <LoginFacebook inOrUp="in" />
                  </div>
                </div>
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
                <div className="nickname Error">
                  한글, 영문, 숫자만 가능하며 2-10자리 입력해주세요
                </div>
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
                    이메일을 정확히 입력해주세요.
                  </div>
                )}
                {alreadyUser && (
                  <div className="server Error">이미 가입된 이메일입니다.</div>
                )}
                {isEmailBlur && emailValid && (
                  <div className="email Success"></div>
                )}
              </div>

              <div className="password_wrap">
                <input
                  onBlur={newPassword}
                  value={newUser.password}
                  placeholder="비밀번호"
                  type="password"
                  name="password"
                  id="password"
                  onChange={signUp_onChangePassword}
                />
                {newPasswordBlur && !newPasswordValid && (
                  <div className="password Error">
                    영문, 숫자, 특수문자 포함 8자리이상 입력해주세요.
                  </div>
                )}
                {newPasswordBlur && newPasswordValid && (
                  <div className="password Success"></div>
                )}
              </div>

              <input
                placeholder="비밀번호 확인"
                value={newUser.passwordConfirm}
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                onChange={signUp_onChangePasswordConfirm}
              />

              {!isMatch && (
                <div className="password Error">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}

              {!isServerOk && (
                <div className="server Error">
                  네트워크 상태가 불안정합니다.
                </div>
              )}

              <div className="signUp_wrap">
                {nameValid && emailValid && passwordValid ? (
                  <button className="signUp_btn" onClick={() => SignUpUser()}>
                    이메일로 가입하기
                  </button>
                ) : (
                  <button className="signUp_no" disabled>
                    이메일로 가입하기
                  </button>
                )}
              </div>

              <div className="oauth_wrap">
                <div>
                  <LoginGoogle inOrUp="out" />
                </div>
                <div>
                  <LoginFacebook inOrUp="out" />
                </div>
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
