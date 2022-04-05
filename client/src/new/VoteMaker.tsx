import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setItems,
  setMultiple,
  setManyTimes,
  deleteItems,
  RootState,
} from "../store/index";
import vtinglogo from "../assets/vt_logo_2.png";
import VoteButton from "./VoteButton";

function VoteMaker() {
  const newVoteFormat = useSelector(
    (state: RootState) => state.makeNewVote.format
  );

  switch (newVoteFormat) {
    case "bar":
      return <Bar />;
    case "open":
      return <OpenEnded />;
    case "versus":
      return <Versus />;
    case "word":
      return <WordCloud />;
    default:
      return (
        <div className="voteMakerCon">
          <img src={vtinglogo} className="vting-logo" alt="vting-logo" />
        </div>
      );
  }
}

// 바 그래프
function Bar() {
  const dispatch = useDispatch();
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteMt = newVote.manytimes;
  const newVoteMp = newVote.multiple;
  const newVoteItems = newVote.items;
  const [isShake, setIsShake] = useState(false);
  const [typedItem, setTypedItem] = useState(
    newVoteItems[newVoteItems.length]
      ? newVoteItems[newVoteItems.length].content
      : ""
  );
  const [titleShake, setTitleShake] = useState(false);
  const [everytingIsOk, setEverythingIsOk] = useState(false);
  const [itemShake, setItemShake] = useState(false);

  useEffect(() => {
    if (newVote.title) setTitleShake(false);
    if (newVote.items.length > 1) setItemShake(false);
    if (newVote.title && newVote.items.length > 1) setEverythingIsOk(true);
  }, [newVote.title, newVote.items]);

  const plusTriger = () => {
    if (typedItem) {
      dispatch(setItems({ idx: newVoteItems.length, content: typedItem }));
      setTypedItem("");
    } else {
      setIsShake(true);
      setTimeout(function () {
        setIsShake(false);
      }, 1000);
    }
  };

  const minusTriger = (num: number) => {
    dispatch(deleteItems(num));
  };

  return (
    <div className="voteMakerCon">
      <label
        className={titleShake ? "voteLabel shakeIt" : "voteLabel"}
        htmlFor="voteTitle"
      >
        &#128073; 설문 제목을 입력하세요.
      </label>
      <input
        className="VotetextInput"
        name="voteTitle"
        value={newVote.title}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <div className={titleShake ? "voteTitleErr voteTitle" : "voteTitle"}>
        ! 설문 제목은 필수 항목입니다.
      </div>

      <div
        className={
          titleShake ? "voteLabel topMargin10 shakeIt" : "voteLabel topMargin10"
        }
      >
        &#128073; 객관식 응답을 입력하세요.
      </div>
      <div className="voteAnswers">
        {newVoteItems?.map((el, idx) => (
          <div key={idx} className="voteAnswer">
            <div className="answerIdx">{el.idx + 1}</div>
            <input
              className="VoteAnswerInput"
              value={el.content}
              onChange={(e) =>
                dispatch(setItems({ idx: el.idx, content: e.target.value }))
              }
            ></input>
            <div className="plusItem" onClick={() => minusTriger(el.idx)}>
              -
            </div>
          </div>
        ))}
        <div className={isShake ? "voteAnswer shakeIt" : "voteAnswer"}>
          <div className="answerIdx">{newVoteItems.length + 1}</div>
          <input
            className="VoteAnswerInput"
            value={typedItem}
            placeholder="이곳에 항목을 입력하고 + 버튼으로 추가하세요."
            onChange={(e) => {
              setTypedItem(e.target.value);
            }}
          ></input>
          <div className="plusItem" onClick={() => plusTriger()}>
            +
          </div>
        </div>
      </div>
      <div className={itemShake ? "voteItemErr voteItem" : "voteItem"}>
        ! 최소 두 개 이상의 응답 항목이 필요합니다.
      </div>

      <div className="voteLabel topMargin10">
        &#128073; 설문 옵션을 선택하세요.
      </div>

      <div className="voteOptionItems">
        <div className="voteOptionItem">
          <div
            className="fakeCheck"
            onClick={() => {
              dispatch(setMultiple(!newVoteMp));
            }}
          >
            <svg
              viewBox="0 0 24 24"
              visibility={newVoteMp ? "visible" : "hidden"}
            >
              <polyline points="19 7 10 17 5 12" />
            </svg>
          </div>
          <label htmlFor="voteMultiple">다중선택 가능</label>
        </div>
        <div className="voteOptionItem">
          <div
            className="fakeCheck"
            onClick={() => {
              dispatch(setManyTimes(!newVoteMt));
            }}
          >
            <svg
              viewBox="0 0 24 24"
              visibility={newVoteMt ? "visible" : "hidden"}
            >
              <polyline points="19 7 10 17 5 12" />
            </svg>
          </div>
          <label htmlFor="voteManytimes">여러번 응답 가능</label>
        </div>
      </div>
      <VoteButton
        everytingIsOk={everytingIsOk}
        setTitleShake={setTitleShake}
        setItemShake={setItemShake}
      />
    </div>
  );
}

function OpenEnded() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteTitle = newVote.title;
  const newVoteMt = newVote.manytimes;
  const dispatch = useDispatch();

  const [titleShake, setTitleShake] = useState(false);
  const [everytingIsOk, setEverythingIsOk] = useState(false);

  useEffect(() => {
    if (newVote.title) {
      setTitleShake(false);
      setEverythingIsOk(true);
    } else {
      setEverythingIsOk(false);
    }
  }, [newVote.title]);

  return (
    <div className="voteMakerCon">
      <label
        className={titleShake ? "voteLabel shakeIt" : "voteLabel"}
        htmlFor="voteTitle"
      >
        &#128073; 설문 제목을 입력하세요.
      </label>
      <input
        className="VotetextInput"
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <div className={titleShake ? "voteTitleErr voteTitle" : "voteTitle"}>
        ! 설문 제목은 필수 항목입니다.
      </div>

      <div className="voteLabel topMargin10">
        &#128073; 설문 옵션을 선택하세요.
      </div>

      <div className="voteOptionItems">
        <div className="voteOptionItem">
          <div className="fakeCheck disabled"></div>
          <label htmlFor="voteMultiple" className="disabledText">
            다중선택 가능
          </label>
        </div>
        <div className="voteOptionItem">
          <div
            className="fakeCheck"
            onClick={() => {
              dispatch(setManyTimes(!newVoteMt));
            }}
          >
            <svg
              viewBox="0 0 24 24"
              visibility={newVoteMt ? "visible" : "hidden"}
            >
              <polyline points="19 7 10 17 5 12" />
            </svg>
          </div>
          <label htmlFor="voteManytimes">여러번 응답 가능</label>
        </div>
      </div>
      <VoteButton everytingIsOk={everytingIsOk} setTitleShake={setTitleShake} />
    </div>
  );
}

function Versus() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteTitle = newVote.title;
  const newVoteMt = newVote.manytimes;
  const newVoteMp = newVote.multiple;
  const newVoteItems = newVote.items;
  const dispatch = useDispatch();

  const [titleShake, setTitleShake] = useState(false);
  const [everytingIsOk, setEverythingIsOk] = useState(false);
  const [itemShake, setItemShake] = useState(false);

  useEffect(() => {
    if (newVote.title) setTitleShake(false);
    if (newVote.items.length > 1) setItemShake(false);
    if (newVote.title && newVote.items.length > 1) setEverythingIsOk(true);
  }, [newVote.title, newVote.items]);

  return (
    <div className="voteMakerCon">
      <label
        className={titleShake ? "voteLabel shakeIt" : "voteLabel"}
        htmlFor="voteTitle"
      >
        &#128073; 설문 제목을 입력하세요.
      </label>
      <input
        className="VotetextInput"
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <div className={titleShake ? "voteTitleErr voteTitle" : "voteTitle"}>
        ! 설문 제목은 필수 항목입니다.
      </div>

      <div className="voteLabel topMargin10">
        &#128073; 대결 항목을 입력하세요.
      </div>
      <div className="voteAnswers versusAnswers">
        <div className="voteAnswer versusAnswer">
          <input
            className="VoteAnswerInput versusAnswerInput"
            value={newVoteItems[0] ? newVoteItems[0].content : ""}
            onChange={(e) => {
              dispatch(setItems({ idx: 0, content: e.target.value }));
            }}
          ></input>
        </div>
        <div>vs</div>
        <div className="voteAnswer versusAnswer">
          <input
            className="VoteAnswerInput versusAnswerInput"
            value={newVoteItems[1] ? newVoteItems[1].content : ""}
            onChange={(e) => {
              dispatch(setItems({ idx: 1, content: e.target.value }));
            }}
          ></input>
        </div>
      </div>
      <div className={itemShake ? "voteItemErr voteItem" : "voteItem"}>
        ! 두 개의 대결항목이 모두 필요합니다.
      </div>

      <div className="voteLabel topMargin10">
        &#128073; 설문 옵션을 선택하세요.
      </div>
      <div className="voteOptionItems">
        <div className="voteOptionItem">
          <div
            className="fakeCheck"
            onClick={() => {
              dispatch(setMultiple(!newVoteMp));
            }}
          >
            <svg
              viewBox="0 0 24 24"
              visibility={newVoteMp ? "visible" : "hidden"}
            >
              <polyline points="19 7 10 17 5 12" />
            </svg>
          </div>
          <label htmlFor="voteMultiple">다중선택 가능</label>
        </div>
        <div className="voteOptionItem">
          <div
            className="fakeCheck"
            onClick={() => {
              dispatch(setManyTimes(!newVoteMt));
            }}
          >
            <svg
              viewBox="0 0 24 24"
              visibility={newVoteMt ? "visible" : "hidden"}
            >
              <polyline points="19 7 10 17 5 12" />
            </svg>
          </div>
          <label htmlFor="voteManytimes">여러번 응답 가능</label>
        </div>
      </div>
      <VoteButton
        everytingIsOk={everytingIsOk}
        setTitleShake={setTitleShake}
        setItemShake={setItemShake}
      />
    </div>
  );
}

function WordCloud() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteTitle = newVote.title;
  const newVoteMt = newVote.manytimes;
  const dispatch = useDispatch();

  const [titleShake, setTitleShake] = useState(false);
  const [everytingIsOk, setEverythingIsOk] = useState(false);

  useEffect(() => {
    if (newVote.title) {
      setTitleShake(false);
      setEverythingIsOk(true);
    } else {
      setEverythingIsOk(false);
    }
  }, [newVote.title]);

  return (
    <div className="voteMakerCon">
      <label
        className={titleShake ? "voteLabel shakeIt" : "voteLabel"}
        htmlFor="voteTitle"
      >
        &#128073; 설문 제목을 입력하세요.
      </label>
      <input
        className="VotetextInput"
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <div className={titleShake ? "voteTitleErr voteTitle" : "voteTitle"}>
        ! 설문 제목은 필수 항목입니다.
      </div>

      <div className="voteLabel topMargin10">
        &#128073; 설문 옵션을 선택하세요.
      </div>

      <div className="voteOptionItems">
        <div className="voteOptionItem">
          <div className="fakeCheck disabled"></div>
          <label htmlFor="voteMultiple" className="disabledText">
            다중선택 가능
          </label>
        </div>
        <div className="voteOptionItem">
          <div
            className="fakeCheck"
            onClick={() => {
              dispatch(setManyTimes(!newVoteMt));
            }}
          >
            <svg
              viewBox="0 0 24 24"
              visibility={newVoteMt ? "visible" : "hidden"}
            >
              <polyline points="19 7 10 17 5 12" />
            </svg>
          </div>
          <label htmlFor="voteManytimes">여러번 응답 가능</label>
        </div>
      </div>
      <VoteButton everytingIsOk={everytingIsOk} setTitleShake={setTitleShake} />
    </div>
  );
}

export default VoteMaker;
