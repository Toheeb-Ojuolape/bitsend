import React from "react";
import successGif from "../../assets/success.gif";

function SuccessComponent(props) {
  const goHome = () => {
    sessionStorage.removeItem("sessionDetails")
    window.location.href = "/";
  };
  return (
    <div id="success" className="successContainer hiddenComponent">
      <div>
        <div className="successContainer">
          <img width="200px" src={successGif} alt="success" />
        </div>
        <p className="successDescription">
          {" "}
          You have successfully made a payment of {props.payment.currency}{" "}
          {props.payment.amount} to <strong className="brandcolor">{props.payment.accountName}</strong> with account
          details:
          
          <p>{" "}
          {props.payment.accountNumber
            ? `Account Number: ${props.payment.accountNumber}`
            : ""}
            </p>
          <p>
          {props.payment.bankName
            ? `Bank: ${props.payment.bankName}`
            : ""}
            </p>

           <p>
           {props.payment.destination
            ? `Country: ${props.payment.destination}`
            : ""}
           </p>
        </p>

        <div className="successAction">
          <button onClick={goHome} className="btn-outline">
            Send Another
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessComponent;
