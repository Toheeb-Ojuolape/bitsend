const Flutterwave = require("flutterwave-node-v3");
const CC = require("currency-converter-lt");
import createLnRpc from "@radar/lnrpc";
var request = require("request");
require("dotenv").config();
import { Request, Response } from "express";
import sendNotification from "../helpers/email";

module.exports.converter_post = async (req: Request, res: Response) => {
  let currencyConverter = new CC();
  currencyConverter
    .from(req.body.currency)
    .to(req.body.newCurrency)
    .amount(1)
    .convert()
    .then((response: any) => {
      res.status(200).json(response);
    });
};

module.exports.fetchBanks_post = async (req: Request, res: Response) => {
  var options = {
    method: "GET",
    url: "https://api.flutterwave.com/v3/banks/" + req.body.country,
    headers: {
      Authorization: "Bearer " + process.env.FLUTTERWAVE_SECRET_KEY,
    },
  };
  request(options, function (error: any, response: any) {
    if (error) res.status(400).json(error);
    res.status(200).json(JSON.parse(response.body));
  });
};

module.exports.resolvebank_post = async (req: Request, res: Response) => {
  const flw = new Flutterwave(
    process.env.FLUTTERWAVE_PUBLIC_KEY,
    process.env.FLUTTERWAVE_SECRET_KEY
  );
  const details = {
    account_number: req.body.accountNumber,
    account_bank: req.body.bank,
  };
  flw.Misc.verify_Account(details)
    .then((response: any) => res.status(200).json(response))
    .catch((error: any) => res.status(400).json(error));
};

//generate invoice
module.exports.generateInvoice_post = async (req: Request, res: Response) => {
  console.log(req.body)
  try {
    const lnRpcClient = await createLnRpc({
      server: process.env.LND_GRPC_URL,
      cert: Buffer.from(process.env.LND_TLS_CERT || "", "hex").toString(
        "utf-8"
      ), // utf8 encoded certificate
      macaroon: process.env.LND_MACAROON,
    });

    const { paymentRequest } = await lnRpcClient.addInvoice({
      value: req.body.amount,
      expiry: "300000",
      memo: req.body.accountNumber+"_"+req.body.bank
    });
    console.log(paymentRequest)
    res.status(200).json(paymentRequest);
  } catch (error: any) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports.sendemail_post = async (req: Request, res: Response) => {
  try {
    sendNotification(req.body, res);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong. Please try again later",
    });
  }
};
