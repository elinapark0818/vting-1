import React, { useState } from "react";
import "./Edit.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setUserInfo } from "../../store/index";
import axios from "axios";

interface PatchUser {
  image: string;
  name: string;
  password: string;
}

const serverURL: string = "http://localhost:8000";

function Edit() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const [patchUserInfo, setPatchUserInfo] = useState<PatchUser>({
    image: "",
    name: "",
    password: "",
  });

  const edit_onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatchUserInfo({ ...patchUserInfo, [name]: value });
  };

  const edit_onChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatchUserInfo({ ...patchUserInfo, [name]: value });
  };

  const edit_onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatchUserInfo({ ...patchUserInfo, [name]: value });
  };

  const EditUserInfo = async () => {
    try {
      const res = await axios.patch(`${serverURL}/user/${userInfo._id}`);
      console.log("에딧유저인포===", res);

      if (res.status === 200) {
        dispatch(
          setUserInfo({
            _id: String(userInfo._id),
            nickname: patchUserInfo.name || userInfo.nickname,
            email: userInfo.email,
            image: patchUserInfo.image || userInfo.image,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const EditUserPassword = async () => {
    try {
      const res = await axios.patch(`${serverURL}/user/${userInfo._id}`, {
        password: patchUserInfo.password,
      });
      console.log("패스워드변경 ===", res);

      if (res.status === 200) {
        console.log("이러면 바뀜?");
      }
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
        <div className="edit_profile">
          <h3>프로필</h3>

          <img alt="profile_img" src={patchUserInfo.image} />
          <label htmlFor="file">업로드</label>
          <input
            id="file"
            name="profile"
            onChange={edit_onChangeProfile}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className="edit_nickname">
          <h3>닉네임</h3>
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
          />
        </div>
        {patchUserInfo.password}
      </main>
      <div className="edit_btnWrap">
        <button className="edit_btn" onClick={() => EditUserInfo()}>
          수정하기
        </button>

        <button onClick={() => EditUserPassword()}>비밀번호 수정하기</button>
      </div>
    </div>
  );
}

export default Edit;
