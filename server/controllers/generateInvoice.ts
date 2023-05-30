import { Request, Response } from "express";
import fetchAccessToken from "../helpers/fetchAccessToken";
import { handleErrors, handleSuccess } from "../helpers/handlers";
import client from "../database/database";
import generateInvoice from "../helpers/generateInvoice";
var request = require("request");

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
        console.log("accessToken", accessToken.refresh_token, req.body.id);
        // Perform the database operation
        const result = await client.query(
          `UPDATE users SET refreshtoken = $1 WHERE id = $2`,
          [accessToken.refresh_token, req.body.id]
        );
        // Handle success and send response
        if (result.rowCount) {
          console.log("User refresh token updated successfully!");
        } else {
          console.log("User not found or refresh token not updated.");
        }
        return;
      } catch (error: any) {
        return;
      }
    })();
   
    const info:any = await generateInvoice(accessToken,req)
    if(JSON.parse(info).error){
      handleErrors(res,JSON.parse(info))
      return
    }

    handleSuccess(res,{
      message:"Invoice fetched successfully",
      data:JSON.parse(info)
    })

  } catch (error: any) {
    handleErrors(res, { message: error.message });
  }
};
