import React from "react";
import "./transactions.css";
import Transaction from "./Transaction";

function TransactionComponent({ role, setRole,transactions }) {
  const setRoleValue = (role) => {
    setRole(role);
  };

  return (
    <div className="transactionsContainer">
      <div className="tabGrid">
        <div
          onClick={() => setRoleValue("sender")}
          className={role === "sender" ? "tab activeTab" : "tab"}
        >
          As sender
        </div>
        <div
          onClick={() => setRoleValue("intermediary")}
          className={role === "intermediary" ? "tab activeTab" : "tab"}
        >
          As intermediary
        </div>
      </div>

      <div className="transactionList">{
        transactions.map((transaction,i)=>(
            <Transaction transaction={transaction} key={i} role={role} />
        ))
        }</div>
    </div>
  );
}

export default TransactionComponent;
