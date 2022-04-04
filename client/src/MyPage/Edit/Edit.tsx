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

  //* 닉네임 프로필 변경
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

  // * 닉네임, 비밀번호 변경
  // ! Cannot PATCH => `${serverURL}/user` 요거로 바뀐거임!
  // ! 심각한 오류 => 비밀번호를 비워두고 닉네임만 바꾸면 비번을 찾을 수가 없음..
  // todo: 방안 1. 닉네임 변경 / 비밀번호 변경 분기하기
  const EditUserName = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      await axios
        .patch(
          `${serverURL}/user`,
          {
            nickname: patchUserInfo.name || userInfo.nickname,
            password: patchUserInfo.password,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              withCredentials: true,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              setUserInfo({
                _id: String(userInfo._id),
                nickname: patchUserInfo.name || userInfo.nickname,
              })
            );
            alert("회원정보가 수정되었습니다.");
          } else {
            console.log("Bad Request 입니다. 400에러");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const EditUserPassword = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      await axios
        .patch(
          `${serverURL}/user`,
          {
            password: patchUserInfo.password,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              withCredentials: true,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            alert("비밀번호가 변경되었습니다.");
          } else {
            console.log("Bad Request 입니다. 400에러");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  // * 비밀번호를 불러오기 위해 user/check 를 쓸 수 있으려나..?
  const userPasswordCheck = async () => {
    let accessToken = localStorage.getItem("accessToken");
    axios
      .post(
        `${serverURL}/user/check`,
        {
          password: patchUserInfo.password,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="edit_container">
      <header className="edit_header">
        <h1>회원정보 관리</h1>
      </header>

      <main className="edit_wrap">
        <div className="edit_userProfile">
          <div className="edit_profile">
            {/* <h3>프로필</h3> */}

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
              placeholder="변경하실 닉네임을 입력해주세요."
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
        <button className="edit_btn" onClick={() => EditUserPassword()}>
          비밀번호 변경
        </button>
        <button className="edit_btn" onClick={() => EditUserName()}>
          닉네임 변경
        </button>
      </div>
    </div>
  );
}

export default Edit;
