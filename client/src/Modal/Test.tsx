import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import "./Test.scss";

function Test() {
  return <></>;
}

// todo: 로그인 성공 모달
function LoginOk() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  return (
    <div className="loginOkModal_container">
      <div className="loginOkModal_background">
        <div className="loginOkModal_modal">
          <button
            className="loginOkModal_closeBtn"
            onClick={() => navigate(-1)}
          >
            X
          </button>
          <div className="loginOkModal_desc">
            <h3>{userInfo.nickname}님, 로그인되었습니다.</h3>
          </div>
          <div className="loginOkModal_btnWrap">
            <button className="loginOkModal_ok" onClick={() => navigate(-1)}>
              확인
            </button>
            <button
              className="loginOkModal_cancel"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// todo: 회원가입 성공 모달

function SignUpOk() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.userInfo);
  return (
    <div className="SignUpOkModal_container">
      <div className="SignUpOkModal_background">
        <div className="SignUpOkModal_modal">
          <button
            className="SignUpOkModal_closeBtn"
            onClick={() => navigate(-1)}
          >
            X
          </button>
          <div className="SignUpOkModal_desc">
            <h3>{userInfo.nickname}님, 회원가입이 완료되었습니다.</h3>
          </div>
          <div className="SignUpOkModal_btnWrap">
            <button className="SignUpOkModal_ok" onClick={() => navigate("/")}>
              확인
            </button>
            <button
              className="SignUpOkModal_cancel"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// todo: 마이페이지 비밀번호 틀림 모달

function PasswordWrong() {
  const navigate = useNavigate();
  return (
    <div className="passwordWrongModal_container">
      <div className="passwordWrongModal_background">
        <div className="passwordWrongModal_modal">
          <button
            className="passwordWrongModal_closeBtn"
            onClick={() => navigate(-1)}
          >
            X
          </button>
          <div className="passwordWrongModal_desc">
            <h3>비밀번호를 확인해주세요.</h3>
          </div>
          <div className="passwordWrongModal_btnWrap">
            <button
              className="passwordWrongModal_ok"
              onClick={() => navigate("/myPage")}
            >
              확인
            </button>
            <button
              className="passwordWrongModal_cancel"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// todo: 회원정보 수정 완료

function EditOk() {
  const navigate = useNavigate();
  return (
    <div className="editOkModal_container">
      <div className="editOkModal_background">
        <div className="editOkModal_modal">
          <button className="editOkModal_closeBtn" onClick={() => navigate(-1)}>
            X
          </button>
          <div className="editOkModal_desc">
            <h3>회원정보가 수정되었습니다.</h3>
          </div>
          <div className="editOkModal_btnWrap">
            <button
              className="editOkModal_ok"
              onClick={() => navigate("/myPage")}
            >
              확인
            </button>
            <button className="editOkModal_cancel" onClick={() => navigate(-1)}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// * 회원탈퇴 완료
function WithdrawalOk() {
  const navigate = useNavigate();
  return (
    <div className="withdrawalOk_container">
      <div className="withdrawalOk_background">
        <div className="withdrawalOk_modal">
          <button
            className="withdrawalOk_closeBtn"
            onClick={() => navigate(-1)}
          >
            X
          </button>
          <div className="withdrawalOk_desc">
            <h3>회원탈퇴 되었습니다.</h3>
          </div>
          <div className="withdrawalOk_btnWrap">
            <button className="withdrawalOk_ok" onClick={() => navigate("/")}>
              확인
            </button>
            <button
              className="withdrawalOk_cancel"
              onClick={() => navigate(-1)}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Test;
