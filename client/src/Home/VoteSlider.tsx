import React, { Component } from "react";
import Slider from "react-slick";
// react-slick (slider) 관련 css import
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";

export default class VoteSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 0,
      slidesToShow: 4,
      slidesToScroll: 4,
    };

    return (
      <div className="hotVotes">
        <div className="hotVotesContents">
          <Slider {...settings}>
            <div className="hotVoteCard">
              <div className="hotVoteCardTitle">엄마가 좋아 아빠가 좋아?</div>
              <div className="hotVoteCardFormat">대결형</div>
              <div className="hotVoteCardCount">79명 참여 중</div>
            </div>
            <div className="hotVoteCard">
              <div className="hotVoteCardTitle">오늘 점심 메뉴</div>
              <div className="hotVoteCardFormat">바 그래프</div>
              <div className="hotVoteCardCount">37명 참여 중</div>
            </div>
            <div className="hotVoteCard">
              <div className="hotVoteCardTitle">인생에서 가장 소중한 것은?</div>
              <div className="hotVoteCardFormat">워드클라우드</div>
              <div className="hotVoteCardCount">11명 참여 중</div>
            </div>
            <div className="hotVoteCard">
              <div className="hotVoteCardTitle">궁금한거 있어?</div>
              <div className="hotVoteCardFormat">대화창</div>
              <div className="hotVoteCardCount">124명 참여 중</div>
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}
