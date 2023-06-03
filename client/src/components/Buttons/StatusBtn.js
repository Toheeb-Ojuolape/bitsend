import React from "react";
import "./Buttons.css";

function StatusBtn({onClick,disabled,loading,title,className}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={"statusBtn "+className}
      loading={loading}
    >
      {title} 
     
    
    </button>
  );
}

export default StatusBtn;
