import React, { useEffect } from "react";
import "./Info.scss";
import AOS from "aos";
import "aos/dist/aos.css";

import Home from "../assets/1_vote_In_Home.gif";
import Created from "../assets/2_created_vote.gif";
import SNS from "../assets/3_copy_and_SNS_share.gif";
import Result from "../assets/4_realtime_vote_result.gif";
import Delete from "../assets/5_delete_vote_at_Dashboard.gif";
import Profile from "../assets/6_change_profile.gif";
// import Horizontal from "../assets/8_horizontal_graph.gif";
// import Conversation from "../assets/9_conversation_vote.gif";
// import Versus from "../assets/10_versus_vote.gif";
// import Bubble from "../assets/11_bubble_vote.gif";
// import Vertical from "../assets/12_vertical_graph.gif";
import VoteCode from "../assets/13_vote_code_and_show_realtime_result.gif";
import NonMembers from "../assets/14_non_members_expired_page.gif";
import { FaRegCheckSquare } from "react-icons/fa";
import { BiPoll, BiChat, BiCloud, BiHorizontalCenter } from "react-icons/bi";
import Created_Vote from "./Created_Vote";
import Smile from "../assets/vt_smile.png";

function Info() {
  useEffect(() => {
    AOS.init();
  });

  return (
    <div className="info_container">
      <div className="info_wrap">
        <div className="info_vote_home">
          <div className="info_vote_home_title">
            <h1>다양한 설문에 참여하여 사람들과 의견을 나눠보세요.</h1>
          </div>
          <div className="wrap">
            <div
              className="info_vote_home_wrap"
              data-aos="fade-left"
              data-aos-anchor-placement="bottom-bottom"
            >
              <img
                className="info_vote_home_img"
                src={Home}
                alt="vote_in_Home"
              />
              <div className="info_vote_home_desc">
                <h1>흥미돋는 설문을 찾아볼까요?</h1>
                <p>
                  <FaRegCheckSquare /> 요즘 뜨는 설문을 찾을 수 있어요
                </p>
                <p>
                  <FaRegCheckSquare /> 개성있는 설문을 찾을 수 있어요
                </p>
                <p>
                  <FaRegCheckSquare /> 슬라이드로 원하는 설문을 찾을 수 있어요
                </p>
                <p>
                  <FaRegCheckSquare /> 클릭만으로 간단하게 설문에 응답할 수
                  있어요
                </p>
                <p>
                  <FaRegCheckSquare /> 설문 결과를 실시간으로 확인할 수 있어요
                </p>
              </div>
            </div>
          </div>
          <div className="wrap">
            <div
              className="info_vote_home_wrap"
              data-aos="fade-left"
              data-aos-anchor-placement="bottom-bottom"
            >
              <img
                className="info_vote_home_img"
                src={Created}
                alt="created_vote"
              />
              <div className="info_vote_home_desc">
                <h1>나만의 설문을 만들어보세요.</h1>
                <p>
                  <FaRegCheckSquare /> 빠르고 쉽게 설문을 만들 수 있어요
                </p>
                <p>
                  <FaRegCheckSquare /> 원하는 설문 옵션을 적용할 수 있어요
                </p>
                <p>
                  <FaRegCheckSquare /> 설문 생성을 완료했다면, 주변 사람들에게
                  공유해보세요
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="info_vote_category">
          <div className="info_vote_category_title">
            <h1>여러가지 스타일의 설문을 만들어보세요.</h1>
          </div>

          <div className="vote_category">
            <div className="icon_wrap">
              <BiPoll className="horizontal_graph_icon" />
              <div className="icon_desc">
                <h1>막대 그래프</h1>
                <p>설문 결과를 가로형 막대 그래프로 확인할 수 있어요</p>
              </div>
            </div>

            <div className="icon_wrap">
              <BiPoll
                className="vertical_graph_icon"
                style={{ transform: "rotate(-90deg)" }}
              />
              <div className="icon_desc">
                <h1>막대 그래프</h1>
                <p>설문 결과를 세로형 막대 그래프로 확인할 수 있어요</p>
              </div>
            </div>
            <div className="icon_wrap">
              <BiHorizontalCenter className="versus_icon" />
              <div className="icon_desc">
                <h1>대결형</h1>
                <p>설문응답을 대결형태로 확인할 수 있어요</p>
              </div>
            </div>
            <div className="icon_wrap">
              <BiChat className="chat_icon" />
              <div className="icon_desc">
                <h1>대화형</h1>
                <p>
                  박스안에 메시지형태도 담겨있는 설문결과를 확인할 수 있어요
                </p>
              </div>
            </div>
            <div className="icon_wrap">
              <BiCloud className="cloud_icon" />
              <div className="icon_desc">
                <h1>말풍선형</h1>
                <p>설문응답이 워드 클라우드로 만들어집니다</p>
              </div>
            </div>
          </div>
          <Created_Vote />
          {/* <div className="info_graph">
            <div className="info_graph_item">
              <img
                className="info_graph_img"
                src={Horizontal}
                alt="horizontal_graph"
              />
              <div className="info_graph_desc">
                <h3>
                  막대그래프(
                  <BiPoll />)
                </h3>
                <p>설문 결과를 가로형 막대 그래프로 확인할 수 있어요</p>
              </div>
            </div>

            <div className="info_graph_item">
              <img
                className="info_graph_img"
                src={Vertical}
                alt="vertical_vote"
              />
              <div className="info_graph_desc">
                <h3>
                  막대그래프(
                  <BiPoll style={{ transform: "rotate(-90deg)" }} />)
                </h3>
                <p>설문 결과를 세로형 막대 그래프로 확인할 수 있어요</p>
              </div>
            </div>
          </div>

          <div className="info_etc_vote">
            <div className="info_etc_vote_item">
              <img
                className="info_etc_vote_img"
                src={Conversation}
                alt="conversation_vote"
              />
              <div className="info_etc_vote_desc">
                <h3>
                  대화형(
                  <BiChat />)
                </h3>
                <p>
                  박스안에 메시지형태도 담겨있는 설문결과를 확인할 수 있어요
                </p>
              </div>
            </div>

            <div className="info_etc_vote_item">
              <img
                className="info_etc_vote_img"
                src={Versus}
                alt="versus_vote"
              />
              <div className="info_etc_vote_desc">
                <h3>
                  대결형(
                  <BiHorizontalCenter />)
                </h3>
                <p>설문응답을 대결형태로 확인할 수 있어요</p>
              </div>
            </div> */}
          {/* </div> */}
          {/* <div className="info_etc_vote">
            <div className="info_etc_vote_item">
              <img
                className="info_etc_vote_img"
                src={Bubble}
                alt="bubble_vote"
              />
              <div className="info_etc_vote_desc">
                <h3>
                  말풍선 (<BiCloud />)
                </h3>
                <p>설문응답이 워드 클라우드로 만들어집니다</p>
              </div>
            </div>
          </div> */}
        </div>

        <div className="info_vting_option">
          <div className="info_vote_nonmember_title">
            <h1> V-ting은 모두에게 다양한 기능을 제공합니다</h1>
          </div>
          <div className="info_nonmember_option">
            <div className="info_nonmember_option_item">
              <img
                className="info_nonmember_option_img"
                src={VoteCode}
                alt="vote_code_result"
                data-aos="fade-up"
                data-aos-anchor-placement="top-center"
              />
              <div className="info_nonmember_option_desc">
                <h2>쉽고 간편하게 설문에 참여할 수 있어요</h2>
                <p>코드를 입력하여 해당 설문에 참여하세요</p>
              </div>
            </div>

            <div className="info_nonmember_option_item">
              <img
                className="info_nonmember_option_img"
                src={Result}
                alt="realtime_vote_result"
                data-aos="fade-up"
                data-aos-anchor-placement="top-center"
              />
              <div className="info_nonmember_option_desc">
                <h2>내가 만든 설문의 접속방법과 결과를 확인하세요</h2>
                <p>공개여부와 진행여부를 곧바로 변경할 수 있어요</p>
                <p>설문결과를 실시간으로 확인할 수 있어요</p>
              </div>
            </div>
          </div>

          <div className="info_nonmember_option">
            <div className="info_nonmember_option_item">
              <img
                className="info_nonmember_option_img"
                src={SNS}
                alt="copy_and_SNS_share"
                data-aos="fade-up"
                data-aos-anchor-placement="top-center"
              />
              <div className="info_nonmember_option_desc">
                <h2>여러가지 방법으로 설문을 자랑해보세요</h2>
                <p>카카오톡 공유하기를 이용해보세요</p>
                <p>QR code를 통해 모바일 접속이 가능합니다</p>
                <p>URL 주소를 복사하여 주변 사람들에게 공유해보세요</p>
                <p>메인페이지 상단에서 코드번호를 입력하면 접속할 수 있어요</p>
              </div>
            </div>

            <div className="info_nonmember_option_item">
              <img
                className="info_nonmember_option_img"
                src={NonMembers}
                alt="non_Members"
                data-aos="fade-up"
                data-aos-anchor-placement="top-center"
              />
              <div className="info_nonmember_option_desc">
                <h2>V-ting은 비회원에게도 다양한 기능을 제공합니다</h2>
                <p>V-ting은 언제나 열려있답니다.^^</p>
                <p>임시 비밀번호 설정을 통해 설문을 만들 수 있어요</p>
                <p>앗! 유효시간은 60분입니다. 시간이 지나면 사라져요</p>
              </div>
            </div>
          </div>

          <div className="info_vote_member_title">
            <h1>회원가입을 통해 V-ting에서 제공하는 특별한 혜택을 누리세요</h1>
          </div>

          <div className="info_member_option">
            <div className="info_member_option_item">
              <img
                className="info_member_option_img"
                src={Delete}
                alt="delete_at_Dashboard"
                data-aos="fade-up"
                data-aos-anchor-placement="top-center"
              />
              <div className="info_member_option_desc">
                <h2>대시보드</h2>
                <p>대시보드에서 내가 생성한 설문의 현황을 확인할 수 있어요</p>
                <p>
                  대시보드에서 내가 생성한 설문들을 간편하게 수정/삭제
                  가능합니다
                </p>
              </div>
            </div>

            <div className="info_member_option_item">
              <img
                className="info_member_option_img"
                src={Profile}
                alt="change_profile_image"
                data-aos="fade-up"
                data-aos-anchor-placement="top-center"
              />
              <div className="info_member_option_desc">
                <h2>프로필 이미지</h2>
                <p>
                  회원정보 수정 페이지에서 원하는 프로필 이미지를 설정할 수
                  있어요
                </p>
                <p>생성한 설문페이지에서 적용된 내 프로필을 확인할 수 있어요</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="info_move_to_new">
        {/* <div className="vote_category">
          <BiPoll className="horizontal_graph_icon" />
          <BiPoll
            className="vertical_graph_icon"
            style={{ transform: "rotate(-90deg)" }}
          />
          <BiHorizontalCenter className="versus_icon" />
          <BiChat className="chat_icon" />
          <BiCloud className="cloud_icon" />
        </div> */}
        <div className="swing">
          <img src={Smile} alt="Smile" style={{ width: "300px" }} />
        </div>
        <Created_Vote />
      </div>
    </div>
  );
}

export default Info;
