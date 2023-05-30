import React from "react";
import "./Login.css";
import { TextField } from "@mui/material";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import Swal from "sweetalert2"

function Login() {
  const goToLogin = () => {
    window.location.href = process.env.REACT_APP_API_URL+"/login";
  };

  const loginNotSupported = () =>{
    Swal.fire({
      icon:"warning",
      title:"Email Login not yet supported",
      text:"Sorry, we don't support login with email and password for now. Please install the Alby chrome extension to login seamlessly with your Lightning wallet",
      confirmButtonText:"Get Alby wallet",
    }).then((result)=>{
      if(result.isConfirmed){
        window.open("https://chrome.google.com/webstore/detail/alby-bitcoin-lightning-wa/iokeahhehimjnekafflcihljlcjccdbe","_blank")
      }
    })
  }


  return (
    <div className="loginContainer">
      <h3>Get started on Bit⚡Send</h3>
      <button onClick={goToLogin} className="loginPageButton">
        Connect with Lightning Wallet ⚡
      </button>

      <div className="or">
        <h2 className="orText">OR</h2>
        <div className="line"></div>
      </div>


     <div className="loginForm">
      <TextField margin="normal" fullWidth size="small" type="email" label="Email address" variant={"outlined"} />
      <TextField margin="normal" fullWidth size="small" type="password" label="Password" variant={"outlined"} />

      <PrimaryBtn
          onClick={()=>loginNotSupported()}
          title={"Get Started"}/>
      </div>

    </div>
  );
}

export default Login;
