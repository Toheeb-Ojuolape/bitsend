import React from "react";
import "./PaymentForm.css";
import InputWithSelect from "../Forms/InputWithSelect";
import { MdRefresh } from "react-icons/md";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import { useNavigate } from "react-router-dom";

function PaymentForm(props) {
  const [value, setValue] = React.useState("");
  const history = useNavigate()

  const nextStep = () =>{
    history("/recipient")
  }
  return (
    <div className="paymentContainer">
      <div className="paymentCard">
        <div className="chip">
          {props.newCurrency} 1 = {props.currency} {props && props.rate}
        </div>
        <InputWithSelect
          value={value}
          setValue={(e) => setValue(e)}
          changeCurrency={props.changeCurrency}
          label={"You Send"}
          currencyValue={props.newCurrency}
        />
        <div className="refreshIcon">
          <MdRefresh color="white" />
        </div>
        <InputWithSelect
          value={value ==="" ?"": value * props.rate}
          label={"Recipient Gets"}
          currencyValue={props.currency}
        />

        <PrimaryBtn onClick={nextStep} disabled={value === ""? true : false} title={"Make Payment"}/>
      </div>
    </div>
  );
}

export default PaymentForm;
