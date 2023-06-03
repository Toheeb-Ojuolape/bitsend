import { Request, Response } from "express-serve-static-core";
import supabase from "../database/supabase";
import { handleErrors,handleSuccess } from "../helpers/handlers";

export const createTransaction_post = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const {
      intermediary,
      sender,
      amount,
      localamount,
      bank,
      bankcode,
      accountnumber,
      recipientname,
      country
    } = req.body;
    const { data, error } = await supabase.from("transactions").insert([
      {
        intermediary,
        sender,
        amount,
        localamount,
        bank,
        bankcode,
        accountnumber,
        recipientname,
        country,
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
        handleSuccess(res,{
          message: "Transaction created successfully",
          data: { id:intermediary  },
        })
      }
  } catch (error) {
    console.log(error)
  }
};
