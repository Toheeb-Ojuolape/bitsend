require("dotenv").config();
const Flutterwave = require("flutterwave-node-v3");
import { Request, Response } from "express";

export const resolvebank_post = async (req: Request, res: Response) => {
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