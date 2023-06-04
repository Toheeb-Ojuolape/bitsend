import "./Home.css";
import PaymentForm from "../payment/PaymentForm";
import { useEffect } from "react";
import axios from "axios";
import React from "react";

function Home(props) {
  const [rate, setRate] = React.useState("");
  const [currency] = React.useState("NGN");
  const [newCurrency, setNewCurrency] = React.useState("USD");

  useEffect(() => {
    axios({
      method: "POST",
      url: process.env.REACT_APP_API_URL+"/converter",
      headers: {
        Accept: "*/*",
        ContentType: "application/json",
      },
      data: {
        currency: newCurrency,
        newCurrency: currency,
      },
    }).then((response) => {
      setRate(response.data);
    });
  }, [setRate,currency,newCurrency]);


  const changeCurrency = (currency) =>{
    axios({
      method: "POST",
      url: process.env.REACT_APP_API_URL+"/converter",
      headers: {
        Accept: "*/*",
        ContentType: "application/json",
      },
      data: {
        currency: "NGN",
        newCurrency: currency,
      },
    }).then((response) => {
      setRate(response.data);
      setNewCurrency(currency)
    });
  }

  return (
    <div id={props.id} className="homePage">
      <PaymentForm
        rate={rate}
        currency={currency}
        newCurrency={newCurrency}
        setNewCurrency={(e) => setNewCurrency(e.target.value)}
        changeCurrency={(e)=>changeCurrency(e.target.value)}
        payment = {props.payment}
      />
    </div>
  );
}

export default Home;
