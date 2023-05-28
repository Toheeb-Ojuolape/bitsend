import React from "react";
import { TextField } from "@mui/material";

function TextInput({ label, type,helper }) {
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
      />
    </div>
  );
}

export default TextInput;
