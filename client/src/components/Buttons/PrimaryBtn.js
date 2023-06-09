import React from "react";
import "./Buttons.css";

function PrimaryBtn({onClick,disabled,loading,title}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={disabled ? "disabled":"primaryBtn"}
      loading={loading}
    >
      {title} {disabled} 
     
    
    </button>
  );
}

export default PrimaryBtn;
