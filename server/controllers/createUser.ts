import client from "../database/database";
import { handleErrors, handleSuccess } from "../helpers/handlers";
import { Request, Response } from "express";
import fetchUserToken from "../helpers/fetchUserToken";

export const createuser_post = async (req: Request, res: Response) => {
  try {
    // Get the user's accessToken and refreshToken from Alby before storing the user's data
    const userTokens: any = await fetchUserToken(req.body.code);
    const tokens = JSON.parse(userTokens);
    console.log(tokens);
    if (tokens.error) {
      handleErrors(res, { message: tokens.error_description });
      return;
    }

    (async () => {
      try {
        // Perform the database operation
        const result = await client.query(
          `insert into users(name, email, country,accesstoken,refreshtoken,pubkey) values($1, $2, $3, $4,$5,$6) RETURNING id`,
          [
            req.body.name,
            req.body.email,
            req.body.country,
            tokens.access_token,
            tokens.refresh_token,
            req.body.pubKey
          ]
        );

        // Handle success and send response
        handleSuccess(res, {
          message: "User created successfully",
          data: { pubKey: req.body.pubKey },
        })
      } catch (error: any) {
        if (error.code === "23505" && error.constraint === "users_id_key") {
          handleErrors(res, { message: error.message });
        } else {
          handleErrors(res, { message: error.message });
        }
      }
    })();
  } catch (error: any) {
    if (error.code === "23505" && error.constraint === "users_id_key") {
      handleErrors(res, {
        message: "User with this information already exists. Please check",
      });
    } else {
      handleErrors(res, { message: "Something's wrong. Please wait" });
    }
  }
};
