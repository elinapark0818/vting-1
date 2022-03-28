import React from "react";
import "./Edit.scss";

interface Props {
  text: string;
}

function Edit({ text }: Props) {
  // const [password, setPassword] = useState("");
  // const [passwordCheck, setPasswordCheck] = useState("true");

  return (
    <div className="checkPwd_container">
      <header className="edit_header">
        <h1>회원정보 관리</h1>
      </header>

      <div className="edit_container">
        <h3>프로필</h3>
        <img alt="profile_img" />
        <label htmlFor="file">업로드</label>
        <input
          id="file"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        />
        <div>
          <h3>닉네임</h3>
          <input type="text" />
        </div>

        <div>
          <h3>비밀번호</h3>
          <input type="password" />
        </div>
        <button>수정하기</button>
      </div>
    </div>
  );
}

Edit.defaultProps = {
  text: "This is Edit!",
};

export default Edit;
