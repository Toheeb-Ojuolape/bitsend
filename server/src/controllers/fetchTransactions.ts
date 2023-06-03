import { Request, Response } from "express-serve-static-core";
import supabase from "../database/supabase";
import { handleErrors, handleSuccess } from "../helpers/handlers";

export const fetchTransactions_get = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.query;
    const { data, error } = await supabase
      .from("transactions")
      .select()
      .eq(role, id);
    if (error) {
      handleErrors(res, { message: "Could not fetch transactions" });
      return;
    }

    if (data) {
      handleSuccess(res, {
        message: "Transactions fetched successfully",
        data,
      });
    }
  } catch (error:any) {
    handleErrors(res,{message:error.message})
  }
};
