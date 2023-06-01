import { Request, Response } from "express";
import fetchAccessToken from "../helpers/fetchAccessToken";
import { handleErrors, handleSuccess } from "../helpers/handlers";
import generateInvoice from "../helpers/generateInvoice";
import supabase from "../database/supabase";

//generate invoice
export const generateInvoice_post = async (req: Request, res: Response) => {
  const {id} = req.body
  try {
    //use refreshToken to generate fresh accessToken
    const response: any = await fetchAccessToken(req);
    const accessToken = JSON.parse(response);
    //update the user's refreshToken with the new refreshToken
    const {data,error} = await supabase.from("users").update({refreshtoken:accessToken.refresh_token}).eq("id",id)

    if(error){
      handleErrors(res,{
        message:"Something wrong with fetching data"
      })
      return
    }

    if(data === null){
      console.log("refresh token updated")
    }
   
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



//also getting data as null on updating user's refresh token