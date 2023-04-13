import React from "react";
import HomeComponent from "../components/home/Home";
import { useSelector } from "react-redux";

function Home() {
  const payment = useSelector((state) => state.payment.value);
  return <HomeComponent payment={payment} />;
}

export default Home;