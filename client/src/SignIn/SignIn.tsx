import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLogin, setUserInfo } from "../store/index";
import "./SignIn.scss";

import Logo from "../assets/v-ting_logo_circle.png";
import { SiGithub } from "react-icons/si";
import Google from "../assets/google-oauth-logo.png";
import { BiErrorCircle } from "react-icons/bi";

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

const serverURL: string = "http://localhost:8000";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMatch, setIsMatch] = useState(false);

  // * 기존 유저정보를 담을 상태
  const [user, setUser] = useState<User>({ email: "", password: "" });

  // * 새로운 유저 정보를 담을 상태
  const [newUser, setNewUser] = useState<CreateUser>({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
    image: "",
  });

  useEffect(() => {
    if (newUser.password === newUser.passwordConfirm) {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
  }, [newUser.password, newUser.passwordConfirm]);

  // ? 서버 불안정 상태의 경우
  const [isServerOk, setIsServerOk] = useState(true);

  // ? 상태에 따라 SignIn 또는 SignUp 화면 보여주기
  const [inOrUp, setInOrUp] = useState<InOrUp>({ signIn: true });

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

  // ! 유저체크 (아이디, 비번)
  // ? false = 미가입 true = 가입
  const [userCheck, setUserCheck] = useState(false);
  const [alreadyUser, setAlreadyUser] = useState(false);
  const [userPasswordCheck, setUserPasswordCheck] = useState(true);

  // ? 로그인 서버 연동 => [POST] session
  // todo: 400에러로 메시지 분기가 안된다. => 초록님과 얘기하기
  // ! server/session
  const LogInUser = async () => {
    await axios
      .post(serverURL + "/session", {
        user_id: user.email,
        password: user.password,
      })
      .then((res) => {
        console.log("로그인성공res===", res);
        if (
          res.status === 200 &&
          res.data.message === "Successfully logged in"
        ) {
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
            })
          );
        }
      })
      .catch((err) => {
        console.log("에러상태===", err.response);
        if (err.response.data.message === "There's no ID") {
          setUserCheck(false);
          console.log("가입되지 않은 이메일입니다.");
        } else if (err.response.data.message === "Wrong password") {
          setUserPasswordCheck(false);
          console.log("비밀번호가 틀렸습니다.");
        } else {
          setIsServerOk(false);
          console.log("네트워크 상태가 불안정합니다.");
        }
      });
  };

  // ? 회원가입 + 유저체크 핸들링
  const SignUpUser = async () => {
    try {
      await axios
        .post(`${serverURL}/user/check`, {
          user_id: newUser.email,
        })
        .then((data) => {
          if (data.status === 200 && data.data.message === "Success verified") {
            // * 이미 가입된 이메일의 경우
            console.log("이미 가입된 이메일입니다");
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
                    })
                  );
                  alert("회원가입이 완료되었습니다.");
                  navigate(-1);
                }
              });
          }
          // else if (
          //   data.status === 200 &&
          //   data.data.message === "Success verified"
          // ) {
          //   setUserCheck(false);
          // }
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

  // * 닉네임 유효성검사
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
                  <div className="password Empty">
                    ! 비밀번호를 입력해주세요
                  </div>
                )}
                {isPasswordBlur && user.password && (
                  <div className="password Success"></div>
                )}
                {!isServerOk && (
                  <div className="server Error">
                    ! 네트워크 상태가 불안정합니다.
                  </div>
                )}

                {!userCheck && (
                  <div className="server Error">
                    ! 가입되지 않은 이메일입니다.
                  </div>
                )}

                {!userPasswordCheck && (
                  <div className="server Error">! 비밀번호가 틀렸습니다.</div>
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
                <div className="nickname Error">
                  ! 한글, 영문, 숫자만 가능하며 2-10자리 입력해주세요
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
                    ! 영문, 숫자, 특수문자 포함 8자리이상 입력해주세요.
                  </div>
                )}
                {isPasswordBlur && passwordValid && (
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
                  ! 비밀번호가 일치하지 않습니다.
                </div>
              )}

              {!isServerOk && (
                <div className="server Error">
                  ! 네트워크 상태가 불안정합니다.
                </div>
              )}

              {alreadyUser && (
                <div className="server Error">! 이미 가입된 이메일입니다.</div>
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
