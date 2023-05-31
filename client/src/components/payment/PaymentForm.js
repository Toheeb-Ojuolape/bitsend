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
  const [disabled, setDisabled] = React.useState(true)

  const foreignCurrencies = [
    { name: "NGN", value: "NGN" },
    { name: "USD", value: "USD" },
    { name: "GBP", value: "GBP" },
    { name: "EUR", value: "EUR" },
  ];

  const localCurrencies = [
    { name: "KES", value: "KES" },
    { name: "NGN", value: "NGN" },
    { name: "GHS", value: "GHS" },
    { name: "ZAR", value: "ZAR" },
    { name: "TZS", value: "TZS" },
    { name: "UGX", value: "UGX" },
  ];


  React.useEffect(()=>{
    if(value === ""  && destination === ""){
      setDisabled(true)
    }
    else{
      setDisabled(false)
    }
  },[value,destination,props])

  const nextStep = () => {
    setLoading(true);
    axios({
      method: "GET",
      url:
        "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=" +
        props.newCurrency,
      headers: {
        Authorization:
          "Apikey "+process.env.REACT_APP_CRYPTO_PRICES,
      },
    }).then((response) => {
      const payload = {
        amount: value ? value : props.payment.amount,
        currency: props.newCurrency
          ? props.newCurrency
          : props.payment.currency,
        localAmount:
          value === "" ? props.payment.amount * props.rate : value * props.rate,
        localCurrency: props.currency ? props.currency : props.payment.currency,
        destination: destination ? destination : props.payment.destination,
        sats:
          (((value ? value : props.payment.amount) * 1) /
            response.data[props.newCurrency]) *
          100000000,
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
          currencies={foreignCurrencies}
        />
        <div className="refreshIcon">
          <ReloadIcon />
        </div>
        <label>Recipient gets</label>
        <InputWithSelect
          value={
            value === ""
              ? props.payment.amount * props.rate
              : value * props.rate
          }
          currencies={localCurrencies}
          currencyValue={props.currency}
          readonly={true}
        />

        <Select
          setDestination={(e) => setDestination(e)}
          value={props.payment.destination}
        />

        <PrimaryBtn
          onClick={nextStep}
          disabled={disabled}
          title={"Make Payment"}
        />
      </div>
    </div>
  );
}

export default PaymentForm;
