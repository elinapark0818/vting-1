import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import "./Home.scss";
import HotVote from "./HotVote";

axios.defaults.withCredentials = true;

function Home() {
  return (
    <div className="homeCon">
      <HotVote />
      <Testfunc />
      <Testfunc2 />
      <div className="services">추후 서비스 소개가 들어갈 영역입니다.</div>
    </div>
  );
}

function Testfunc2() {
  useEffect(() => {
    async function get400Error() {
      try {
        const response = await axios.post("http://localhost:8000/session", {
          user_id: "nonono@gmail.com",
          password: "1234567",
        });
        console.log(response);
      } catch (e: any) {
        console.log(e.response.data.message);
      }
    }
    get400Error();
  }, []);
  return <></>;
}

function Testfunc() {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const serverURL: string = "http://localhost:8000";
  let accessToken = localStorage.getItem("accessToken");

  const onChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) {
      const uploadFile = e.target.files[0];
      const formData = new FormData();
      formData.append("files", uploadFile);
      console.log(formData.getAll("files"));

      const response = await axios.patch(
        `${serverURL}/image/${userInfo._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        }
      );
      if (response.status === 200) {
        console.log("가져 온 이미지 주소는 ====>", response.data);
      }
    }
  };

  return (
    <form>
      <label htmlFor="profile-upload" />
      <input
        type="file"
        id="profile-upload"
        accept="image/*"
        onChange={(e) => onChangeImg(e)}
      />
    </form>
  );
}

export default Home;
