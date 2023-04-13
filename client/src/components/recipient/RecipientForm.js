import React from "react";
import "./RecipientForm.css";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import SearchForm from "../Forms/SearchForm";
import InputNumber from "../Forms/InputNumber";
import InputText from "../Forms/InputText";
import axios from "axios";
import Loader from "../Loaders/Overlay";
import InputEmail from "../Forms/InputEmail";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPayment } from "../../store/payment";

function RecipientForm(props) {
  const [email, setEmail] = React.useState("");
  const [bank, setBank] = React.useState("");
  const [accountName, setAccountName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [accountNumer, setAccountNumberValue] = React.useState("");
  const dispatch = useDispatch();
  const history = useNavigate();
  const payment = useSelector((state) => state.payment.value);

  const continuePayment = () => {
    const payload = {
      email: email ? email : payment.email,
      bank:
        props.bank &&
        props.bank.filter((bankId) =>
          bankId.name === bank ? bank : payment.bankName
        )[0].code,
      bankName: bank ? bank : payment.bankName,
      accountName: accountName ? accountName : payment.accountName,
      accountNumber: accountNumer ? accountNumer : payment.accountNumber,
    };
    dispatch(setPayment({ ...payment, ...payload }));
    history("/invoice");
  };

  const setAccountNumber = (e) => {
    if (e.length === 10) {
      setAccountNumberValue(e);
      setLoading(true);
      axios({
        method: "POST",
        url: "http://localhost:3000/resolve-bank",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        data: {
          bank:
            props.bank &&
            props.bank.filter((bankId) => bankId.name === bank)[0].code,
          accountNumber: e,
        },
      })
        .then((response) => {
          setAccountName(response.data.data.account_name);
          setLoading(false);
          console.log(email);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="paymentContainer">
      <div className="paymentCard">
        {loading && <Loader />}

        <InputEmail
          onChange={(e) => setEmail(e)}
          disabled={false}
          label={"Recipient Email (required)"}
          value={payment.email}
        />

        <SearchForm
          label={"Choose Bank (required)"}
          options={props.bank}
          onChange={(event) => setBank(event.target.value)}
          defaultValue={payment.bankName}
        />

        <InputNumber
          onChange={(e) => setAccountNumber(e)}
          label={"Account Number"}
          value={payment.accountNumber}
        />

        <InputText
          value={accountName ? accountName : payment.accountName}
          disabled={true}
          label={"Recipient Name"}
        />
        
        <PrimaryBtn
          disabled={
            accountName === "" && payment.accountName === undefined ? true : false
          }
          title={"Continue"}
          onClick={continuePayment}
        />
      </div>
    </div>
  );
}

export default RecipientForm;
