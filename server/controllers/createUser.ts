//create a user account for user who has agreed to be an intermediary
import client from "../database/database";
import { handleErrors, handleSuccess } from "../helpers/handlers";

export const createuser_post = async (req: any, res: any) => {
  try {
    (async () => {
      await client.connect();
      const result = await client.query(
        `insert into users(pubKey,name,email,country) values($1,$2,$3,$4) RETURNING pubKey`,
        [req.body.pubKey, req.body.name, req.body.email, req.body.country]
      );
      console.log(result.rows);
      console.log(result.rowCount);
      handleSuccess(res, {
        message: "User created successfully",
        data: { pubKey: req.body.pubKey },
      });
      client.end();
    })();
  } catch (error: any) {
    handleErrors(res, { message: error.message });
  }
};
