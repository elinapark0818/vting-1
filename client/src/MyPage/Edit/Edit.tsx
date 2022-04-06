import React, { useState } from "react";
import "./Edit.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setUserInfo } from "../../store/index";
import axios from "axios";

interface PatchUser {
  name: string;
  password: string;
}

const serverURL: string = "http://localhost:8000";

function Edit() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const [patchUserInfo, setPatchUserInfo] = useState<PatchUser>({
    name: "",
    password: "",
  });

  const edit_onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatchUserInfo({ ...patchUserInfo, [name]: value });
  };

  const edit_onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatchUserInfo({ ...patchUserInfo, [name]: value });
  };

  const EditUserInfo = async () => {
    let accessToken = localStorage.getItem("accessToken");
    let sendBody;
    if (patchUserInfo.password !== "")
      sendBody = {
        nickname: patchUserInfo.name || userInfo.nickname,
        password: patchUserInfo.password,
      };
    else
      sendBody = {
        nickname: patchUserInfo.name || userInfo.nickname,
      };
    try {
      await axios
        .patch(`${serverURL}/user`, sendBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              setUserInfo({
                _id: String(userInfo._id),
                nickname: patchUserInfo.name || userInfo.nickname,
              })
            );
            alert("회원정보가 수정되었습니다.");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="edit_container">
      <header className="edit_header">
        <h1>회원정보 관리</h1>
      </header>

      <main className="edit_wrap">
        <div className="edit_userProfile">
          <div className="edit_profile">
            <label htmlFor="file" className="edit_btn">
              업로드
            </label>
            <input
              id="file"
              name="profile"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="edit_userInfo">
          <div className="edit_nickname">
            <h3>닉네임 </h3>
            <input
              name="name"
              onChange={edit_onChangeName}
              type="text"
              placeholder={userInfo.nickname}
            />
          </div>

          <div className="edit_password">
            <h3>비밀번호</h3>
            <input
              type="password"
              name="password"
              onChange={edit_onChangePassword}
              placeholder="변경하실 비밀번호를 입력해주세요."
            />
          </div>
        </div>
      </main>
      <div className="edit_btnWrap">
        <button className="edit_btn" onClick={() => EditUserInfo()}>
          수정하기
        </button>
      </div>
    </div>
  );
}

export default Edit;
