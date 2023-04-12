import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import Home from "./components/home/Home";
import CreatePost from "./components/createPost/CreatePost";
import Post from "./components/post/Post";
import Paywall from "./components/paywall/Paywall";
import { useEffect, useState } from "react";
import axios from "axios";
import Recipient from "./pages/Recipient";
import Invoice from "./pages/Invoice";
import { io } from "socket.io-client";

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
    });
  },[socket]);

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/paywall" element={<Paywall />} />
        <Route path="/recipient" element={<Recipient />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </div>
  );
}

export default App;
