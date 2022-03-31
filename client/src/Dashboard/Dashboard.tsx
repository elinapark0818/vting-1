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
  // const userInfo = useSelector((state: RootState) => state.userInfo);

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
    <div className="dashboard_container">
      <header className="dashboard_header">
        <h1>나의 Vting</h1>
      </header>

      <main className="dashboard_wrap">
        <table className="dashboard_table">
          <th>id</th>
          <th>제목</th>
          <th>타입</th>
          <th>상태</th>
          <th>생성일</th>
          <th>코드</th>

          <tr>
            <td>1</td>
            <td>엄마 vs 아빠</td>
            <td>대결</td>
            <td>진행중</td>
            <td>22/03/15</td>
            <td>1234 674</td>
          </tr>

          <tr>
            <td>2</td>
            <td>커서 뭐 될래요?</td>
            <td>말풍선</td>
            <td>종료</td>
            <td>22/03/12</td>
            <td>1234 674</td>
          </tr>
        </table>
      </main>

      <div onClick={() => navigate("/v")} className="dashboard_btnWrap">
        <BsFillPlusCircleFill className="dashboard_plusBtn" />
      </div>
    </div>
  );
}

export default Dashboard;
