require("dotenv").config();
var request = require("request");
import { Request } from "express";

async function fetchAccessToken(req: Request) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        method: "POST",
        url: process.env.ALBY_TOKEN_API,
        headers: {
         'Content-Type': 'multipart/form-data',
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.ALBY_CLIENT_ID + ":" + process.env.ALBY_SECRET_ID
            ).toString("base64"),
        },
        formData: {
          refresh_token: req.body.refreshToken,
          grant_type: "refresh_token"
        },
      };
      request(options, function (error: any, response: any, body: any) {
        if (error) {
          reject(error.message);
        } else {
          resolve(body);
        }
      });
    } catch (error: any) {
      reject(error.message);
    }
  });
}

export default fetchAccessToken;
