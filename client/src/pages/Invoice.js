import React, { useEffect } from 'react'
import InvoiceComponent from '../components/payment/Invoice'
import axios from 'axios'

function Invoice() {
const [invoice,setInvoice] = React.useState("")

useEffect(()=>{
    axios({
        method:"POST",
        url:"http://localhost:3001/generate-invoice",
        headers:{
            "Content-Type":"application/json",
            Accept:"*/*"
        }
    }).then((response)=>{
        setInvoice(response.data)
    })
},[])

  return (
    <div className="container">
      <InvoiceComponent invoice={invoice}/>
    </div>
  )
}

export default Invoice