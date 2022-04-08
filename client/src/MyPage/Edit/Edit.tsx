import React, { useState, useEffect } from "react";
import "./Edit.scss";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setUserInfo, setIsLogin } from "../../store/index";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";
import { FaAngleDoubleRight } from "react-icons/fa";

interface PatchUser {
  name: string;
  password: string;
}

const serverURL: string = process.env.REACT_APP_SERVER_URL as string;

function Edit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            setUserInfo({
              _id: res.data.data._id,
              image: res.data.data.image,
            });
            if (res.data.data.provider === undefined) {
              setOauthUser(false);
            } else {
              setOauthUser(true);
            }
          });
      } catch (err) {
        console.log(err);
      }
    };
    getUserInfo();
  }, [userInfo]);

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

  const [editOkModal, setEditOkModal] = useState<boolean>(false);
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
            setEditOkModal(true);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="edit_container">
      <header className="edit_header">
        <div className="edit_header_desc">
          <h3>{userInfo.nickname} 님, 안녕하세요!</h3>
        </div>
      </header>

      <div className="edit_containerWrap">
        <nav className="userInfo_nav">
          <button
            className="userInfo_navBtn_active"
            onClick={() => navigate("/myPage")}
          >
            회원정보 관리
          </button>
          <button
            className="userInfo_navBtn"
            onClick={() => navigate("/myPage/delete")}
          >
            회원탈퇴 관리
          </button>
        </nav>

        <main className="edit_wrap">
          {oauthUser ? (
            <div className="edit_userInfo">
              <EditUserImage />
              <div className="edit_nickname">
                <h3>
                  닉네임 <FaAngleDoubleRight />
                </h3>
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
              <EditUserImage />
              <div className="edit_nickname">
                <h3>
                  닉네임 <FaAngleDoubleRight />
                </h3>
                <input
                  className="edit_nickname_input"
                  name="name"
                  onChange={edit_onChangeName}
                  type="text"
                  placeholder={userInfo.nickname}
                />
              </div>
              <div className="edit_password">
                <h3>
                  비밀번호 <FaAngleDoubleRight />
                </h3>
                <input
                  type="password"
                  name="password"
                  onChange={edit_onChangePassword}
                  placeholder="변경하실 비밀번호를 입력해주세요."
                />
              </div>
            </div>
          )}

          <div className="edit_btnWrap">
            <button className="edit_btn" onClick={() => EditUserInfo()}>
              수정하기
            </button>
          </div>
        </main>
        {editOkModal && (
          <div className="editOkModal_container">
            <div className="editOkModal_background">
              <div className="editOkModal_modal">
                <button
                  className="editOkModal_closeBtn"
                  onClick={() => setEditOkModal(false)}
                >
                  X
                </button>
                <div className="editOkModal_desc">
                  <h3>회원정보가 수정되었습니다.</h3>
                </div>
                <div className="editOkModal_btnWrap">
                  <button
                    className="editOkModal_ok"
                    onClick={() => setEditOkModal(false)}
                  >
                    확인
                  </button>
                  <button
                    className="editOkModal_cancel"
                    onClick={() => setEditOkModal(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
          setUserInfo({
            _id: String(userInfo._id),
            image: response.data.data,
          });
          navigate("/myPage");
        }
      }
    };

    return (
      <div className="edit_userProfile">
        <div className="edit_userProfile_wrap">
          <form className="edit_userProfile_form">
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              className="img_input"
              onChange={(e) => onChangeImg(e)}
            />
          </form>

          <div className="edit_userProfile_image">
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
          </div>
          <label htmlFor="profile-upload" className="img_uploaderWrap">
            <FaPlusCircle className="img_uploader" />
          </label>
        </div>
      </div>
    );
  }
}

export default Edit;
