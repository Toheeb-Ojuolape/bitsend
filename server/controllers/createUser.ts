import { handleErrors, handleSuccess } from "../helpers/handlers";
import { Request, Response } from "express";
import fetchUserToken from "../helpers/fetchUserToken";
import supabase from "../database/supabase";

export const createuser_post = async (req: Request, res: Response) => {
  try {
    const { name, email, country, code, pubkey } = req.body;
    // Get the user's accessToken and refreshToken from Alby before storing the user's data
    const userTokens: any = await fetchUserToken(code);
    const tokens = JSON.parse(userTokens);
    if (tokens.error) {
      handleErrors(res, { message: tokens.error_description });
      return;
    }

    console.log(name,email,country,code,pubkey)


    const { data, error } = await supabase.from("users").insert([
      {
        name,
        email,
        country,
        accesstoken: tokens.access_token,
        refreshtoken: tokens.refresh_token,
        pubkey,
      },
    ]);


    if (error) {
      handleErrors(res, { message: error.message });
    }

    if (data ===null){
      handleSuccess(res,{
        message: "User created successfully",
        data: { pubkey: pubkey },
      })
    }
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



//currently experiencing a supabase error where data is null for successful insertion of record