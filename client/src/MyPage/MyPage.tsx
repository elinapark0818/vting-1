import React from "react";
import { Link, Outlet } from "react-router-dom";

interface Props {
  text: string;
}

function MyPage({ text }: Props) {
  return (
    <div>
      <p>{text}</p>
      <Link to="edit">회원정보 수정</Link>
      <Link to="delete">회원탈퇴</Link>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

MyPage.defaultProps = {
  text: "This is MyPage!",
};

export default MyPage;
