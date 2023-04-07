import React from "react";
import { TextField } from "@mui/material";

function InputWithSelect(props) {
  return (
    <div className="">
      <TextField
        size="small"
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*",
        notched: false,
        style: {
            border: 'none',
            boxShadow: 'none',
            borderRadius: 0
          }}}
        label={props.label}
        variant="outlined"
        className="form"
        type="number"
        value={props.value}
        onChange={(e)=>props.setValue(e.target.value)}
      />
      <select
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        value={props.currencyValue}
        onChange={props.changeCurrency}
      >
        <option className="NGN">NGN</option>
        <option className="USD">USD</option>
        <option className="GBP">GBP</option>
      </select>
    </div>
  );
}

export default InputWithSelect;
