import React from "react";
import HomeComponent from "../components/home/Home";
import { useSelector } from "react-redux";
import IntermediaryModal from "../components/Modals/IntermediaryModal";

function Home() {
  const payment = useSelector((state) => state.payment.value);
  return (
  <div>
  <HomeComponent payment={payment} />
  <IntermediaryModal title={"Become a BitSend Intermediary! ⚡"} description={"Enable open-source remittance to and within Africa by providing BitSend access to your Lightning wallet for off-ramp payments to users"} btnTitle={"Yes, enrol me"}  />
  </div>
  )
}

export default Home;