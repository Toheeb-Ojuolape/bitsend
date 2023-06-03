import { Request, Response } from "express-serve-static-core";
import supabase from "../database/supabase";
import { handleErrors } from "../helpers/handlers";
import sendNotification from "../helpers/email";

export const createTransaction_post = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const {
      intermediaryname,
      intermediaryemail,
      intermediary,
      sender,
      amount,
      localamount,
      bank,
      bankcode,
      accountnumber,
      recipientname,
      country,
      recipientemail,
      localcurrency,
      exchangecurrency,
      exchangeamount
    } = req.body;



    const { data, error } = await supabase.from("transactions").insert([
      {
        intermediaryname,
        intermediaryemail,
        intermediary,
        sender,
        amount,
        localamount,
        bank,
        bankcode,
        accountnumber,
        recipientname,
        country,
        recipientemail,
        localcurrency,
        exchangecurrency,
        exchangeamount,
        settled_at:null,
        status:"pending",
      },
    ]);

    if (error) {
        console.log(error)
        handleErrors(res, { message: error.message });
        return
      }
  
      if (data ===null){
        sendNotification(req.body,res)
      }
  } catch (error) {
    console.log(error)
  }
};
