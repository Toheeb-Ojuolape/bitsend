import { TextField } from "@mui/material";
import React from "react";
import "./Form.css"

function InputEmail(props) {
  return (
    <div className="formContainer">
      <TextField defaultValue={props.value} onChange={(e)=>props.onChange(e.target.value)} className="form" label={props.label} type="email" variant="outlined" />
    </div>
  );
}

export default InputEmail;
