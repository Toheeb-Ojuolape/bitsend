const Flutterwave = require("flutterwave-node-v3");
const CC = require("currency-converter-lt");
var request = require("request");
const flutterwaveSecretKey = "FLWSECK-060d8e91ea7b8c09db7aaf147739f230-X"

module.exports.converter_post = async (req, res) => {
  let currencyConverter = new CC();
  currencyConverter
    .from(req.body.currency)
    .to(req.body.newCurrency)
    .amount(1)
    .convert()
    .then((response) => {
      res.status(200).json(response);
    });
};

module.exports.fetchBanks_post = async (req, res) => {
  var options = {
    method: "GET",
    url: "https://api.flutterwave.com/v3/banks/NG",
    headers: {
      Authorization: "Bearer "+flutterwaveSecretKey,
    },
  };
  request(options, function (error, response) {
    if (error) res.status(400).json(error)
    res.status(200).json(JSON.parse(response.body))
  });
};

module.exports.resolvebank_post = async (req, res) => {
  const flw = new Flutterwave(
    "FLWPUBK-f92a354d64f5b330062fe7928f4321f6-X",
    "FLWSECK-060d8e91ea7b8c09db7aaf147739f230-X"
  );
  const details = {
    account_number: req.body.accountNumber,
    account_bank: req.body.bank,
  };
  flw.Misc.verify_Account(details)
    .then((response) => res.status(200).json(response))
    .catch((error) => res.status(400).json(error));
};
