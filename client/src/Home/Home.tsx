import React from "react";

interface Props {
  text: string;
}

function Home({ text }: Props) {
  return <div>{text}</div>;
}

Home.defaultProps = {
  text: "This is Home!",
};

export default Home;
