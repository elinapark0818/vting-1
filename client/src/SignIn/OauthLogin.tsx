import React from "react";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLogin, setUserInfo } from "../store/index";

import axios from "axios";

const clientId =
  "1090240452697-ld3bhcs5kd2v5m8c9iijrjtqckimgfbi.apps.googleusercontent.com";

const serverURL: string = "http://localhost:8000";

interface PropsType {
  inOrUp: string;
}

const LoginGoogle = ({ inOrUp }: PropsType) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = async (res: any) => {
    console.log("LOGIN SUCCESS! Current user : ", res.profileObj);
    const { imageUrl } = res.profileObj;

    // check user
    await axios
      .post(`${serverURL}/user/check`, {
        user_id: res.profileObj.email,
      })
      .then(async (data) => {
        if (data.status === 200 && data.data.message === "Success verified") {
          console.log("이미 가입된 이메일입니다.");
          // 로그인 시키기(이메일만 갖고 로그인 시키기)
          await axios
            .post(serverURL + "/oauth/signin", {
              user_id: res.profileObj.email,
            })
            .then((res) => {
              if (
                res.status === 200 &&
                res.data.message === "Successfully logged in"
              ) {
                localStorage.setItem("accessToken", res.data.data.accessToken);
                const userInfo = res.data.data.user_data;
                console.log("image: userInfo.image", userInfo.image);
                dispatch(
                  setUserInfo({
                    _id: userInfo._id,
                    nickname: userInfo.nickname,
                    email: userInfo.user_id,
                    image: userInfo.image,
                  })
                );

                dispatch(setIsLogin(true));
                navigate(-1);
              }
            });
        }
        if (data.status === 200 && data.data.message === "It doesn't match") {
          console.log("가입 가능한 이메일입니다.1");
          // 회원 가입 시키고 로그인 시키기
          await axios
            .post(serverURL + "/oauth/signup", {
              user_id: res.profileObj.email,
              nickname: res.profileObj.name,
              image: imageUrl,
              provider: "google",
            })
            .then((data) => {
              if (data.status === 201) {
                const userInfo = data.data.data.user_data;
                localStorage.setItem("accessToken", data.data.data.accessToken);

                dispatch(
                  setUserInfo({
                    _id: userInfo._id,
                    nickname: userInfo.nickname,
                    email: userInfo.user_id,
                    image: userInfo.image,
                  })
                );

                dispatch(setIsLogin(true));
                alert("회원가입이 완료되었습니다.");
                navigate(-1);
              }
            });
        }
      });
  };

  const onFailure = (res: any) => {
    console.log("LOGIN FAIED! res :", res);
  };

  return (
    <div>
      <div>
        <GoogleLogin
          clientId={clientId}
          buttonText={
            inOrUp === "in" ? "Sign in with Google" : "Sign up with Google"
          }
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          // isSigneIn={true}
        />
      </div>
    </div>
  );
};

const LoginFacebook = ({ inOrUp }: PropsType) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const responseFacebook = async (res: any) => {
    console.log("success response", res);
    const { id, email } = res;

    // check user
    await axios
      .post(`${serverURL}/user/check`, {
        user_id: email,
      })
      .then(async (data) => {
        if (data.status === 200 && data.data.message === "Success verified") {
          console.log("이미 가입된 이메일입니다.");
          // 로그인 시키기(이메일만 갖고 로그인 시키기)
          await axios
            .post(serverURL + "/oauth/signin", {
              user_id: email,
            })
            .then((res) => {
              if (
                res.status === 200 &&
                res.data.message === "Successfully logged in"
              ) {
                localStorage.setItem("accessToken", res.data.data.accessToken);
                const userInfo = res.data.data.user_data;
                console.log("image: userInfo.image", userInfo.image);
                dispatch(
                  setUserInfo({
                    _id: userInfo._id,
                    nickname: userInfo.nickname,
                    email: userInfo.user_id,
                    image: userInfo.image,
                  })
                );

                dispatch(setIsLogin(true));
                navigate(-1);
              }
            });
        }
        if (data.status === 200 && data.data.message === "It doesn't match") {
          console.log("가입 가능한 이메일입니다.1");
          // 회원 가입 시키고 로그인 시키기
          await axios
            .post(serverURL + "/oauth/signup", {
              user_id: email,
              nickname: id,
              image:
                "https://brandlogos.net/wp-content/uploads/2021/04/facebook-icon.png", // 우선 기본 아이콘으로 하고 => picture 가져오는거 확인 후 수정
              provider: "facebook",
            })
            .then((data) => {
              if (data.status === 201) {
                const userInfo = data.data.data.user_data;
                localStorage.setItem("accessToken", data.data.data.accessToken);

                dispatch(
                  setUserInfo({
                    _id: userInfo._id,
                    nickname: userInfo.nickname,
                    email: userInfo.user_id,
                    image: userInfo.image,
                  })
                );

                dispatch(setIsLogin(true));
                alert("회원가입이 완료되었습니다.");
                navigate(-1);
              }
            });
        }
      });
  };

  return (
    <FacebookLogin
      appId="1124695878322136"
      autoLoad={true}
      fields="name,email,picture"
      callback={responseFacebook}
    />
  );
};
export { LoginGoogle, LoginFacebook };
