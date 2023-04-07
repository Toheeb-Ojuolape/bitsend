import "./Home.css";
import PaymentForm from "../payment/PaymentForm";
import { useEffect } from "react";
import axios from "axios";
import React from "react";

function Home() {
  const [rate, setRate] = React.useState("");
  const [currency] = React.useState("NGN");
  const [newCurrency, setNewCurrency] = React.useState("USD");

  useEffect(() => {
    axios({
      method: "POST",
      url: "http://localhost:3001/converter",
      headers: {
        Accept: "*/*",
        ContentType: "application/json",
      },
      data: {
        currency: newCurrency,
        newCurrency: currency,
      },
    }).then((response) => {
      console.log(response);
      setRate(response.data);
    });
  }, [setRate,currency,newCurrency]);


  const changeCurrency = (currency) =>{
    axios({
      method: "POST",
      url: "http://localhost:3001/converter",
      headers: {
        Accept: "*/*",
        ContentType: "application/json",
      },
      data: {
        currency: "NGN",
        newCurrency: currency,
      },
    }).then((response) => {
      console.log(response);
      setRate(response.data);
      setNewCurrency(currency)
    });
  }

  return (
    <div className="homePage">
      <PaymentForm
        rate={rate}
        currency={currency}
        newCurrency={newCurrency}
        setNewCurrency={(e) => setNewCurrency(e.target.value)}
        changeCurrency={(e)=>changeCurrency(e.target.value)}
      />
    </div>
  );
}

export default Home;
