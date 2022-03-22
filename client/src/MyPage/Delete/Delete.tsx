import React from "react";

interface Props {
  text: string;
}

function Delete({ text }: Props) {
  return <div>{text}</div>;
}

Delete.defaultProps = {
  text: "This is Delete!",
};

export default Delete;
