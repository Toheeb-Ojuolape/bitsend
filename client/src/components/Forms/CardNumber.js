import { TextField } from "@mui/material";
import React, { useState } from "react";

const CardNumber = ({setInput}) => {
  const [cardNumber, setCardNumber] = useState(undefined);

  const formatCardNumber = (value) => {
    const sanitizedValue = value.replace(/\s/g, "").slice(0, 16); // Remove spaces and limit to 16 digits
    let formattedNumber = "";

    for (let i = 0; i < sanitizedValue.length; i += 4) {
      formattedNumber += sanitizedValue.substr(i, 4) + " ";
    }

    return formattedNumber.trim();
  };

  const handleChange = (e) => {
    let { value } = e.target;

    // Remove any non-digit characters
    value = value.replace(/\D/g, "");

    // Apply the card number formatting
    const formattedCardNumber = formatCardNumber(value);
    setCardNumber(formattedCardNumber);
    setInput(e.target.value)
  };

  return (
    <div>
      <label htmlFor="cardNumber">Card Number</label>
      <TextField
        type="text"
        id="cardNumber"
        value={cardNumber}
        onChange={handleChange}
        placeholder="1234 5678 9012 3456"
        maxLength="19"
        inputMode={"numeric"}
        fullWidth
        size={"small"}
      />
    </div>
  );
};

export default CardNumber;
