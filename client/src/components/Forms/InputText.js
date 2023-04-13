import { TextField } from "@mui/material";
import React from "react";

function InputText(props) {
  return (
    <div className="formContainer">
      {props.label && <label>{props.label}</label>}
      <TextField value={props.value} disabled={props.disabled} className="form"  type="text" variant="outlined" />
    </div>
  );
}

export default InputText;