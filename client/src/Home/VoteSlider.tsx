import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
// react-slick (slider) 관련 css import
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "./HotVote.scss";

function setVoteFormat(format: string) {
  if (format === "bar") return "막대그래프형";
  if (format === "versus") return "대결형";
  if (format === "word") return "말풍선형";
  if (format === "open") return "대화형";
}

export default function VoteSlider() {
  const navigate = useNavigate();
  const [allVotes, setAllVotes] = useState([
    {
      title: "",
      format: "",
      sumCount: 0,
      url: 123456,
    },
  ]);

  const serverURL: string = "http://localhost:8000";
  useEffect(() => {
    async function getAllVotes() {
      const response = await axios.get(`${serverURL}/allvotes`);
      if (response.status === 200) {
        setAllVotes(response.data.vote);
      }
    }
    getAllVotes();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 0,
    slidesToShow: 5,
    slidesToScroll: 5,
  };

  return (
    <div className="hotVotes">
      <div className="hotVotesContents">
        <Slider {...settings}>
          {allVotes.map((el, idx) => (
            <a
              href={`http://vote.localhost:3000/${el.url}`}
              key={idx}
              target="_blank"
              rel="noreferrer"
            >
              <div className="hotVoteCard">
                <div className="hotVoteCardTitle">{el.title}</div>
                <div className="hotVoteCardFormat">
                  {setVoteFormat(el.format)}
                </div>
                <div className="hotVoteCardCount">{el.sumCount}명 참여 중</div>
              </div>
            </a>
          ))}
        </Slider>
      </div>
    </div>
  );
}
