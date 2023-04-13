import React from "react";
import "./PaymentForm.css";
import InputWithSelect from "../Forms/InputWithSelect";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import { useNavigate } from "react-router-dom";
import Select from "../Forms/Select";
import { setPayment } from "../../store/payment";
import { useDispatch } from "react-redux";
import axios from "axios";
import ReloadIcon from "../../assets/reload";
import Loader from "../Loaders/Overlay";

function PaymentForm(props) {
  const [value, setValue] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const history = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const nextStep = () => {
    setLoading(true);
    axios({
      method: "GET",
      url:
        "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=" +
        props.newCurrency,
      headers: {
        Authorization:
          "Apikey 86d1a3aae01e824d0545ebe7dc6f355993b48cebe2dc06b670db2d6dfe564702",
      },
    }).then((response) => {
      const payload = {
        amount: value ? value : props.payment.amount,
        currency: props.newCurrency ? props.newCurrency : props.payment.currency,
        destination: destination ? destination: props.payment.destination,
        sats: (1 / response.data[props.newCurrency]) * 100000000,
      };
      dispatch(setPayment(payload));
      setLoading(false);
      history("/recipient");
    });
  };
  return (
    <div className="paymentContainer">
      <div className="paymentCard">
      {loading && <Loader />}
        <div className="chip">
          {props.newCurrency} 1 = {props.currency} {props && props.rate}
        </div>
        <InputWithSelect
          value={value}
          setValue={(e) => setValue(e)}
          changeCurrency={props.changeCurrency}
          label={"You Send"}
          currencyValue={props.newCurrency}
          readonly={false}
          defaultValue={props.payment.amount}
        />
        <div className="refreshIcon">
          <ReloadIcon />
        </div>
        <label>Recipient gets</label>
        <InputWithSelect
          value={value === "" ? props.payment.amount * props.rate :  value * props.rate}
        
          currencyValue={props.currency}
          readonly={true}
        />

        <Select setDestination={(e) => setDestination(e)} value={props.payment.destination} />

        <PrimaryBtn
          onClick={nextStep}
          disabled={value === "" && props.payment.amount === undefined ? true : false}
          title={"Make Payment"}
        />
      </div>
    </div>
  );
}

export default PaymentForm;
