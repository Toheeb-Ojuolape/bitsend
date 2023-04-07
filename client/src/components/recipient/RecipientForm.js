import React from "react";
import "./RecipientForm.css";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import SearchForm from "../Forms/SearchForm";
import InputNumber from "../Forms/InputNumber";
import InputText from "../Forms/InputText";
import axios from "axios";
import Loader from "../Loaders/Overlay";
import InputEmail from "../Forms/InputEmail";


function RecipientForm(props) {
  const [email,setEmail] = React.useState("")
  const [selectedOption, setSelectedOption] = React.useState("");
  const [accountName,setAccountName] = React.useState("")
  const [loading, setLoading] = React.useState(false);

  const setAccountNumber = (e) =>{
    if(e.length === 10){
        setLoading(true)
        axios({
            method:"POST",
            url:"http://localhost:3001/resolve-bank",
            headers:{
                "Content-Type":"application/json",
                Accept:"*/*"
            },
            data:{
                bank:props.bank && props.bank.filter((bank)=>bank.name ===selectedOption)[0].code,
                accountNumber:e
            }
        }).then((response)=>{
            setAccountName(response.data.data.account_name)
            setLoading(false)
            console.log(email)
        }).catch((error)=>{
            console.log(error)
            setLoading(false)
        })
    }
  }

  return (
    <div className="paymentContainer">
      <div className="paymentCard">
      {loading && <Loader />}

      <InputEmail onChange={(e)=>setEmail(e)} disabled={false} label={"Recipient Email (required)"}/>

        <SearchForm
          label={"Choose Bank (required)"}
          options={props.bank}
          onChange={(event) => setSelectedOption(event.target.value)}
        />

        <InputNumber onChange={(e)=>setAccountNumber(e)} label={"Account Number"} />

        <InputText value={accountName} disabled={true} label={"Account Name"} />
        <PrimaryBtn
          disabled={accountName === ""? true : false}
          title={"Continue"}
        />
      </div>
    </div>
  );
}

export default RecipientForm;
