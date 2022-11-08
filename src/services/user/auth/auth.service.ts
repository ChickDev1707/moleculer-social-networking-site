
"use strict";
import { Service, ServiceBroker, Context, Errors } from "moleculer";
import { AddFriendDto } from "../user/dtos/add-friend.dto";
import { CreateUserDtoSchema } from "../user/dtos/create-user.dto";

export default class UserService extends Service {

	// private userAction: UserAction;
	public constructor(public broker: ServiceBroker) {
		super(broker);
		// this.userAction = new UserAction();

		this.parseServiceSchema({
			name: "users",
			actions: {
				/**
				 * Create new user
				 * @param {Number} params
				 */
				create: () => {
					console.log("create something");
					return "create";
				},
			},
		});
	}
	// Action
	public ActionHello(): string {
		return "Hello Moleculer";
	}

	public ActionWelcome(name: string): string {
		return `Welcome, ${name}`;
	}
}
