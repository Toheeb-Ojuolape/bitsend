import { TextField } from "@mui/material";
import React, { useState } from "react";

const CardCVV = ({setInput}) => {
  const [cvv, setCVV] = useState("");

  const handleChange = (e) => {
    let value = e.target.value;
    // Limit the input to three characters
    if (value.length > 3) {
      value = value.slice(0, 3); // Truncate the value to three characters
    }
    e.target.value = value;
    setCVV(value)
    setInput(value)
  };

  return (
    <div>
      <label htmlFor="cardExpiry">CVV</label>
      <TextField
        type="number"
        id="cardExpiry"
        value={cvv}
        onChange={handleChange}
        maxLength="3"
        variant={"outlined"}
        fullWidth
        size={"small"}
        inputMode="numeric"
      />
    </div>
  );
};

export default CardCVV;
