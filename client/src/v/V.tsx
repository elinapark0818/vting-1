import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface Props {
  text: string;
}

function V({ text }: Props) {
  const [message, setMessage] = useState("");
  const { number } = useParams();

  useEffect(() => {
    if (number) {
      setMessage("The number is" + number);
    } else {
      setMessage("No number was provided");
    }
  }, []);

  return (
    <div>
      <p>{text}</p>

      <p>{message}</p>
      <Link to="/">Go to the Home Page!</Link>
    </div>
  );
}

V.defaultProps = {
  text: "This is v!",
};

export default V;
