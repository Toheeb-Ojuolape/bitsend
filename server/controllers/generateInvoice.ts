import { Request, Response } from "express";
import fetchAccessToken from "../helpers/fetchAccessToken";
import { handleErrors, handleSuccess } from "../helpers/handlers";
import axios from "axios";
import client from "../database/database";

//generate invoice
export const generateInvoice_post = async (req: Request, res: Response) => {
  try {

    //use refreshToken to generate fresh accessToken
    const response: any = await fetchAccessToken(req);
    const accessToken = JSON.parse(response);
    console.log(accessToken.refresh_token);
    //update the user's refreshToken with the new refreshToken
    (async () => {
      try {
        console.log("accessToken",accessToken.refresh_token,req.body.id)
        // Perform the database operation
        const result = await client.query(
          `UPDATE users SET refreshtoken = $1 WHERE id = $2`,
          [accessToken.refresh_token, req.body.id]
        );
        // Handle success and send response
        if (result.rowCount) {
          console.log('User refresh token updated successfully!');
        } else {
          console.log('User not found or refresh token not updated.');
        }
        return;
      } catch (error: any) {
        return;
      }
    })();

    // generate invoice
    console.log(accessToken.access_token)
    let data = JSON.stringify(
      {
        amount: req.body.amount,
        memo: req.body.memo,
      }
    );

    axios({
      method: "POST",
      url: process.env.ALBY_API_URL+"/invoices",
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + accessToken.access_token,
      },
      data:data,
    }).then((response) => {
      handleSuccess(res, {
        message: "Invoice created successfully",
        data: response,
      });
    });
  } catch (error: any) {
    handleErrors(res, { message: error.message });
  }
};
