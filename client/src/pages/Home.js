import React from "react";
import HomeComponent from "../components/home/Home";
import { useSelector } from "react-redux";
import IntermediaryModal from "../components/Modals/IntermediaryModal";
import Intermediary from "./Intermediary";
import { useLocation } from "react-router-dom";

function Home() {
  const payment = useSelector((state) => state.payment.value);
  const [showModal, setShowModal] = React.useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");

  React.useEffect(() => {
   if(code !== null){
    setShowModal(false);
    document.getElementById("home").style.display = "none";
    setTimeout(() => {
      document.getElementById("intermediary").style.display = "flex";
    }, 100);
   }
  }, [code]);

  const goBack = () => {
    document.getElementById("intermediary").style.display = "none";
    document.getElementById("home").style.display = "flex";
  };

  const showIntermediary = () => {
    window.location.href =
      process.env.REACT_APP_ALBY_API_URL +
      process.env.REACT_APP_ALBY_CLIENT_ID +
      "&response_type=code&redirect_uri=" +
      process.env.REACT_APP_REDIRECT_URL +
      "&scope=account:read%20balance:read%20invoices:create%20invoices:read%20transactions:read";
  };

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <HomeComponent id={"home"} payment={payment} />
      <IntermediaryModal
        title={"Become a BitSend Intermediary! ⚡"}
        description={
          "Enable open-source remittance to and within Africa by providing BitSend access to your Lightning wallet for off-ramp payments to users"
        }
        btnTitle={"Yes, enrol me"}
        onClick={() => showIntermediary()}
        showModal={showModal}
        onClose={onClose}
      />

      <Intermediary id={"intermediary"} goBack={goBack} code={code} />
    </div>
  );
}

export default Home;
