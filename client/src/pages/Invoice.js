import React, { useEffect } from 'react'
import InvoiceComponent from '../components/payment/Invoice'
import SuccessComponent from '../components/payment/SuccessComponent';
import axios from 'axios'
import { io } from "socket.io-client";

function Invoice() {
const [invoice,setInvoice] = React.useState("")
const invoiceComponent = document.getElementById("invoice")
const successComponent = document.getElementById("success")


useEffect(() => {
  const socket = io("http://localhost:3000");
  socket.on("payment-completed", () => {
    invoiceComponent.style.display = "none"
    successComponent.style.display = "block"
  });
},[invoiceComponent,successComponent])


useEffect(()=>{
    axios({
        method:"POST",
        url:"http://localhost:3000/generate-invoice",
        headers:{
            "Content-Type":"application/json",
            Accept:"*/*"
        },
        data:{
          amount:"500"
        }

    }).then((response)=>{
        setInvoice(response.data)
    })
},[])

  return (
    <div className="container">
      <InvoiceComponent invoice={invoice}/>
      <SuccessComponent />
    </div>
  )
}

export default Invoice