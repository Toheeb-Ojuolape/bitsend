import React, { useEffect } from 'react'
import RecipientForm from '../components/recipient/RecipientForm'
import axios from 'axios'

function Recipient() {
const [bank,setBank] = React.useState([])
useEffect(()=>{
    axios({
        method:"POST",
        url:"http://localhost:3000/fetch-banks",
        headers:{
            "Content-Type":"application/json",
            Accept:"*/*"
        }
    }).then((response)=>{
        setBank(response.data.data)
    })
},[])

  return (
    <div className="homePage">
      <RecipientForm  bank={bank}/>
    </div>
  )
}

export default Recipient