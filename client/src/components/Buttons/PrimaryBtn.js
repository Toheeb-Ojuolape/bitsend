import React from "react";
import "./Buttons.css";

function PrimaryBtn(props) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.disabled ? "disabled":"primaryBtn"}
    >
      {props.title} {props.disabled}
    </button>
  );
}

export default PrimaryBtn;
