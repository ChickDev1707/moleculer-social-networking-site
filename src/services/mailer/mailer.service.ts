"use strict";
import { Service, ServiceBroker } from "moleculer";
import * as dotenv from "dotenv";
import MailerAction from "./actions/mailer.action";
import { SendMailDtoSchema } from "./dtos/send-mail.dto";
dotenv.config();

export default class MailerService extends Service {

	private action: MailerAction = new MailerAction();
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "mail",
			actions: {
				// Mailer service
        sendMail: {
          rest: {
            method: "POST",
            path: "/single",
          },
					params: SendMailDtoSchema,
          handler: this.action.sendSingleMail,
        },
			},
		});
	}
};
