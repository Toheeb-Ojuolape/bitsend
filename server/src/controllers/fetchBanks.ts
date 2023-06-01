require("dotenv").config();
var request = require("request");


export const fetchBanks_post = async (req: any, res: any) => {
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