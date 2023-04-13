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
        url:"http://localhost:3000/fetch-banks",
        headers:{
            "Content-Type":"application/json",
            Accept:"*/*"
        },
        data:{
          country:payment.destination
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