import React from "react";
import "./transactions.css";
import SenderIcon from "../../assets/SenderIcon";
import OutlinedBtn from "../Buttons/StatusBtn";
import { formatAmount, formatDate } from "../util/formatter";

function Transaction({ transaction, key,role }) {
 const updateTransaction = () =>{
    alert("This flow requires HODL invoice")
 }
  return (
    <div key={key} className="transactionGrid">
      <div>
        <SenderIcon />
      </div>
      <div>
        <div className="transactionTitle">
          Payment to {transaction.recipientname}
        </div>
        <div className="transactionDetails">
          <span className="subtitle">
            Amount: {formatAmount(transaction.amount)} sats{" "}
          </span>
          <span className="subtitle">
            Date: {formatDate(transaction.created_at)}
          </span>
        </div>
      </div>
      <div>
        {role ==='sender' ? <OutlinedBtn
          title={transaction.status}
          disabled={true}
          className={transaction.status}
        />
        :
        <OutlinedBtn
          onClick={updateTransaction}
          title={transaction.status ==="pending"?"Mark as complete":""}
          disabled={false}
          className={transaction.status}
        />
        }
      </div>
    </div>
  );
}

export default Transaction;
