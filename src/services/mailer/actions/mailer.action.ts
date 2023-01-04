
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { Context } from "moleculer";
import { SendMailDto } from "../dtos/send-mail.dto";

dotenv.config();

export default class MailerAction {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });
  public sendSingleMail = async (ctx: Context<SendMailDto>) => {

    const mailOptions = {
      to: ctx.params.receiver,
      from: process.env.MAILER_USER,
      subject: ctx.params.subject,
      text: ctx.params.content,
    };
    const result = await this.transporter.sendMail(mailOptions);
    return result;
  };
};
