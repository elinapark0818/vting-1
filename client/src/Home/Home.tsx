import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setIsLogin } from "../store/index";

axios.defaults.withCredentials = true;

interface Props {
  text: string;
}

function Home({ text }: Props) {
  const isLogin = useSelector((state: RootState) => state.isLogin);
  const dispatch = useDispatch();

  const getAccessToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/session",
        {
          user_id: "test@yof.com",
          password: "1234",
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(setIsLogin(true));
        console.log("로그인에 성공하셨습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const logOut = () => {
    dispatch(setIsLogin(false));
    console.log("로그아웃 되었습니다", isLogin);
  };

  // const logOut = async () => {
  //   try {
  //     const response = await axios({
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Cache: "no-cache",
  //       },
  //       withCredentials: true,
  //       method: "get",
  //       url: "http://localhost:8000/session",
  //     });
  //     if (response.status === 200) {
  //       dispatch(setIsLogin(false));
  //       console.log("로그아웃에 성공하셨습니다.");
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <div>
      {text}
      <button onClick={() => getAccessToken()}>login</button>
      <button onClick={() => logOut()}>logout</button>
    </div>
  );
}

Home.defaultProps = {
  text: "This is Home!",
};

export default Home;
