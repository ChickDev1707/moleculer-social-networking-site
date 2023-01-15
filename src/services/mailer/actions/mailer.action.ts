
import * as fs from "fs";
import * as path from "path";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { Context } from "moleculer";
import fetch from "node-fetch";
import { SendMailDto } from "../dtos/send-mail.dto";
import { handleError } from "../../../utils/erros.util";

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

    try {
      const mailOptions: any = {
        to: ctx.params.receiver,
        from: process.env.MAILER_USER,
        subject: ctx.params.subject,
      };
      if (ctx.params.content) {
        mailOptions.text = ctx.params.content;
      }
      if (ctx.params.template) {
        const rootPath = path.resolve("./");
        let data = fs.readFileSync(`${rootPath}/public/mail-template/${ctx.params.template}.html`, "utf8");
        data = data.replace("{{verify-link}}", `http://localhost:3000/api/users/validate?accountId=${ctx.params.payload?.accountId}`);
        mailOptions.html = data;
      }
      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      handleError(error);
    }
  };
  public validateEmail = async (ctx: Context<{ email: string }>) => {
    try {
      const api = `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.MAILER_VALIDATION_API_KEY}&email=${ctx.params.email}`;

      const validateRes = await fetch(api);
      const data: any = await validateRes.json();
      return data.is_smtp_valid?.value === true;
    } catch (error) {
      handleError(error);
    }
  };
};
