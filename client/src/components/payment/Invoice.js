import React from "react";
import QRCode from "react-qr-code";
import { MdCopyAll } from "react-icons/md";
import {toast,Toaster} from "react-hot-toast"
import Countdown from "./Countdown";
import ReactCountryFlag from "react-country-flag"

function Invoice(props) {

  const copyInvoice = (invoice) =>{
    navigator.clipboard.writeText(invoice);
    toast.success('Invoice copied to clipboard');
  }
  return (
    <div id="invoice" className="text-center">
      <Toaster/>
      <Countdown />
      <h3>Scan to Pay {props.user.name} <ReactCountryFlag countryCode={props.user.country} svg /></h3>
      <p className="brandcolor"> Invoice amount: {props.payment.sats.toFixed(0)} sats ({props.payment.currency} {props.payment.amount})</p>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={props.invoice}
        viewBox={`0 0 256 256`}
      />

      <div className="invoiceContainer">
        {props.invoice.slice(0, 25) + "..."} <MdCopyAll onClick={()=>copyInvoice(props.invoice)} className="cursor"/>{" "}
      </div>

      <p>
        How to pay a{" "}
        <a
          href="https://www.youtube.com/watch?v=bv-Q5E9X_7w"
          rel="noreferrer"
          target="_blank"
        >
          Lightning Invoice
        </a>
      </p>
    </div>
  );
}

export default Invoice;
