import { TextField } from "@mui/material";
import React from "react";
import "./Form.css"

function InputNumber(props) {
  return (
    <div className="formContainer">
      <TextField defaultValue={props.value} onChange={(e)=>props.onChange(e.target.value)} className="form" label={props.label} type="number" inputMode="numeric" variant="outlined" />
    </div>
  );
}

export default InputNumber;
