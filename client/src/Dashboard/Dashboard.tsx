import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import "./Dashboard.scss";
import { AiOutlineArrowDown } from "react-icons/ai";
import vtCry from "../assets/vt_cry.png";

const serverURL: string = "http://localhost:8000";

function Dashboard() {
  const navigate = useNavigate();

  const isLogin = useSelector((state: RootState) => state.isLogin);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [userVoteCount, setUserVoteCount] = useState(1);
  let totalPage: number = Math.ceil(userVoteCount / 10);

  const [buttonActive, setButtonActive] = useState(false);

  const showPageBtn = () => {
    let pages: React.ReactElement<any>[] = [];
    for (let i: number = 1; i <= totalPage; i++) {
      pages.push(
        <li>
          <button
            className={buttonActive ? "page_btn" : "page_btn"}
            onClick={() => getChangePage(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  const getUserVoteData = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${serverURL}/user?q=1`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
        },
      });
      if (res.status === 200) {
        setUserVote(res.data.vote);
        getChangePage(currentPage);
      } else {
        setUserVote(votes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getChangePage = async (pageNumber: number) => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${serverURL}/user?q=${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
        },
      });
      if (res.status === 200) {
        setButtonActive(true);
        setCurrentPage(pageNumber);
        setUserVote(res.data.vote);
      } else {
        // setUserVote(votes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [empty, setEmpty] = useState(false);

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
        if (!res.data.data.voteCount) {
          setEmpty(true);
        }
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
    getUserVoteData();
    getVoteCount();
  }, [userVoteCount]);

  const DeleteVote = async (url: number) => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.delete(`${serverURL}/vting/${url}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
        },
      });
      if (res.status === 200) {
        getUserVoteData();
        getVoteCount();
        closeModal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const memberPublic = async (url: number) => {
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
        getUserVoteData();
      } else {
        console.log("Bad Request");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const memberActive = async (url: number) => {
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
        getUserVoteData();
      } else {
        console.log("Bad Request");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [deleteURL, setDeleteURL] = useState<number>(0);

  const deleteHandler = (url: number) => {
    setDeleteURL(url);
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
            <h1>나의 V-ting</h1>
          </header>

          {!empty ? (
            <main className="dashboard_wrap">
              <div
                onClick={() => navigate("/new")}
                className="dashboard_btnWrap"
              >
                <button className="dashboard_plusBtn">
                  나만의 V-ting 만들러 가기!
                </button>
              </div>
              <table className="dashboard_table">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}>No.</th>
                    <th style={{ width: "350px" }}>제목</th>
                    <th style={{ width: "120px" }}>타입</th>
                    <th style={{ width: "120px" }}>생성일자</th>
                    <th style={{ width: "120px" }}>코드번호</th>
                    <th style={{ width: "120px" }}>공개여부</th>
                    <th style={{ width: "120px" }}>진행여부</th>
                    <th style={{ width: "120px" }}>삭제하기</th>
                  </tr>
                </thead>

                {newVotes.map((vote: any, index) => (
                  <tbody key={index + (currentPage - 1) * 10 + 1}>
                    <tr>
                      <td>{index + (currentPage - 1) * 10 + 1}</td>
                      <td
                        onClick={() => navigate(`/v/${vote.url}`)}
                        className="td_title"
                      >
                        {vote.title}
                      </td>
                      <td>{vote.format}</td>
                      <td>{vote.created_at}</td>
                      <td>{vote.url}</td>
                      <td onClick={() => memberPublic(vote.url)}>
                        <button className="toggleBtn">
                          <div
                            className={
                              vote.isPublic === "공개"
                                ? "toggleCircle"
                                : "toggleCircle toggleOn"
                            }
                          ></div>
                        </button>
                      </td>
                      <td onClick={() => memberActive(vote.url)}>
                        <button className="toggleBtn">
                          <div
                            className={
                              vote.undergoing === "종료"
                                ? "toggleCircle"
                                : "toggleCircle toggleOn"
                            }
                          ></div>
                        </button>
                      </td>
                      <td>
                        <input
                          className="dashboard_deleteBtn"
                          type="button"
                          value="삭제"
                          onClick={() => deleteHandler(vote.url)}
                        />
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
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
                          코드번호 : {deleteURL} <br />
                          삭제시, 복구되지 않습니다.
                          <br /> 정말로 삭제하시겠습니까?
                        </h3>
                      </div>
                      <div className="btnWrap">
                        <button
                          className="dashboard_delete_ok"
                          onClick={() => DeleteVote(deleteURL)}
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
              <ul className="pagination">{showPageBtn()}</ul>
            </main>
          ) : (
            <div className="empty_container">
              <img
                src={vtCry}
                alt="vt_cry"
                style={{ width: "300px", marginBottom: "5em" }}
              />
              <div className="empty">아직 만들어진 V-ting이 없어요 🥲</div>
              {/* <AiOutlineArrowDown className="empty_arrowDown" /> */}
              <div
                onClick={() => navigate("/new")}
                className="dashboard_btnWrap"
              >
                <button className="dashboard_plusBtn">
                  나만의 V-ting 만들러 가기!
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="dashboardModal_container">
          <div className="dashboardModal_background">
            <div className="dashboardModal_modal">
              <button
                className="dashboardModal_closeBtn"
                onClick={() => navigate(-1)}
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
                  onClick={() => navigate(-1)}
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
