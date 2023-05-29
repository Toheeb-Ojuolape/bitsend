import React from "react";
import { TextField } from "@mui/material";

function TextInput({ label, type,helper,setInput }) {
  const setValue = (e) =>{
   setInput(e)
  }
  return (
    <div>
      <label className="label">{label}</label>
      <TextField
        margin="normal"
        fullWidth
        size="small"
        type={type}
        label={label}
        variant={"outlined"}
        helperText={helper}
        style={{margin:"6px 0px 0px 0px",paddingTop:"0px"}}
        onChange={(e)=>setValue(e.target.value)}
      />
    </div>
  );
}

export default TextInput;
