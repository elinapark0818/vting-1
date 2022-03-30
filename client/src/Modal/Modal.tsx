import "./Modal.scss";

// import React from "react";
// // import { setIsOpenModal, RootState } from "../store/index";
// import { useDispatch, useSelector } from "react-redux";

// function Modal() {
//   // ? 상태바꿔줄 디스패치 불러오기
//   const dispatch = useDispatch();

//   // ? 유즈셀렉터로 리덕스에 있는 상태 가져오기
//   // let isOpenModal = useSelector((state: RootState) => state.isOpenModal);
//   // ? 상태를 변수에 담기
//   // let openModal = isOpenModal.isOpenModal;
//   // console.log(isOpenModal);

//   // // ? 클릭 오픈 핸들링
//   // const onClickOpenModal = () => {
//   //   // console.log("onClickOpenModal");
//   //   // ? 디스패치로 상태 변경
//   //   dispatch(setIsOpenModal(true));
//   // };
//   // // ? 클릭 클로즈 핸들링
//   // const onClickCloseModal = () => {
//   //   // console.log("onClickCloseModal");
//   //   dispatch(setIsOpenModal(false));
//   // };

//   return (
//     <div className="abcRoot">
//       {openModal ? <div>Modal True!</div> : <div>False</div>}
//     </div>
//   );
// }

// export default Modal;
