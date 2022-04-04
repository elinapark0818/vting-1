import React, { useState, Dispatch, SetStateAction, useEffect } from "react";

const voteDummy = {
  vote_data: {
    _id: "624710c297d85d682cc2e3c2",
    user_id: "testyb@yof.com",
    url: 659914,
    title: "123",
    format: "bar",
    type: "vertical",
    items: [
      {
        idx: 0,
        content: "짜장면",
        count: 2,
      },
      {
        idx: 1,
        content: "짬뽕",
        count: 5,
      },
      {
        idx: 2,
        content: "울면",
        count: 5,
      },
      {
        idx: 3,
        content: "기스면",
        count: 7,
      },
      {
        idx: 4,
        content: "볶음밥",
        count: 3,
      },
    ],
    response: [
      {
        idx: 0,
        content: "1231",
      },
      {
        idx: 1,
        content: "1233",
      },
    ],
    // (if format is 'open' : items -> response([{ "idx": 1, "content": '123' }])
    multiple: false,
    manytimes: false,
    undergoing: true,
    isPublic: true,
    created_at: "2022-04-01T14:48:34.453Z",
  },
  sumCount: 22,
  overtiem: 23,
  user_data: {
    uuid: "ObjectId",
    user_id: "bin11788@gamil.com",
    nickname: "overflowbin",
    image: null,
    vote: null,
  },
};

interface Props {
  code: string | undefined;
  answerMode?: boolean;
  setAnswerMode: Dispatch<SetStateAction<boolean>>;
}

interface Options {
  multiple?: boolean;
  setAnswerMode: Dispatch<SetStateAction<boolean>>;
}

function VoterAnswer({ setAnswerMode, code }: Props) {
  const [format, setFormat] = useState("");
  const [multiple, setMultiple] = useState(false);

  switch (format) {
    case "bar":
    case "versus":
      return <Bar multiple={multiple} setAnswerMode={setAnswerMode} />;
    case "open":
    case "word":
      return <Open setAnswerMode={setAnswerMode} />;
    default:
      return (
        <>
          <button
            onClick={() => {
              setFormat("bar");
            }}
          >
            1.세로 바
          </button>
          <button
            onClick={() => {
              setFormat("bar");
            }}
          >
            2.가로 바
          </button>
          <button
            onClick={() => {
              setFormat("open");
            }}
          >
            3.대화형
          </button>
          <button
            onClick={() => {
              setFormat("versus");
            }}
          >
            4.대결형
          </button>
          <button
            onClick={() => {
              setFormat("word");
            }}
          >
            5.말풍선형
          </button>
        </>
      );
  }
}

function Bar({ multiple, setAnswerMode }: Options) {
  const [clicked, setClicked] = useState(-1);
  const [multipleMode, setMultipleMode] = useState(multiple);
  const [error, setError] = useState(false);
  const [isEverythingOk, setIsEverythingOk] = useState(false);
  const [multiClicked, setMultiClicked] = useState(
    voteDummy.vote_data.items.map((el) => ({
      idx: el.idx,
      content: el.content,
      clicked: false,
    }))
  );

  useEffect(() => {
    if (multipleMode && countAnswers()) {
      setIsEverythingOk(true);
    } else if (!multipleMode && clicked >= 0) {
      setIsEverythingOk(true);
    }
  }, [clicked, multiClicked]);

  function countAnswers() {
    let result = 0;
    for (let item of multiClicked) {
      if (item.clicked) result++;
    }
    return result;
  }

  function toResult() {
    console.log(countAnswers());
    if (multipleMode && !countAnswers()) {
      setError(true);
      setTimeout(function () {
        setError(false);
      }, 1000);
    } else if (!multipleMode && clicked < 0) {
      setError(true);
      setTimeout(function () {
        setError(false);
      }, 1000);
    } else {
      // 1. 선택된(혹은 주관식일 경우 작성된) 응답을 axios로 보낸다.

      // 2. 응답이 제대로 전달되었으면, 결과보기 모드를 활성화한다.
      setAnswerMode(false);
    }
  }

  function handleMClicked(idx: number) {
    let newMclicked = [
      ...multiClicked.slice(0, idx),
      {
        idx: idx,
        content: multiClicked[idx].content,
        clicked: !multiClicked[idx].clicked,
      },
      ...multiClicked.slice(idx + 1),
    ];
    setMultiClicked(newMclicked);
  }

  return (
    <div className="votingBody">
      <div className="votingContent">
        <div className="voteAnswers">
          {multipleMode
            ? multiClicked.map((el, idx) => (
                <div
                  className="voteAnswer"
                  onClick={() => handleMClicked(el.idx)}
                  key={idx}
                >
                  <div
                    className={
                      multiClicked[idx].clicked
                        ? "answerIdx clickedIdx"
                        : "answerIdx"
                    }
                  >
                    {el.idx + 1}
                  </div>
                  <div
                    className={
                      multiClicked[idx].clicked
                        ? "VoteAnswerContent clickedCtn"
                        : "VoteAnswerContent"
                    }
                  >
                    {el.content}
                  </div>
                </div>
              ))
            : voteDummy.vote_data.items.map((el, idx) => (
                <div
                  className="voteAnswer"
                  onClick={() => setClicked(el.idx)}
                  key={idx}
                >
                  <div
                    className={
                      el.idx === clicked ? "answerIdx clickedIdx" : "answerIdx"
                    }
                  >
                    {el.idx + 1}
                  </div>
                  <div
                    className={
                      el.idx === clicked
                        ? "VoteAnswerContent clickedCtn"
                        : "VoteAnswerContent"
                    }
                  >
                    {el.content}
                  </div>
                </div>
              ))}
        </div>
        <div className={error ? "errorAlert displayBlock" : "errorAlert"}>
          ! 최소 한 개 이상의 선택지를 선택하셔야 합니다.
        </div>
      </div>
      <div
        className={
          isEverythingOk
            ? "voteCodeButton vtingButton blueButton"
            : "voteCodeButton vtingButton grayButton"
        }
        onClick={() => toResult()}
      >
        응답 결정
      </div>
    </div>
  );
}

function Open({ setAnswerMode }: Options) {
  const [subAnswer, setSubAnswer] = useState("");
  const [shake, setShake] = useState(false);
  function toResult() {
    if (!subAnswer.length) {
      setShake(true);
      setTimeout(function () {
        setShake(false);
      }, 1000);
    } else {
      setAnswerMode(false);
    }
    // 1. 선택된(혹은 주관식일 경우 작성된) 응답을 axios로 보낸다.

    // 2. 응답이 제대로 전달되었으면, 결과보기 모드를 활성화한다.
  }

  return (
    <div className="votingBody">
      <div className="votingContent" id="subjectiveContent">
        <label htmlFor="answerInput">당신의 답변은?</label>
        <input
          type="text-area"
          id="answerInput"
          className={shake ? "subjectiveInput shakeInput" : "subjectiveInput"}
          value={subAnswer}
          onChange={(e) => setSubAnswer(e.target.value)}
          placeholder={shake ? "필수 항목입니다." : ""}
        />
      </div>
      <div
        className={
          subAnswer.length
            ? "voteCodeButton vtingButton blueButton"
            : "voteCodeButton vtingButton grayButton"
        }
        onClick={() => toResult()}
      >
        응답 결정
      </div>
    </div>
  );
}

export default VoterAnswer;
