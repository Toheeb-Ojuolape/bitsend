import React, { useState } from "react";
import "./intermediary.css";
import IconBtn from "../Buttons/IconBtn";
import { MdArrowBack } from "react-icons/md";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import CardExpiry from "../Forms/CardExpiry";
import CardCVV from "../Forms/CardCVV";
import CardNumber from "../Forms/CardNumber";

function CardDetails({ goBack,id }) {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const saveDetails = () => {
    // show the next form
    setLoading(false)
    setDisabled(false)
  };

  return (
    <div id={id} className="formContainer hiddenForm">
      <IconBtn
        onClick={() => goBack()}
        icon={<MdArrowBack />}
        color={"#753ff6"}
        bgColor={"#ececff"}
      />
      <h2>Enter your Card Details</h2>
      <p className="description">
        <span className="brandcolor">Why we need your card details:</span>{" "}
        Although Bit⚡Send is built ontop of Lightning and Bitcoin, we still
        need access to your local bank card to perform off-ramp payments to
        non-bitcoin users. You will get the equivalent of the amount paid to
        your lightning wallet before we debit your card. You can opt-out at
        ANYTIME
      </p>

      <div className="userDetailsForm">
        <CardNumber />


        <div className="cardDetails">
        <CardExpiry />
        <CardCVV />
        </div>


        <PrimaryBtn
          title={"Save Card Details"}
          disabled={disabled}
          loading={loading}
          onClick={saveDetails}
        />
      </div>
    </div>
  );
}

export default CardDetails;
