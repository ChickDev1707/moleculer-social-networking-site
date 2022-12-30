"use strict";
import { Service, ServiceBroker } from "moleculer";
import * as dotenv from "dotenv";
import MailerAction from "./actions/mailer.action";
dotenv.config();

export default class MailerService extends Service {

	private action: MailerAction = new MailerAction();
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "mail",
			actions: {
				// Mailer service
				// Save image uploaded from clients
			},

		});
	}
};
