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

  const userInfo = useSelector((state: RootState) => state.userInfo);
  const isLogin = useSelector((state: RootState) => state.isLogin);

  const [signInState, setSignInState] = useState<boolean>(false);

  // todo: 임의로 불러오는 데이터
  let votes = [
    {
      created_at: "2022-03-11T10:23:49.027Z",
      format: "bar",
      isPublic: true,
      title: "더미1",
      undergoing: true,
      url: 123456,
    },
    {
      created_at: "2022-03-19T13:13:09.463Z",
      format: "open",
      isPublic: true,
      title: "더미2",
      undergoing: true,
      url: 234567,
    },
    {
      created_at: "2022-03-31T13:13:22.078Z",
      format: "word",
      isPublic: false,
      title: "더미3",
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
    undergoing: vote.undergoing === true ? "진행중" : "종료",
    url: parseInt(String(vote.url)),
  }));

  function changeFormat(type: string) {
    if (type === "bar") return "막대 그래프";
    if (type === "open") return "대화형";
    if (type === "word") return "말풍선";
    if (type === "versus") return "대결형";
  }

  const getUserInfo = async () => {
    let accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${serverURL}/user/${userInfo._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          withCredentials: true,
        },
      });
      console.log(res);
      if (res.status === 200) {
        setUserVote(res.data.data.vote);
      } else {
        setUserVote(votes);
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
        // todo: db 데이터는 삭제되는데 클라에서는 남아있다. 리렌더링
        getUserInfo();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [togglePublic, setTogglePublic] = useState(false);
  const [toggleOngoing, setToggleOngoing] = useState(false);

  const clickedTogglePublic = () => {
    setTogglePublic((prev) => !prev);
  };
  const clickedToggleOngoing = () => {
    setToggleOngoing((prev) => !prev);
  };

  const memberActiveOrPublic = async (url: string) => {
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
      console.log("응답이무얼까?", res.data);
      if (res.status === 200) {
        // * 회원 퍼블릭(공개/비공개)
        setTogglePublic(res.data.isPublic);
        console.log("공개설정바뀌니?===", togglePublic);

        // * 회원 종료(종료/재시작)
        setToggleOngoing(res.data.isActive);
        console.log("종료!!설정바뀌니?===", toggleOngoing);
        // * 리렌더링
        getUserInfo();
      } else {
        console.log("Bad Request");
      }
    } catch (err) {
      console.log(err);
    }
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
                  <th>상태</th>
                  <th>생성일</th>
                  <th>코드</th>
                  <th>공개여부</th>
                  <th>종료</th>
                  <th>삭제</th>
                </tr>
              </thead>

              {newVotes.map((vote: any, index) => (
                <tbody key={index}>
                  <tr>
                    <td>{index + 1}</td>
                    <td onClick={() => navigate(`/v/${vote.url}`)}>
                      {vote.title}
                    </td>
                    <td>{vote.format}</td>
                    <td>{vote.undergoing}</td>
                    <td>{vote.created_at}</td>
                    <td>{vote.url}</td>
                    <td>
                      <button
                        className="toggleBtn"
                        onClick={() => memberActiveOrPublic(`${vote.url}`)}
                      >
                        <div
                          onClick={clickedTogglePublic}
                          className={
                            togglePublic
                              ? "toggleCircle toggleOn"
                              : "toggleCircle"
                          }
                        >
                          {togglePublic ? "끄기" : "공개"}
                        </div>
                      </button>
                    </td>
                    <td>
                      <button
                        className="toggleBtn"
                        onClick={() => memberActiveOrPublic(`${vote.url}`)}
                      >
                        <div
                          onClick={clickedToggleOngoing}
                          className={
                            toggleOngoing
                              ? "toggleCircle toggleOn"
                              : "toggleCircle"
                          }
                        >
                          {toggleOngoing ? "종료" : "진행"}
                        </div>
                      </button>
                    </td>
                    <td>
                      <input
                        className="dashboard_btn"
                        type="button"
                        style={{ width: "100%", height: "100%" }}
                        value="삭제"
                        onClick={() => DeleteVote(`${vote.url}`)}
                      />
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
