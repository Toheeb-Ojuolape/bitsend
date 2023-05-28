import { TextField } from "@mui/material";
import React, { useState } from "react";

const CardExpiry = () => {
  const [expiry, setExpiry] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    const formattedExpiry = formatExpiry(value);
    setExpiry(formattedExpiry);
  };

  const formatExpiry = (value) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 4); // Remove non-digit characters and limit to 4 digits
    const month = sanitizedValue.slice(0, 2);
    const year = sanitizedValue.slice(2, 4);
    let formattedExpiry = "";

    if (month) {
      formattedExpiry += month;
      if (month.length === 2) {
        formattedExpiry += "/";
      }
    }

    if (year) {
      formattedExpiry += year;
    }

    return formattedExpiry;
  };

  return (
    <div>
      <label htmlFor="cardExpiry">Card Expiry</label>
      <TextField
        type="text"
        id="cardExpiry"
        value={expiry}
        onChange={handleChange}
        placeholder="MM/YY"
        maxLength="5"
        variant={"outlined"}
        fullWidth
        size={"small"}
        inputMode="numeric"
      />
    </div>
  );
};

export default CardExpiry;
