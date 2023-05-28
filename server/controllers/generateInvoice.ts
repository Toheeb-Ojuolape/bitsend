import createLnRpc from "@radar/lnrpc";
require("dotenv").config();
import { Request, Response } from "express";



//generate invoice
export const generateInvoice_post = async (req: Request, res: Response) => {
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