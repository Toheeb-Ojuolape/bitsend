var nodemailer = require("nodemailer");
import { Response } from "express";
const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
// read the contents of the email template file
const templatePath = path.join(__dirname, "../templates/email.hbs");
const template = fs.readFileSync(templatePath, "utf-8");

// compile the template using Handlebars
const compiledTemplate = Handlebars.compile(template);

export interface Payload {
  amount: string;
  currency: string;
  destination: string;
  localCurrency:string,
  localAmount:Number | string,
  sats: Number | string;
  email: string;
  bank: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

async function sendNotification(payload: Payload, res: Response) {
  var mail = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "tips.tell.africa@gmail.com",
      pass: "cllohurtneydjpfj",
    },
  });

  const html = compiledTemplate({
    accountName: payload.accountName,
    amount:payload.localAmount, 
    currency:payload.localCurrency,
    bankName:payload.bankName,
    accountNumber:payload.accountNumber,
  });

  var mailOptions = {
    from: "Bit⚡Send <support@tippings.me>",
    to: payload.email,
    replyTo: "hello@lnchat.com",
    subject: "Payment Received from Bit⚡Send",
    html: html,
  };

  mail.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      return;
    } else {
      res.status(200).json({
        message: "Email sent successfully",
      });
      return;
    }
  });
}

export default sendNotification;
