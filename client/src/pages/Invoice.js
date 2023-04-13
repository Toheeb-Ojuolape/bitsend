import React, { useEffect } from 'react'
import InvoiceComponent from '../components/payment/Invoice'
import SuccessComponent from '../components/payment/SuccessComponent';
import axios from 'axios'
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';

function Invoice() {
const [invoice,setInvoice] = React.useState("")
const invoiceComponent = document.getElementById("invoice")
const successComponent = document.getElementById("success")
const payment = useSelector(state => state.payment.value)

useEffect(() => {
  const socket = io("http://localhost:3000");
  socket.on("payment-completed", () => {
    axios({
      method:"POST",
      url:"http://localhost:3000/send-email",
      headers:{
       "Content-Type":"application/json",
       Accept:"*/*"
      },
      data: payment
    }).then((response)=>{
      console.log(response)
      invoiceComponent.style.display = "none"
      successComponent.style.display = "block"
    }).catch((error)=>{
      alert(error)
    })
  });
},[invoiceComponent,successComponent,payment])


useEffect(()=>{
    axios({
        method:"POST",
        url:"http://localhost:3000/generate-invoice",
        headers:{
            "Content-Type":"application/json",
            Accept:"*/*"
        },
        data:{
          amount:(Math.floor(payment.sats)).toString()
        }

    }).then((response)=>{
        setInvoice(response.data)
    })
},[payment])

  return (
    <div className="container">
      <InvoiceComponent invoice={invoice} payment={payment}/>
      <SuccessComponent payment={payment}/>
    </div>
  )
}

export default Invoice