import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Home from "./Home/Home";
import Delete from "./MyPage/Delete/Delete";
import Edit from "./MyPage/Edit/Edit";
import MyPage from "./MyPage/MyPage";
import Navbar from "./Navbar/Navbar";
import V from "./v/V";

// import axios from 'axios';

// interface User {
// 	id: number;
// 	firstName: string;
// }

// ? 굳이 React.FC 안쓰고 함수선언식으로 해도 되니까 화살표함수를 안쓰는 방향으로 해보자!

function App() {
  // axios.get<User[]>('http://localhost:4000').then((res) => {
  // 	console.log(res.data);
  // });
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="dashboard" element={<Dashboard />} />

        <Route path="v">
          <Route index element={<V />} />
          <Route path=":number" element={<V />} />
        </Route>

        <Route path="myPage" element={<MyPage />}>
          <Route path="edit" element={<Edit />} />
          <Route path="delete" element={<Delete />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
