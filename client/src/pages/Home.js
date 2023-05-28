import React from "react";
import HomeComponent from "../components/home/Home";
import { useSelector } from "react-redux";
import IntermediaryModal from "../components/Modals/IntermediaryModal";
import Intermediary from "./Intermediary";

function Home() {
  const payment = useSelector((state) => state.payment.value);
  const [showModal,setShowModal] = React.useState(true)
  const goBack = () =>{
    document.getElementById("intermediary").style.display = "none"
    document.getElementById("home").style.display = "flex"
  }

  const showIntermediary = () =>{
    setShowModal(false)
    document.getElementById("home").style.display = "none"
    setTimeout(()=>{
      document.getElementById("intermediary").style.display = "flex"
    },500)
  }

  const onClose = () =>{
    setShowModal(false)
  }

  return (
    <div>
      <HomeComponent id={"home"} payment={payment} />
      <IntermediaryModal
        title={"Become a BitSend Intermediary! ⚡"}
        description={
          "Enable open-source remittance to and within Africa by providing BitSend access to your Lightning wallet for off-ramp payments to users"
        }
        btnTitle={"Yes, enrol me"}
        onClick={()=>showIntermediary()}
        showModal={showModal}
        onClose={onClose}
      />

      <Intermediary id={"intermediary"} goBack={goBack}/>
    </div>
  );
}

export default Home;
