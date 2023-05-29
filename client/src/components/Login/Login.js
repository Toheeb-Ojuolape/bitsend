import React from "react";
import "./Login.css";
import { TextField } from "@mui/material";
import PrimaryBtn from "../Buttons/PrimaryBtn";

function Login() {
  const goToLogin = () => {
    window.location.href = process.env.REACT_APP_API_URL+"/login";
  };
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
          nextStep={()=>console.log("no login yet")}
          title={"Get Started"}/>
      </div>

    </div>
  );
}

export default Login;
