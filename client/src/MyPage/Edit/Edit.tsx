import React, { useState, useEffect } from "react";
import "./Edit.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setUserInfo } from "../../store/index";
import axios from "axios";
import { FaFileUpload } from "react-icons/fa";

interface PatchUser {
  name: string;
  password: string;
}

const serverURL: string = process.env.REACT_APP_SERVER_URL as string;

function Edit() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const [oauthUser, setOauthUser] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      let accessToken = localStorage.getItem("accessToken");
      try {
        await axios
          .get(`${serverURL}/user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              withCredentials: true,
            },
          })
          .then((res) => {
            if (res.data.data.provider === undefined) {
              setOauthUser(false);
              // console.log("oauth유저인지", oauthUser);
              // Oauth
              // console.log("userInfo===", userInfo);
              // console.log("프로바이더", res.data.data.provider);
            } else {
              setOauthUser(true);
            }
          });
      } catch (err) {
        console.log(err);
      }
    };
    getUserInfo();
  }, []);

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
        <EditUserImage />

        {oauthUser ? (
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
          </div>
        ) : (
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
        )}
      </main>
      <div className="edit_btnWrap">
        <button className="edit_btn" onClick={() => EditUserInfo()}>
          수정하기
        </button>
      </div>
    </div>
  );

  function EditUserImage() {
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
          console.log("가져 온 이미지 주소는 ====>", response.data.data);
          setUserInfo({
            _id: String(userInfo._id),
            image: response.data.data,
          });
          console.log("저장된이미지", userInfo);
        }
      }
    };

    return (
      <div className="edit_userProfile">
        <form className="edit_userProfile_form">
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            className="img_input"
            onChange={(e) => onChangeImg(e)}
          />
          <img
            src={userInfo.image}
            alt="preView_profile"
            style={{
              width: "300px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </form>
        <div className="edit_userProfile_wrap">
          <h3>프로필</h3>
          <label htmlFor="profile-upload" className="img_uploaderWrap">
            <FaFileUpload className="img_uploader" />
          </label>
        </div>
      </div>
    );
  }
}

export default Edit;
