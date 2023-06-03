import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionComponent from "../components/transactions/TransactionComponent";
import Loader from "../components/Loaders/Overlay";

function Transactions() {
  const [role, setRole] = useState("sender");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios({
      method: "GET",
      url:
        process.env.REACT_APP_API_URL +
        "/transactions?id=" +
        sessionStorage.getItem("userId") +
        "&role=sender",
    })
      .then((response) => {
        setLoading(false);
        console.log(response);
        setTransactions(response.data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [setLoading]);

  const fetchTransactions = (role) => {
    setRole(role);
    setLoading(true);
    axios({
      method: "GET",
      url:
        process.env.REACT_APP_API_URL +
        "/transactions?id=" +
        sessionStorage.getItem("userId") +
        "&role=" +
        role,
    })
      .then((response) => {
        setLoading(false);
        console.log(response);
        setTransactions(response.data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="homePage">
      {loading && <Loader />}
      <h2 className="brandcolor">Transactions</h2>
      <TransactionComponent
        role={role}
        setRole={(role) => fetchTransactions(role)}
        transactions={transactions}
      />
    </div>
  );
}

export default Transactions;
