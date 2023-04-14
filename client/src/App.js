import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import Home from "./pages/Home";
import Login from "./pages/Login"
import { useEffect, useState } from "react";
import axios from "axios";
import Recipient from "./pages/Recipient";
import Invoice from "./pages/Invoice";
import { io } from "socket.io-client";
import { store } from "./store/store";
import { Provider } from "react-redux";


function App() {
  const [user, setUser] = useState(null);
  let navigate = useNavigate();
  const socket = io("http://localhost:3000");

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Connected to server.");
    });

    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3000/user",
    }).then((res) => {
      res.data.id ? setUser(res.data.id) : setUser(null);
      console.log(res);
      sessionStorage.setItem("userId",res.data.id)
    });
  }, [socket]);

  const navigateHome = () => {
    navigate("/");
  };

  const navigateLogin = () => {
    window.location.replace("http://localhost:3000/login");
  };

  const navigateLogout = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:3000/logout",
    }).then((res) => {
      setUser(null);
      console.log(res);
      window.location.href="/"
    });
  };

  return (
    <div>
      <nav>
        <h2 className="navTitle" onClick={navigateHome}>
          Bit ⚡ Send
        </h2>

        {user == null ? (
          <div>
            <div className="loginButton" onClick={navigateLogin}>
              Login ⚡
            </div>
          </div>
        ) : (
          <div className="cpLayout" onClick={navigateLogout}>
            <p className="user">Logged in as: {user}</p>
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
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
