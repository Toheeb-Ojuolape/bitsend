import sendNotification from "../helpers/email";
import { Request, Response } from "express";

export const sendemail_post = async (req: Request, res: Response) => {
    try {
      sendNotification(req.body, res);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Something went wrong. Please try again later",
      });
    }
  };
  