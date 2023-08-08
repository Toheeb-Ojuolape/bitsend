require("dotenv").config();
var request = require("request");
import { AccessToken } from "../interface/responses";
import { Request } from "express-serve-static-core";

async function generateInvoice(accessToken:AccessToken,req:Request) {
  return new Promise((resolve, reject) => {
    try {
        var options = {
            method: "POST",
            url: process.env.ALBY_API_URL + "/invoices",
            headers: {
              Authorization: "Bearer " + accessToken.access_token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "amount": parseInt(req.body.amount),
              "memo": req.body.memo
            })
          };
          request(options, function (error: any, response: any,body: any) {
            if (error) {
                reject(error.message);
              } else {
                resolve(body);
              }
            })
    } catch (error: any) {
      reject(error.message);
    }
  });
}

export default generateInvoice;





















 
 