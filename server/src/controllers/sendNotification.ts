import sendNotification from "../helpers/email";


export const sendemail_post = async (req: any, res: any) => {
    try {
      sendNotification(req.body, res);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Something went wrong. Please try again later",
      });
    }
  };
  