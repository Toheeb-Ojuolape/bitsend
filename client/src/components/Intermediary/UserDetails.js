import React,{useEffect, useState} from "react";
import "./intermediary.css";
import TextInput from "../Forms/TextInput";
import SelectInput from "../Forms/SelectInput";
import countriesData from "../../data/countries.json";
import IconBtn from "../Buttons/IconBtn";
import { MdArrowBack } from "react-icons/md";
import PrimaryBtn from "../Buttons/PrimaryBtn";

function UserDetails({ goBack,next,id}) {
  const countries = countriesData;
  const [loading,setLoading] = useState(false)
  const [disabled,setDisabled] = useState(true)

  useEffect(()=>{
    setDisabled(false)
  },[])


  const saveDetails = () =>{
    // show the next form
    setLoading(true)
    next()
  }


  return (
    <div id={id} className="formContainer">
      <IconBtn
        onClick={() => goBack()}
        icon={<MdArrowBack />}
        color={"#753ff6"}
        bgColor={"#ececff"}
      />
      <h2>Tell us about you!</h2>
      <p className="description">
        As <span className="brandcolor">Bit⚡Send</span> is fully{" "}
        <span className="brandcolor">Open-source</span>, we promise to protect
        your data with all our strengths. You also have the option to opt-out
        from being an Intermediary at any time!
      </p>

      <div className="userDetailsForm">
        <TextInput
          label={"Give us a name"}
          helper={"Please DO NOT share your real name"}
          type={"text"}
        />

        <SelectInput
          defaultValue={"NG"}
          countries={countries}
          label={"Choose your country"}
        />

        <TextInput
          label={"Email for notifications (optional)"}
          type={"email"}
        />

        <PrimaryBtn
          title={"Save Details"}
          disabled={disabled}
          loading={loading}
          onClick={saveDetails}
        />
      </div>
    </div>
  );
}

export default UserDetails;
