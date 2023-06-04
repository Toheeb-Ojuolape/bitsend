import { Request, Response } from "express-serve-static-core";
import sendNotification from "../helpers/email";


export const sendemail_post = async (req: Request, res: Response) => {
    try {
      sendNotification(req.body, res);
    } catch (error) {
      res.status(400).json({
        message: "Something went wrong. Please try again later",
      });
    }
  };
  