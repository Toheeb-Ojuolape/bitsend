import React from "react";
import UserDetails from "../components/Intermediary/UserDetails";
// import CardDetails from "../components/Intermediary/CardDetails";
import "../components/Intermediary/intermediary.css";
// import Stepper from "../components/Intermediary/Steppers";

function Intermediary({ id, goBack,code }) {
  // const goToUserDetails = () => {
  //   setActiveStep(0)
  //   document.getElementById("cardId").style.display = "none";
  //   document.getElementById("userId").style.display = "block";
  // };

  const next = () => {
    window.scrollTo(0,0)
    document.getElementById("intermediary").style.display = "none";
    document.getElementById("home").style.display = "flex";
  };
  return (
    <div id={id} className="homePage hiddenForm">
      {/* <Stepper activeStep={activeStep} /> */}
      <UserDetails id="userId" goBack={goBack} next={next}  code={code}/>
      {/* <CardDetails id="cardId" goBack={goToUserDetails} /> */}
    </div>
  );
}

export default Intermediary;
