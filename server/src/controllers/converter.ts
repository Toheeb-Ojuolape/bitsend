const CC = require("currency-converter-lt");

export const converter_post = async (req: any, res: any) => {
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