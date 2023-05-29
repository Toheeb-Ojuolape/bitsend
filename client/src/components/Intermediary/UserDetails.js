import React, { useEffect, useState } from "react";
import "./intermediary.css";
import TextInput from "../Forms/TextInput";
import SelectInput from "../Forms/SelectInput";
import countriesData from "../../data/countries.json";
import IconBtn from "../Buttons/IconBtn";
import { MdArrowBack } from "react-icons/md";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import Loader from "../Loaders/Overlay";
import axios from "axios";
import Swal from "sweetalert2"

function UserDetails({ goBack, next, id,code }) {
  const countries = countriesData;
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (name && country) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, country]);

  const saveDetails = () => {
    //create a user in the database with these details
    setLoading(true);
    axios({
      method: "POST",
      url: process.env.REACT_APP_API_URL + "/create-user",
      data: {
        name,
        email,
        country,
        pubKey: sessionStorage.getItem("userId"),
        code
      },
    })
      .then((response) => {
        console.log(response);
        setLoading(false);
        Swal.fire({
          icon:"success",
          title:"Details saved",
          text:response.data.message
        }).then((result)=>{
          if(result.isConfirmed){
            next()
          }
        })
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data);
        Swal.fire({
          icon:"error",
          title:"Something's wrong 🤔",
          text:error.response.data.message
        })
      });
  };

  return (
    <div id={id} className="intermediaryContainer">
      {loading && <Loader />}
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
          setInput={(e) => setName(e)}
        />

        <SelectInput
          countries={countries}
          label={"Choose your country"}
          setInput={(e) => setCountry(e)}
        />

        <TextInput
          label={"Email for notifications (optional)"}
          type={"email"}
          setInput={(e) => setEmail(e)}
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
