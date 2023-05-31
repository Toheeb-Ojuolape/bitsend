import { Request, Response } from "express";
import fetchAccessToken from "../helpers/fetchAccessToken";
import { handleErrors, handleSuccess } from "../helpers/handlers";
import client from "../database/database";
import generateInvoice from "../helpers/generateInvoice";

//generate invoice
export const generateInvoice_post = async (req: Request, res: Response) => {
  try {
    //use refreshToken to generate fresh accessToken
    const response: any = await fetchAccessToken(req);
    const accessToken = JSON.parse(response);
    //update the user's refreshToken with the new refreshToken
    (async () => {
      try {
        // Perform the database operation
        const result = await client.query(
          `UPDATE users SET refreshtoken = $1 WHERE id = $2`,
          [accessToken.refresh_token, req.body.id]
        );
        // Handle success and send response
        console.log("refreshToken updated")
        return;
      } catch (error: any) {
        return;
      }
    })();
   
    const info:any = await generateInvoice(accessToken,req)
    console.log(info)
    if(JSON.parse(info).error){
      handleErrors(res,JSON.parse(info))
      return
    }

    handleSuccess(res,{
      message:"Invoice fetched successfully",
      data:JSON.parse(info)
    })

  } catch (error: any) {
    console.log("catch error",error)
    handleErrors(res, { message: error.message });
  }
};
