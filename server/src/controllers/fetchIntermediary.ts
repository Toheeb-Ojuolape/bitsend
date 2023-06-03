import { handleErrors, handleSuccess } from "../helpers/handlers";
import supabase from "../database/supabase";
import { Request, Response } from "express-serve-static-core";

// use this endpoint to find an intermediary based on the country of the user
export const fetchIntermediary_post = async (req: Request, res: Response) => {
  const {country} = req.body
  try {
    const { data, error } = await supabase.from("users").select().eq("country",country);
    if(error){
      handleErrors(res,{message:"Could not fetch users"})
      return
    }
    if(data){
      handleSuccess(res,{
        message:"Intermediaries fetched successfully",
        data
      })
    }
  } catch(error:any) {
    handleErrors(res,{message:error.message})
  }
};
