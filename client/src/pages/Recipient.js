import React, { useEffect } from 'react'
import RecipientForm from '../components/recipient/RecipientForm'
import axios from 'axios'
import { useSelector } from 'react-redux'

function Recipient() {
const [bank,setBank] = React.useState([])
const payment = useSelector(state => state.payment.value)
useEffect(()=>{
  console.log(payment.destination)
    axios({
        method:"POST",
        url:process.env.REACT_APP_API_URL+"/fetch-banks",
        headers:{
            "Content-Type":"application/json",
            Accept:"*/*"
        },
        data:{
          country:payment.destination ? payment.destination:"NG"
        }
    }).then((response)=>{
        setBank(response.data.data)
    })
},[payment])

  return (
    <div className="homePage">
      <RecipientForm  bank={bank}/>
    </div>
  )
}

export default Recipient