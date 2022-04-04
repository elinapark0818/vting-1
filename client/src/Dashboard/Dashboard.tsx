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
  const isLogin = useSelector((state: RootState) => state.isLogin);
  // const userInfo = useSelector((state: RootState) => state.userInfo);

  const [signInState, setSignInState] = useState<boolean>(false);

  // todo: 임의로 불러오는 데이터
  let votes = [
    {
      created_at: "2022-03-11T10:23:49.027Z",
      format: "bar",
      isPublic: true,
      title: "막대그래프 예시",
      undergoing: true,
      url: 123456,
    },
    {
      created_at: "2022-03-19T13:13:09.463Z",
      format: "open",
      isPublic: true,
      title: "오픈 예시",
      undergoing: true,
      url: 234567,
    },
    {
      created_at: "2022-03-31T13:13:22.078Z",
      format: "word",
      isPublic: false,
      title: "워드클라우드 예시",
      undergoing: false,
      url: 345678,
    },
  ];

  const [userVote, setUserVote] = useState(votes);

  let newVotes = userVote.map((vote, index) => ({
    key: index,
    created_at: vote.created_at.toString().split("T")[0],
    format: changeFormat(vote.format),
    isPublic: vote.isPublic === true ? "공개" : "비공개",
    title: vote.title,
    undergoing: vote.undergoing === true ? "종료" : "재시작",
    url: vote.url,
  }));

  function changeFormat(type: string) {
    if (type === "bar") return "막대 그래프";
    if (type === "open") return "대화형";
    if (type === "word") return "말풍선";
    if (type === "versus") return "대결형";
  }

  // * 페이지네이션
  const [userVoteCount, setUserVoteCount] = useState(1);

  // todo: 첫번째 페이지 (10개가 넘어갈 경우)
  let Page = 1;

  // * 보트들의 정보 조회하기
  // todo: 페이지네이션을 어떻게 할 것인가?
  const getUserInfo = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${serverURL}/user?q=${Page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
        },
      });
      if (res.status === 200) {
        setUserVote(res.data.vote);
        console.log("페이지별 보트들(10ea)===", userVote);
      } else {
        setUserVote(votes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // * 보트의 총 개수만 조회하기
  const getVoteCount = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${serverURL}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
        },
      });
      if (res.status === 200) {
        // todo: 보트들 개수 저장해두기
        setUserVoteCount(res.data.data.voteCount);
        console.log("총 보트 몇개===", userVoteCount);
      } else {
        setUserVote(userVote);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isLogin.login) {
      setSignInState(false);
    } else {
      setSignInState(true);
    }
    getUserInfo();
    getVoteCount();
  }, []);

  // todo: Vote Table 에서 설문 생성, 설문 종료, 설문 삭제 기능 구현하기
  const DeleteVote = async (url: string) => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.delete(`${serverURL}/vting/${url}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
        },
      });
      if (res.status === 200) {
        getUserInfo();
        closeModal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // * 퍼블릭 패치
  const memberPublic = async (url: string) => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.patch(
        `${serverURL}/vting/${url}`,
        {
          isPublic: "clicked!",
          isActive: null,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        }
      );
      if (res.status === 200) {
        getUserInfo();
      } else {
        console.log("Bad Request");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // * 액티브 패치
  const memberActive = async (url: string) => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.patch(
        `${serverURL}/vting/${url}`,
        {
          isPublic: null,
          isActive: "clicked!",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            withCredentials: true,
          },
        }
      );
      if (res.status === 200) {
        getUserInfo();
      } else {
        console.log("Bad Request");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // * 삭제 모달

  const [openModal, setOpenModal] = useState<boolean>(false);

  const isOpenModal = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

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
                  <th>No.</th>
                  <th>제목</th>
                  <th>타입</th>
                  <th>생성일</th>
                  <th>코드</th>
                  <th>공개</th>
                  <th>진행</th>
                  <th>삭제</th>
                </tr>
              </thead>

              {newVotes.map((vote: any, index) => (
                <tbody key={index}>
                  <tr>
                    <td>{index + 1}</td>
                    <td
                      onClick={() => navigate(`/v/${vote.url}`)}
                      className="td_title"
                    >
                      {vote.title}
                    </td>
                    <td>{vote.format}</td>
                    <td>{vote.created_at}</td>
                    <td>{vote.url}</td>
                    <td onClick={() => memberPublic(`${vote.url}`)}>
                      <button className="toggleBtn">
                        <div
                          className={
                            vote.isPublic === "공개"
                              ? "toggleCircle"
                              : "toggleCircle toggleOn"
                          }
                        >
                          {/* {vote.isPublic} */}
                        </div>
                      </button>
                    </td>
                    <td onClick={() => memberActive(`${vote.url}`)}>
                      <button className="toggleBtn">
                        <div
                          className={
                            vote.undergoing === "종료"
                              ? "toggleCircle"
                              : "toggleCircle toggleOn"
                          }
                        >
                          {/* {vote.undergoing} */}
                        </div>
                      </button>
                    </td>
                    <td>
                      <input
                        className="dashboard_deleteBtn"
                        type="button"
                        value="삭제"
                        onClick={isOpenModal}
                      />
                      {openModal && (
                        <div className="dashboard_deleteModal_container">
                          <div className="dashboard_deleteModal_background">
                            <div className="dashboard_deleteModal_modal">
                              <button
                                className="deleteModal_closeBtn"
                                onClick={closeModal}
                              >
                                X
                              </button>
                              <div className="dashboard_deleteModal_desc">
                                <h3>
                                  삭제시, 복구되지 않습니다.
                                  <br /> 정말로 삭제하시겠습니까?
                                </h3>
                              </div>
                              <div className="btnWrap">
                                <button
                                  className="dashboard_delete_ok"
                                  onClick={() => DeleteVote(`${vote.url}`)}
                                >
                                  확인
                                </button>
                                <button
                                  className="dashboard_delete_cancel"
                                  onClick={closeModal}
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
            <div onClick={() => navigate("/new")} className="dashboard_btnWrap">
              <BsFillPlusCircleFill className="dashboard_plusBtn" />
            </div>
          </main>
        </div>
      ) : (
        <div className="dashboardModal_container">
          <div className="dashboardModal_background">
            <div className="dashboardModal_modal">
              <button
                className="dashboardModal_closeBtn"
                onClick={() => navigate("/")}
              >
                X
              </button>
              <div className="dashboardModal_desc">
                <h3>로그인 후, 이용하실 수 있습니다.</h3>
              </div>
              <div className="dashboardModal_btnWrap">
                <button
                  className="dashboardModal_ok"
                  onClick={() => navigate("/signIn")}
                >
                  확인
                </button>
                <button
                  className="dashboardModal_cancel"
                  onClick={() => navigate("/")}
                >
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
