import React from "react";
import successGif from "../../assets/success.gif";

function SuccessComponent() {

const goHome = () =>{
    window.location.href = "/"
}
  return (
    <div id="success" className="successContainer hiddenComponent">
      <div>
        <div className="successContainer">
          <img width="200px" src={successGif} alt="success" />
        </div>
        <p className="successDescription">
          {" "}
          You have successfully made a payment of $amount to $recipient with
          account details $accountdetails
        </p>

        <div className="successAction">
          <button onClick={goHome} className="btn-outline">Send Another</button>
        </div>
      </div>
    </div>
  );
}

export default SuccessComponent;
