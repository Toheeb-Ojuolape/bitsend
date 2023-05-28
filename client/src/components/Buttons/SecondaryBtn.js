import React from "react";
import "./Buttons.css";

function SecondaryBtn(props) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={props.disabled ? "disabled":"secondaryBtn"}
      loading={props.loading}
    >
      {props.title} {props.disabled} 
     
    
    </button>
  );
}

export default SecondaryBtn;
