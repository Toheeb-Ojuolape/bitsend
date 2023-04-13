import React from "react";
import "./PaymentForm.css";
import InputWithSelect from "../Forms/InputWithSelect";
import { MdRefresh } from "react-icons/md";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import { useNavigate } from "react-router-dom";
import Select from "../Forms/Select";
import { setPayment } from "../../store/payment";
import {useDispatch} from "react-redux"
import axios from "axios";


function PaymentForm(props) {
  const [value, setValue] = React.useState("");
  const [destination,setDestination] = React.useState("")
  const history = useNavigate()
  const dispatch = useDispatch()
  


  const nextStep = () =>{
    axios({
      method:"GET",
      url:"https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms="+props.newCurrency,
      headers:{
        Authorization:"Apikey 86d1a3aae01e824d0545ebe7dc6f355993b48cebe2dc06b670db2d6dfe564702"
      }
    }).then((response)=>{
      const value = {
        amount:12,
        currency:props.newCurrency,
        destination:destination,
        sats:(1/response.data[props.newCurrency])*100000000
      }
      dispatch(setPayment(value))
      history("/recipient")
    })
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

    
        <Select setDestination={(e)=>setDestination(e)}/>

        <PrimaryBtn onClick={nextStep} disabled={value === ""? true : false} title={"Make Payment"}/>
      </div>
    </div>
  );
}

export default PaymentForm;
