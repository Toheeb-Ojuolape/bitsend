import React, { useEffect } from 'react'
import InvoiceComponent from '../components/payment/Invoice'
import SuccessComponent from '../components/payment/SuccessComponent';
import axios from 'axios'
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import Loader from '../components/Loaders/Overlay';

function Invoice() {
const [invoice,setInvoice] = React.useState("")
const [loading,setLoading] = React.useState(false)
const payment = useSelector(state => state.payment.value)

useEffect(() => {
  const socket = io("http://localhost:3000");
  socket.on("payment-completed", () => {
    setLoading(true)
    axios({
      method:"POST",
      url:"http://localhost:3000/send-email",
      headers:{
       "Content-Type":"application/json",
       Accept:"*/*"
      },
      data: payment
    }).then((response)=>{
      setLoading(false)
      console.log(response)
      document.getElementById("invoice").style.display = "none"
      document.getElementById("success").style.display = "block"
    }).catch((error)=>{
      alert(error)
    })
  });
},[payment])


useEffect(()=>{
    axios({
        method:"POST",
        url:"http://localhost:3000/generate-invoice",
        headers:{
            "Content-Type":"application/json",
            Accept:"*/*"
        },
        data:{
          amount:(Math.floor(payment.sats)).toString(),
          accountNumber:payment.accountNumber,
          bank:payment.bank
        }

    }).then((response)=>{
        setInvoice(response.data)
    })
},[payment])

  return (
    <div className="container">
      {loading && <Loader/>}
      <InvoiceComponent invoice={invoice} payment={payment}/>
      <SuccessComponent payment={payment}/>
    </div>
  )
}

export default Invoice