import React from "react";
import "./Edit.scss";

function Edit() {
  // const [password, setPassword] = useState("");
  // const [passwordCheck, setPasswordCheck] = useState("true");

  return (
    <div className="edit_container">
      <header className="edit_header">
        <h1>회원정보 관리</h1>
      </header>

      <main className="edit_wrap">
        <div className="edit_profile">
          <h3>프로필</h3>

          <img alt="profile_img" />
          <label htmlFor="file">업로드</label>
          <input
            id="file"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className="edit_nickname">
          <h3>닉네임</h3>
          <input type="text" />
        </div>

        <div className="edit_password">
          <h3>비밀번호</h3>
          <input type="password" />
        </div>
      </main>
      <div className="edit_btnWrap">
        <button className="edit_btn">수정하기</button>
      </div>
    </div>
  );
}

export default Edit;
