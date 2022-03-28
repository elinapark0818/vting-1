import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Home from "./Home/Home";
import Delete from "./MyPage/Delete/Delete";
import Edit from "./MyPage/Edit/Edit";
import MyPage from "./MyPage/MyPage";
import Navbar from "./Navbar/Navbar";
import V from "./v/V";
import NewVote from "./new/new";
import { Provider } from "react-redux";
import store from "./store/index";

import React from "react";
import SignIn from "./SignIn/SignIn";
// import Modal from "./Modal/Modal";

// import NewVote from "./new/new";
// import axios from "axios";

// interface User {
// 	id: number;
// 	firstName: string;
// }

// ? 굳이 React.FC 안쓰고 함수선언식으로 해도 되니까 화살표함수를 안쓰는 방향으로 해보자!

function App() {
  // 서버통신 및 파이프라인 체크를 위한 임시 기능입니다.
  // 성공 후 삭제하셔도 됩니다.
  // useEffect(() => {
  //   const getAccessToken = async () => {
  //     try {
  //       const response = await axios({
  //         method: "post",
  //         url: "/",
  //         data: { email: "test@yof.com" },
  //       });
  //       if (response.status === 200) {
  //         console.log("Hello World from client");
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   getAccessToken();
  // }, []);

  // type SignInProps = {
  //   styles: React.CSSProperties;
  // };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="v">
            <Route index element={<V />} />
            <Route path=":number" element={<V />} />
          </Route>

          <Route path="new" element={<NewVote />} />

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

export default App;
