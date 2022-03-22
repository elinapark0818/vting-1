import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setType,
  setItems,
  setMultiple,
  setManyTimes,
  setItem,
  setIndex,
  RootState,
} from "../store/index";
import { Oval } from "react-loader-spinner";

function VoteMaker() {
  const newVoteFormat = useSelector(
    (state: RootState) => state.makeNewVote.format
  );

  switch (newVoteFormat) {
    case "barVer":
      return <BarVertical />;
    case "barHor":
      return <BarHorizontal />;
    case "open":
      return <OpenEnded />;
    case "versus":
      return <Versus />;
    case "word":
      return <WordCloud />;
    default:
      return (
        <div className="voteMakerCon">
          <Oval color="#00BFFF" height={80} width={80} />
        </div>
      );
  }
}

// 세로 바 그래프
function BarVertical() {
  const newVoteTitle = useSelector(
    (state: RootState) => state.makeNewVote.title
  );
  const newVoteItems = useSelector(
    (state: RootState) => state.makeNewVote.items
  );
  const newVoteItem = useSelector((state: RootState) => state.makeNewVoteItem);
  const dispatch = useDispatch();

  const plusTriger = () => {
    dispatch(setItems(newVoteItem));
    dispatch(setIndex(newVoteItems.length + 2));
    dispatch(setItem(""));
    console.log(newVoteItems);
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
          <div>{el.idx}</div>
          <input
            value={el.content}
            readOnly
            // onChange={(e) => dispatch(setItem(e.target.value))}
          ></input>
        </div>
      ))}
      <div>{newVoteItem.idx}</div>
      <input
        value={newVoteItem.content}
        onChange={(e) => dispatch(setItem(e.target.value))}
      ></input>
      <div onClick={() => plusTriger()}>+</div>
      <br />
      <br />
      <label htmlFor="voteMultiple">다중선택 가능</label>
      <input type="checkbox" name="voteMultiple" />
      <br />
      <br />
      <label htmlFor="voteManytimes">여러번 응답 가능</label>
      <input type="checkbox" name="voteManytimes" />
    </div>
  );
}

// 가로 바 그래프
function BarHorizontal() {
  const newVoteTitle = useSelector(
    (state: RootState) => state.makeNewVote.title
  );
  const newVoteItems = useSelector(
    (state: RootState) => state.makeNewVote.items
  );
  const newVoteItem = useSelector((state: RootState) => state.makeNewVoteItem);
  const dispatch = useDispatch();

  const plusTriger = () => {
    dispatch(setItems(newVoteItem));
    dispatch(setIndex(newVoteItems.length + 2));
    dispatch(setItem(""));
    console.log(newVoteItems);
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
          <div>{el.idx}</div>
          <input
            value={el.content}
            readOnly
            // onChange={(e) => dispatch(setItem(e.target.value))}
          ></input>
        </div>
      ))}
      <div>{newVoteItem.idx}</div>
      <input
        value={newVoteItem.content}
        onChange={(e) => dispatch(setItem(e.target.value))}
      ></input>
      <div onClick={() => plusTriger()}>+</div>
      <br />
      <br />
      <label htmlFor="voteMultiple">다중선택 가능</label>
      <input type="checkbox" name="voteMultiple" />
      <br />
      <br />
      <label htmlFor="voteManytimes">여러번 응답 가능</label>
      <input type="checkbox" name="voteManytimes" />
    </div>
  );
}

function OpenEnded() {
  const newVoteTitle = useSelector(
    (state: RootState) => state.makeNewVote.title
  );
  const newVoteItems = useSelector(
    (state: RootState) => state.makeNewVote.items
  );
  const newVoteItem = useSelector((state: RootState) => state.makeNewVoteItem);
  const dispatch = useDispatch();

  const plusTriger = () => {
    dispatch(setItems(newVoteItem));
    dispatch(setIndex(newVoteItems.length + 2));
    dispatch(setItem(""));
    console.log(newVoteItems);
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
      <label htmlFor="voteMultiple" className="disabledLabel">
        다중선택 가능
      </label>
      <input type="checkbox" disabled name="voteMultiple" />
      <br />
      <br />
      <label htmlFor="voteManytimes">여러번 응답 가능</label>
      <input type="checkbox" name="voteManytimes" />
    </div>
  );
}

function Versus() {
  return <div className="voteMakerCon">대결</div>;
}

function WordCloud() {
  return <div className="voteMakerCon">워드클라우드</div>;
}

export default VoteMaker;
