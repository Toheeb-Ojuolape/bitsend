import React from "react";
import QRCode from "react-qr-code";
import { MdCopyAll } from "react-icons/md";

function Invoice(props) {
  return (
    <div className="text-center">
      <h2 >Invoice</h2>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={props.invoice}
        viewBox={`0 0 256 256`}
      />


      <div className="invoiceContainer">{props.invoice.slice(0,25)+"..."} <MdCopyAll /> </div>


      <p>How to pay a <a href="https://www.youtube.com/watch?v=bv-Q5E9X_7w" rel="noreferrer" target="_blank">Lightning Invoice</a></p>
    </div>
  );
}

export default Invoice;
