//create a user account for user who has agreed to be an intermediary
import client from "../database/database";
import { handleErrors, handleSuccess } from "../helpers/handlers";

export const createuser_post = async (req: any, res: any) => {
  try {
    (async () => {
      await client.connect();
      const result = await client.query(
        `insert into card_table(id,cardno,cardcvv,cardexpiry) values($1,$2,$3,$4) RETURNING id`,
        [req.body.id, req.body.cardno, req.body.cardcvv, req.body.cardexpiry]
      );
      handleSuccess(res, {
        message: "User created successfully",
        data: { pubKey: req.body.pubKey },
      });
      client.end();
    })();
  } catch (error: any) {
    console.log(error)
    handleErrors(res, { message: error.message });
  }
};
