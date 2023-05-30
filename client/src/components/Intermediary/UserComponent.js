import React from "react";
import avatar from "../../assets/user.png";
import ReactCountryFlag from "react-country-flag"

function UserComponent({ user, onClick }) {
  const setUser  = () =>{
    onClick(user)
  }
  return (
    <div onClick={() => setUser()} className="card">
      <img src={avatar} alt="user" />
      <p>{user.name}</p>
      <span><ReactCountryFlag countryCode={user.country} svg /></span>
    </div>
  );
}

export default UserComponent;
