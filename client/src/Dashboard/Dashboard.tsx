import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import "./Dashboard.scss";
import { BsFillPlusCircleFill } from "react-icons/bs";

const serverURL: string = "http://localhost:8000";

function Dashboard() {
  const navigate = useNavigate();

  // todo: 로그인하지 않은 유저가 /dashboard 로 접속할 경우
  // todo: "로그인 후 이용가능합니다." 모달 띄워주고 [확인] 버튼 클릭시 로그인 페이지 이동
  // todo: 로그인한 경우, 대시보드 접근하면 자신이 생성한 질문 모아보기
  const isLogin = useSelector((state: RootState) => state.isLogin);
  const [signInState, setSignInState] = useState<boolean>(false);

  const [modalState, setModalState] = useState<boolean>(false);

  const openModal = () => {
    setModalState(true);
  };

  const closeModal = () => {
    setModalState(false);
  };

  useEffect(() => {
    if (!isLogin) {
      setSignInState(false);
    } else {
      setSignInState(true);
    }
  }, []);

  // todo: Vote Table 에서 설문 생성, 설문 종료, 설문 삭제 기능 구현하기

  // const voteList = [
  //   {
  //     id: 1,
  //     title: "엄마 vs 아빠",
  //     type: "대결",
  //     status: "진행중",
  //     createdAt: "22/03/15",
  //     code: "1234 674",
  //   },
  //   {
  //     id: 2,
  //     title: "커서 뭐 될래요?",
  //     type: "말풍성",
  //     status: "종료",
  //     createdAt: "22/03/17",
  //     code: "1234 674",
  //   },
  // ];

  // const [userVote, setUserVote] = useState<object[]>(voteList);

  // useEffect(() => {
  //   getVoteData();
  // });

  // const getVoteData = async () => {
  //   let accessToken = localStorage.getItem("accessToken");
  //   try {
  //     const res = await axios.get(`${serverURL}/user/${userInfo._id}`, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         withCredentials: true,
  //       },
  //     });
  //     if (res.status === 200) {
  //       setUserVote([{ id: 5, title: "추가되는보트" }]);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const removeVoteData = (id) => {
  //   axios.delete(`${serverURL}/vting/${userInfo._id}`).then((res) => {
  //     const deleteVote = userVote.filter((vote) => id !== res.id);
  //     setUserVote(deleteVote);
  //   });
  // };

  //     id: 2,
  //     title: "커서 뭐 될래요?",
  //     type: "말풍성",
  //     status: "종료",
  //     createdAt: "22/03/17",
  //     code: "1234 674",

  return (
    <>
      {signInState ? (
        <div className="dashboard_container">
          <header className="dashboard_header">
            <h1>나의 Vting</h1>
          </header>

          <main className="dashboard_wrap">
            <table className="dashboard_table">
              <thead>
                <tr>
                  <th></th>
                  <th>제목</th>
                  <th>타입</th>
                  <th>상태</th>
                  <th>생성일</th>
                  <th>코드</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>엄마 vs 아빠</td>
                  <td>대결</td>
                  <td>진행중</td>
                  <td>22/03/15</td>
                  <td>1234 674</td>
                </tr>
              </tbody>

              <tbody>
                <tr>
                  <td>2</td>
                  <td>커서 뭐 될래요?</td>
                  <td>말풍선</td>
                  <td>종료</td>
                  <td>22/03/12</td>
                  <td>1234 674</td>
                </tr>
              </tbody>
            </table>
            <div onClick={() => navigate("/v")} className="dashboard_btnWrap">
              <BsFillPlusCircleFill className="dashboard_plusBtn" />
            </div>
          </main>
        </div>
      ) : (
        <div className="deleteModal_container">
          <div className="deleteModal_background">
            <div className="deleteModal_modal">
              <button className="closeBtn" onClick={closeModal}>
                X
              </button>
              <h3>로그인 후, 이용하실 수 있습니다.</h3>
              <div className="btnWrap">
                <button
                  className="delete_ok"
                  onClick={() => navigate("/signIn")}
                >
                  확인
                </button>
                <button className="delete_cancel" onClick={closeModal}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
