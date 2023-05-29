import { Request,Response } from "express"
import client from "../database/database";
import { handleErrors,handleSuccess } from "../helpers/handlers";

// use this endpoint to find an intermediary based on the country of the user
export const fetchIntermediary_post = (req:Request,res:Response) =>{
    try{

        (async () => {
            try {
              // Connect to the database
              // Perform the database operation
              const result = await client.query(
                `SELECT * FROM users WHERE country = $1`,
                [
                  req.body.country
                ]
              );
              // Handle success and send response
              handleSuccess(res, {
                message: "Intermediary user data fetched",
                data: result.rows,
              });
            } catch (error: any) {
              if (error.code === "23505" && error.constraint === "users_id_key") {
                handleErrors(res, { message: error.message });
              } else {
                handleErrors(res, { message: error.message });
              }
            }
          })();
    }

    catch{

    }
}