import { Response } from "express-serve-static-core";

var nodemailer = require("nodemailer");
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
  localcurrency:string,
  localamount:Number | string,
  sats: Number | string;
  recipientemail: string;
  bank: string;
  bankname: string;
  recipientname: string;
  accountnumber: string;
  intermediaryname:string;
  intermediary:string;
  intermediaryemail:string
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
    accountName: payload.recipientname,
    amount:payload.localamount, 
    currency:payload.localcurrency,
    bankName:payload.bank,
    accountNumber:payload.accountnumber,
    intermediaryName: payload.intermediaryname,
    intermediaryEmail: payload.intermediaryemail
  });

  var mailOptions = {
    from: "Bit⚡Send <support@tippings.me>",
    to: payload.recipientemail,
    replyTo: "hello@bit-send.xyz",
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
