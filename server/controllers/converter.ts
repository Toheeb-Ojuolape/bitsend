const CC = require("currency-converter-lt");
import { Request, Response } from "express";

export const converter_post = async (req: Request, res: Response) => {
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