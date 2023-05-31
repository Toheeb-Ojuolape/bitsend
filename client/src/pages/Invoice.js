import React, { useEffect } from "react";
import InvoiceComponent from "../components/payment/Invoice";
import SuccessComponent from "../components/payment/SuccessComponent";
import axios from "axios";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import Loader from "../components/Loaders/Overlay";
import ShowIntermediaryModal from "../components/Modals/ShowIntermediaryModal";
import Swal from "sweetalert2"

function Invoice() {
  const [invoice, setInvoice] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [user,setUser] = React.useState("")
  const payment = useSelector((state) => state.payment.value);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on("payment-completed", () => {
      setLoading(true);
      axios({
        method: "POST",
        url: process.env.REACT_APP_API_URL + "/send-email",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        data: payment,
      })
        .then((response) => {
          setLoading(false);
          console.log(response);
          document.getElementById("invoice").style.display = "none";
          document.getElementById("success").style.display = "block";
        })
        .catch((error) => {
          alert(error);
        });
    });
  }, [payment]);

  useEffect(() => {
    setLoading(true);
    axios({
      method: "POST",
      url: process.env.REACT_APP_API_URL + "/fetch-intermediary",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      data: {
        country: payment.destination,
      },
    }).then((response) => {
      //show intermediary options available
      console.log(response);
      setUsers(response.data.data);
      setLoading(false);
      setShowModal(true);
      // generateInvoice(response.data.data)
    });
  }, [payment]);

  const generateInvoice = (data) => {
    console.log(data)
    setUser(data)
    setShowModal(false);
    setLoading(true);
    axios({
      method: "POST",
      url: process.env.REACT_APP_API_URL + "/generate-invoice",
      data: {
        accessToken: data.accesstoken,
        refreshToken: data.refreshtoken,
        amount: payment.sats,
        memo:
          payment.bankName +
          " " +
          payment.accountName +
          " " +
          payment.accountNumber,
        payerPubKey: sessionStorage.getItem("userId"),
        id:data.id
      },
    })
      .then((response) => {
        setInvoice(response.data.data.payment_request)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
        Swal.fire({
          icon:"error",
          title:"Something's wrong 🤔",
          text:error.response.data.message
        })
      });
  };

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      {loading && <Loader />}
      <InvoiceComponent invoice={invoice} payment={payment} user={user} />
      <ShowIntermediaryModal
        showModal={showModal}
        onClose={onClose}
        data={users}
        generateInvoice={generateInvoice}
        destination={payment.destination}
      />
      <SuccessComponent payment={payment} />
    </div>
  );
}

export default Invoice;
