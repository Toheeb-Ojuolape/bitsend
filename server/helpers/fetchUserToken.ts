require("dotenv").config();
var request = require("request");

async function fetchUserToken(code: string) {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        method: "POST",
        url: process.env.ALBY_TOKEN_API,
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.ALBY_CLIENT_ID + ":" + process.env.ALBY_SECRET_ID
            ).toString("base64"),
        },
        formData: {
          code: code,
          grant_type: "authorization_code",
          redirect_uri: process.env.REDIRECT_URL,
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

export default fetchUserToken;
