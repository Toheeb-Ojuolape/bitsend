import React, { useState,useEffect } from "react";
import "./intermediary.css";
import IconBtn from "../Buttons/IconBtn";
import { MdArrowBack } from "react-icons/md";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import CardExpiry from "../Forms/CardExpiry";
import CardCVV from "../Forms/CardCVV";
import CardNumber from "../Forms/CardNumber";
import axios from 'axios'
import Loader from "../Loaders/Overlay";

function CardDetails({ goBack, id }) {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setCardExpiry] = useState("");
  const [cvv, setCvv] = useState("");


  useEffect(()=>{
    if(cardNumber !=="" && expiry !=="" && cvv !==""){
      setDisabled(false)
    }
    else{
      setDisabled(true)
    }
  },[cardNumber,expiry,cvv])

  const saveDetails = () => {
    // show the next form
    setLoading(true)
    axios({
      method:"POST",
      url:process.env.REACT_APP_API_URL+"/create-card",
      data:{
        id:sessionStorage.getItem("userId"),
        cardNo:cardNumber,
        cardcvv:cvv,
        cardexpiry:expiry
      }
    }).then((response)=>{
      console.log(response)
      setLoading(false)
    }).catch((error)=>{
      console.log(error)
      setLoading(false)
    })
  };

  

  return (
    <div id={id} className="intermediaryContainer hiddenForm">
       {loading && <Loader />}
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
        <CardNumber setInput={(e) => setCardNumber(e)} />

        <div className="cardDetails">
          <CardExpiry setInput={(e) => setCardExpiry(e)} />
          <CardCVV setInput={(e) => setCvv(e)} />
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
