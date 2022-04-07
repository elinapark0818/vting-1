import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
// react-slick (slider) 관련 css import
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "./HotVote.scss";
import Loading from "../Loading/Loading";

function setVoteFormat(format: string) {
  if (format === "bar") return "막대그래프형";
  if (format === "versus") return "대결형";
  if (format === "word") return "말풍선형";
  if (format === "open") return "대화형";
}

export default function VoteSlider() {
  const [isLoading, setIsLoading] = useState(true);
  const [errMode, setErrMode] = useState(false);
  const [allVotes, setAllVotes] = useState([
    {
      title: "",
      format: "",
      sumCount: 0,
      url: 123456,
    },
  ]);

  const serverURL: string = process.env.REACT_APP_SERVER_URL as string;
  useEffect(() => {
    async function getAllVotes() {
      try {
        const response = await axios.get(`${serverURL}/allvotes`);
        if (response.status === 200) {
          setAllVotes(response.data.vote);
        }
      } catch (e) {
        setErrMode(true);
      }
      setIsLoading(false);
    }
    getAllVotes();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 0,
    slidesToShow: 5,
    slidesToScroll: 5,
    swipeToSlide: true,
  };

  return (
    <div className="hotVotes">
      {isLoading ? (
        <Loading />
      ) : errMode ? (
        <div className="Error">
          최근 설문을 불러오는데 실패했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </div>
      ) : (
        <div className="hotVotesContents">
          <Slider {...settings}>
            {allVotes.map((el, idx) => (
              <div className="hotVoteCard" key={idx}>
                <a
                  href={`${process.env.REACT_APP_CLIENT_URL}/${el.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="hotVoteCardTitle">{el.title}</div>
                  <div className="hotVoteCardFormat">
                    {setVoteFormat(el.format)}
                  </div>
                  <div className="hotVoteCardCount">
                    {el.sumCount}명 참여 중
                  </div>
                </a>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}
