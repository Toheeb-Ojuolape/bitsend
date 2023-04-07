import { TextField } from "@mui/material";
import React from "react";

function InputText(props) {
  return (
    <div className="formContainer">
      <TextField value={props.value} disabled={props.disabled} className="form" label={props.label} type="text" variant="outlined" />
    </div>
  );
}

export default InputText;