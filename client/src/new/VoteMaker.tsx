import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setItems,
  setMultiple,
  setManyTimes,
  setItem,
  setIndex,
  setVersusItem,
  RootState,
} from "../store/index";
import vtinglogo from "../assets/vt_logo_2.png";

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
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteTitle = newVote.title;
  const newVoteMt = newVote.manytimes;
  const newVoteMp = newVote.multiple;
  const newVoteItems = newVote.items;
  const newVoteItem = useSelector((state: RootState) => state.makeNewVoteItem);
  const dispatch = useDispatch();
  const [isShake, setIsShake] = useState(false);

  const plusTriger = () => {
    if (newVoteItem.content) {
      dispatch(setItems(newVoteItem));
      dispatch(setIndex(newVoteItems.length));
      dispatch(setItem(""));
    } else {
      setIsShake(true);
      setTimeout(function () {
        setIsShake(false);
      }, 1000);
    }
  };

  return (
    <div className="voteMakerCon">
      <label className="voteLabel" htmlFor="voteTitle">
        &#128073; 설문 제목을 입력하세요.
      </label>
      <input
        className="VotetextInput"
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <div className="voteLabel topMargin10">
        &#128073; 객관식 응답을 입력하세요.
      </div>
      <div className="voteAnswers">
        {newVoteItems?.map((el, idx) => (
          <div key={idx} className="voteAnswer">
            <div className="answerIdx">{idx + 1}</div>
            <input
              className="VoteAnswerInput"
              value={el.content}
              readOnly
              // onChange={(e) => dispatch(setItem(e.target.value))}
            ></input>
          </div>
        ))}
        <div className={isShake ? "voteAnswer shakeIt" : "voteAnswer"}>
          <div className="answerIdx">{newVoteItems.length + 1}</div>
          <input
            className="VoteAnswerInput"
            value={newVoteItem.content}
            onChange={(e) => {
              dispatch(setItem(e.target.value));
            }}
          ></input>
          <div className="plusItem" onClick={() => plusTriger()}>
            +
          </div>
        </div>
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
    </div>
  );
}

function OpenEnded() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteTitle = newVote.title;
  const newVoteMt = newVote.manytimes;
  const newVoteItems = newVote.items;
  const dispatch = useDispatch();

  return (
    <div className="voteMakerCon">
      <label className="voteLabel" htmlFor="voteTitle">
        &#128073; 설문 제목을 입력하세요.
      </label>
      <input
        className="VotetextInput"
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
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
  const [vitem0, setVitem0] = useState(
    newVoteItems[0] ? newVoteItems[0].content : ""
  );
  const [vitem1, setVitem1] = useState(
    newVoteItems[1] ? newVoteItems[1].content : ""
  );

  return (
    <div className="voteMakerCon">
      <label className="voteLabel" htmlFor="voteTitle">
        &#128073; 설문 제목을 입력하세요.
      </label>
      <input
        className="VotetextInput"
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <div className="voteLabel topMargin10">
        &#128073; 대결 항목을 입력하세요.
      </div>
      <div className="voteAnswers">
        <div className="voteAnswer">
          <input
            className="VoteAnswerInput"
            value={vitem0}
            onChange={(e) => {
              setVitem0(e.target.value);
            }}
            onBlur={(e) => {
              dispatch(setVersusItem({ idx: 0, content: vitem0 }));
            }}
          ></input>
        </div>
        <div>vs</div>
        <div className="voteAnswer">
          <input
            className="VoteAnswerInput"
            value={vitem1}
            onChange={(e) => {
              setVitem1(e.target.value);
            }}
            onBlur={(e) => {
              dispatch(setVersusItem({ idx: 1, content: vitem1 }));
            }}
          ></input>
        </div>
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
    </div>
  );
}

function WordCloud() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteTitle = newVote.title;
  const newVoteMt = newVote.manytimes;
  const newVoteMp = newVote.multiple;
  const dispatch = useDispatch();

  return (
    <div className="voteMakerCon">
      <label className="voteLabel" htmlFor="voteTitle">
        &#128073; 설문 제목을 입력하세요.
      </label>
      <input
        className="VotetextInput"
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
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
    </div>
  );
}

export default VoteMaker;
