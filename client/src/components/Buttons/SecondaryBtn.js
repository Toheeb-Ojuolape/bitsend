import React from "react";
import "./Buttons.css";

function SecondaryBtn({onClick,disabled,loading,title}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={disabled ? "disabled":"secondaryBtn"}
      loading={loading}
    >
      {title}
     
    
    </button>
  );
}

export default SecondaryBtn;
