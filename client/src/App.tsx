import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Home from "./Home/Home";
import Delete from "./MyPage/Delete/Delete";
import Edit from "./MyPage/Edit/Edit";
import MyPage from "./MyPage/MyPage";
import Navbar from "./Navbar/Navbar";
import Voter from "./Voter/Voter";
import VoterCode from "./Voter/VoterCode";
import VoterResult from "./Voter/VoterResult";
import V from "./v/V";
import NewVote from "./new/new";
import { Provider } from "react-redux";
import store from "./store/index";

import React, { useEffect, useState } from "react";
import SignIn from "./SignIn/SignIn";

import TopButton from "./Info/TopButton";

// import Modal from "./Modal/Modal";

// import NewVote from "./new/new";
// import axios from "axios";

// interface User {
// 	id: number;
// 	firstName: string;
// }

// ? 굳이 React.FC 안쓰고 함수선언식으로 해도 되니까 화살표함수를 안쓰는 방향으로 해보자!

function App() {
  const [voteMode, setVoteMode] = useState(false);

  useEffect(() => {
    if (document.location.href.includes("vote")) {
      setVoteMode(true);
    } else {
      setVoteMode(false);
    }
  }, []);

  if (voteMode) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Voter />}>
              <Route path="" element={<VoterCode />} />
              <Route path=":code" element={<VoterResult />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  } else {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
          <TopButton />

          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="dashboard" element={<Dashboard />} />

            <Route path="new" element={<NewVote />} />

            <Route path="v/:code" element={<V />} />

            <Route path="myPage" element={<MyPage />}>
              <Route path="" element={<Edit />} />
              <Route path="delete" element={<Delete />} />
            </Route>

            <Route path="signIn" element={<SignIn />} />
          </Routes>
          {/* <Modal /> */}
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
