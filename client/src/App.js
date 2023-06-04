import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { MdInbox, MdLogout } from "react-icons/md";
import Home from "./pages/Home";
import Login from "./pages/Login"
import { useEffect, useState } from "react";
import axios from "axios";
import Recipient from "./pages/Recipient";
import Invoice from "./pages/Invoice";
import { io } from "socket.io-client";
import { store } from "./store/store";
import { Provider } from "react-redux";
import avatar from "./assets/user.png"
import Transactions from "./pages/Transactions";


function App() {
  const [user, setUser] = useState(null);
  let navigate = useNavigate()

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on("connect", () => {
      console.log("Connected to server.");
    });

    axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_URL+"/user",
    }).then((res) => {
      res.data.id ? setUser(res.data.id) : setUser(null);
      console.log(res);
      sessionStorage.setItem("userId",res.data.id)
    });
  }, []);

  const navigateHome = () => {
    navigate("/");
  };

  const navigateLogin = () => {
    window.location.replace(process.env.REACT_APP_API_URL+"/login");
  };

  const navigateLogout = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: process.env.REACT_APP_API_URL+"/logout",
    }).then((res) => {
      setUser(null);
      console.log(res);
      window.location.reload()
    }).catch((error)=>{
      window.location.reload()
    })
  };

  const goToTransaction = () =>{
    window.location.href = "/transactions"
  }

  return (
    <div>
      <nav className="navHeader">

        <div className="headerLayout">
        <h2 className="navTitle" onClick={navigateHome}>
          Bit ⚡ Send
        </h2>

        {user && <div onClick={goToTransaction} className="transactions"><MdInbox size={"25px"} className="transactionIcon"/> <div className="text">Transactions</div></div>}
        </div>
        {user == null ? (
          <div>
            <div className="loginButton" onClick={navigateLogin}>
              Login ⚡
            </div>
          </div>
        ) : (
          <div className="cpLayout" onClick={navigateLogout}>
            <img src={avatar} width={"40px"} alt={""}/>
            <span className="user"> {user}</span>
            <MdLogout className="cpIcon" />
            <h4 className="navCP">Logout</h4>
          </div>
        )}
      </nav>

      <Provider store={store}>
        <Routes>
          {user == null ? (
            <Route path="/" element={<Login />} />
          ) : (
            <Route path="/" element={<Home />} />
          )}
          <Route path="/recipient" element={<Recipient />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/transactions" element={<Transactions/>}/>
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
