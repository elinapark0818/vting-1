import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  text: string;
}

function Dashboard({ text }: Props) {
  const navigate = useNavigate();
  return (
    <div>
      <p>{text}</p>
      <button onClick={() => navigate("/v")}>Go to New Vote Page</button>
    </div>
  );
}

Dashboard.defaultProps = {
  text: "This is Dashboard!",
};

export default Dashboard;
