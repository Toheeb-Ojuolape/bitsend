import React from "react";
import avatar from "../../assets/user.png";

function UserComponent({ user, onClick }) {
  const setUser  = () =>{
    onClick(user)
  }
  return (
    <div onClick={() => setUser()} className="card">
      <img src={avatar} alt="user" />
      <p>{user.name}</p>
    </div>
  );
}

export default UserComponent;
