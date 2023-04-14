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
        value={props.value?props.value:props.defaultValue}
        onChange={(e)=>props.setValue(e.target.value)}
        disabled={props.readonly}
        defaultValue={props.defaultValue}
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

        {props.currencies && props.currencies.map((currency,i)=>(
          <option key={i} className={currency.value}>{currency.name}</option>
        ))}
      </select>
    </div>
  );
}

export default InputWithSelect;
