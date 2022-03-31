import React from "react";
import { AlertTemplateProps } from "react-alert";

export const AlertTemplate = ({
  message,
  options,
  style,
  close,
}: AlertTemplateProps) => {
  return (
    <div className="copyAlert">
      <span style={{ flex: 2 }}>{message}</span>
    </div>
  );
};

export const ImgAlertTemplate = ({
  message,
  options,
  style,
  close,
}: AlertTemplateProps) => {
  return (
    <div className="imgAlert">
      <button onClick={close} className="imgAlertBtn">
        x
      </button>
      <span style={{ flex: 2 }}>{message}</span>
    </div>
  );
};
