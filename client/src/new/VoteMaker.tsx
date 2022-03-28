import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setType,
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

  const plusTriger = () => {
    dispatch(setItems(newVoteItem));
    dispatch(setIndex(newVoteItems.length));
    dispatch(setItem(""));
  };

  return (
    <div className="voteMakerCon">
      <label htmlFor="voteTitle">설문 이름을 입력하세요.</label>
      <br />
      <input
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <br />
      <br />
      객관식 응답을 입력하세요.
      {newVoteItems?.map((el, idx) => (
        <div key={idx}>
          <div>{idx + 1}</div>
          <input
            value={el.content}
            readOnly
            // onChange={(e) => dispatch(setItem(e.target.value))}
          ></input>
        </div>
      ))}
      <div>{newVoteItems.length + 1}</div>
      <input
        value={newVoteItem.content}
        onChange={(e) => dispatch(setItem(e.target.value))}
      ></input>
      <div onClick={() => plusTriger()}>+</div>
      <br />
      <br />
      <label htmlFor="voteMultiple">다중선택 가능</label>
      <input
        type="checkbox"
        name="voteMultiple"
        checked={newVoteMp}
        onChange={(e) => dispatch(setMultiple(e.target.checked))}
      />
      <br />
      <br />
      <label htmlFor="voteManytimes">여러번 응답 가능</label>
      <input
        type="checkbox"
        name="voteManytimes"
        checked={newVoteMt}
        onChange={(e) => dispatch(setManyTimes(e.target.checked))}
      />
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
      <label htmlFor="voteTitle">설문 이름을 입력하세요.</label>
      <br />
      <input
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <br />
      <br />
      <label htmlFor="voteMultiple" className="disabledLabel">
        다중선택 가능
      </label>
      <input type="checkbox" disabled name="voteMultiple" />
      <br />
      <br />
      <label htmlFor="voteManytimes">여러번 응답 가능</label>
      <input
        type="checkbox"
        name="voteManytimes"
        checked={newVoteMt}
        onChange={(e) => dispatch(setManyTimes(e.target.checked))}
      />
    </div>
  );
}

function Versus() {
  const newVote = useSelector((state: RootState) => state.makeNewVote);
  const newVoteTitle = newVote.title;
  const newVoteMt = newVote.manytimes;
  const newVoteMp = newVote.multiple;
  const newVoteItems = newVote.items;
  const newVoteItem = useSelector((state: RootState) => state.makeNewVoteItem);
  const dispatch = useDispatch();
  const [vitem0, setVitem0] = useState(
    newVoteItems[0] ? newVoteItems[0].content : ""
  );
  const [vitem1, setVitem1] = useState(
    newVoteItems[1] ? newVoteItems[1].content : ""
  );

  return (
    <div className="voteMakerCon">
      <label htmlFor="voteTitle">설문 이름을 입력하세요.</label>
      <br />
      <input
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <br />
      <br />
      대결 항목을 입력하세요.
      <input
        value={vitem0}
        onChange={(e) => {
          setVitem0(e.target.value);
        }}
        onBlur={(e) => {
          dispatch(setVersusItem({ idx: 0, content: vitem0 }));
        }}
      ></input>
      <div>vs</div>
      <input
        value={vitem1}
        onChange={(e) => {
          setVitem1(e.target.value);
        }}
        onBlur={(e) => {
          dispatch(setVersusItem({ idx: 1, content: vitem1 }));
        }}
      ></input>
      <br />
      <br />
      <label htmlFor="voteMultiple">다중선택 가능</label>
      <input
        type="checkbox"
        checked={newVoteMp}
        onChange={(e) => dispatch(setMultiple(e.target.checked))}
      />
      <br />
      <br />
      <label htmlFor="voteManytimes">여러번 응답 가능</label>
      <input
        type="checkbox"
        name="voteManytimes"
        checked={newVoteMt}
        onChange={(e) => dispatch(setManyTimes(e.target.checked))}
      />
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
      <label htmlFor="voteTitle">설문 이름을 입력하세요.</label>
      <br />
      <input
        name="voteTitle"
        value={newVoteTitle}
        onChange={(e) => dispatch(setTitle(e.target.value))}
      ></input>
      <br />
      <br />
      <label htmlFor="voteMultiple" className="disabledLabel">
        다중선택 가능
      </label>
      <input
        type="checkbox"
        disabled
        name="voteMultiple"
        checked={newVoteMp}
        onChange={(e) => dispatch(setMultiple(e.target.checked))}
      />
      <br />
      <br />
      <label htmlFor="voteManytimes">여러번 응답 가능</label>
      <input
        type="checkbox"
        name="voteManytimes"
        checked={newVoteMt}
        onChange={(e) => dispatch(setManyTimes(e.target.checked))}
      />
    </div>
  );
}

export default VoteMaker;
